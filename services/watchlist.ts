import { randomUUID } from "node:crypto";
import { supabase } from "@/lib/supabase";
import type { WatchlistItem } from "@/types/stock";

const inMemoryWatchlist = new Map<string, WatchlistItem>();
const fallbackUserId = "local-user";

function normalizedSymbol(symbol: string): string {
  return symbol.trim().toUpperCase().replace(".NS", "").replace(".BO", "");
}

async function ensureUserId(): Promise<string> {
  if (!supabase) return fallbackUserId;

  const email = process.env.WATCHLIST_USER_EMAIL || "trader@example.com";

  const existing = await supabase.from("users").select("id").eq("email", email).maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data?.id) return existing.data.id;

  const created = await supabase.from("users").insert({ email }).select("id").single();
  if (created.error) throw created.error;
  if (created.data?.id) return created.data.id;

  throw new Error("Unable to create watchlist user");
}

export async function listWatchlist(): Promise<WatchlistItem[]> {
  if (!supabase) {
    return [...inMemoryWatchlist.values()].sort((a, b) => a.symbol.localeCompare(b.symbol));
  }

  const userId = await ensureUserId();
  const { data, error } = await supabase
    .from("watchlist")
    .select("id,user_id,symbol,created_at")
    .eq("user_id", userId)
    .order("symbol", { ascending: true });

  if (error) throw error;

  return (
    data?.map((row) => ({
      id: String(row.id),
      user_id: row.user_id,
      symbol: normalizedSymbol(row.symbol),
      created_at: row.created_at
    })) ?? []
  );
}

export async function addWatchlistSymbol(symbol: string): Promise<WatchlistItem> {
  const normalized = normalizedSymbol(symbol);

  if (!supabase) {
    const item = inMemoryWatchlist.get(normalized) ?? {
      id: randomUUID(),
      symbol: normalized,
      user_id: fallbackUserId,
      created_at: new Date().toISOString()
    };
    inMemoryWatchlist.set(normalized, item);
    return item;
  }

  const userId = await ensureUserId();

  const existing = await supabase
    .from("watchlist")
    .select("id,user_id,symbol,created_at")
    .eq("user_id", userId)
    .eq("symbol", normalized)
    .maybeSingle();

  if (existing.error) throw existing.error;

  if (existing.data) {
    return {
      id: String(existing.data.id),
      user_id: existing.data.user_id,
      symbol: normalizedSymbol(existing.data.symbol),
      created_at: existing.data.created_at
    };
  }

  const inserted = await supabase
    .from("watchlist")
    .insert({ user_id: userId, symbol: normalized })
    .select("id,user_id,symbol,created_at")
    .single();

  if (inserted.error) throw inserted.error;
  if (!inserted.data) throw new Error("Watchlist insert returned no data");

  return {
    id: String(inserted.data.id),
    user_id: inserted.data.user_id,
    symbol: normalizedSymbol(inserted.data.symbol),
    created_at: inserted.data.created_at
  };
}

export async function removeWatchlistSymbol(symbol: string): Promise<void> {
  const normalized = normalizedSymbol(symbol);

  inMemoryWatchlist.delete(normalized);

  if (!supabase) return;

  const userId = await ensureUserId();
  const { error } = await supabase.from("watchlist").delete().eq("user_id", userId).eq("symbol", normalized);
  if (error) throw error;
}
