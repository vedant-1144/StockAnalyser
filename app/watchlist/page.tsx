"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { WatchlistItem } from "@/types/stock";
import { OpenTradingViewButton } from "@/components/open-tradingview-button";

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/watchlist", { cache: "no-store" });
      if (!response.ok) {
        const body = (await response.json()) as { message?: string; error?: string };
        throw new Error(body.message || body.error || "Failed to load watchlist");
      }

      const json = (await response.json()) as { items: WatchlistItem[] };
      setItems(json.items ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const remove = async (target: string) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/watchlist?symbol=${encodeURIComponent(target)}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Failed to remove symbol");
      }

      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h2 className="heading-gradient text-3xl font-bold tracking-tight sm:text-4xl">Watchlist</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Added symbols are listed below for quick analysis or removal.
        </p>
      </section>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <section className="space-y-3">
        {loading ? <p className="text-sm text-muted-foreground">Loading watchlist...</p> : null}

        {!loading && items.length === 0 ? (
          <p className="glass-card p-4 text-sm text-muted-foreground">No symbols yet. Add one to start tracking.</p>
        ) : null}

        {items.map((item) => (
          <article key={item.id} className="glass-card flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Saved Symbol</p>
              <h3 className="text-lg font-semibold">{item.symbol}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={{
                  pathname: "/stocks/[symbol]",
                  query: { symbol: item.symbol }
                }}
                className="rounded-lg border border-border/80 bg-muted/60 px-3 py-2 text-sm text-foreground transition hover:bg-muted"
              >
                Analyze
              </Link>
              <OpenTradingViewButton symbol={item.symbol} className="rounded-lg bg-primary/20 px-3 py-2 text-sm text-primary" />
              <button
                type="button"
                onClick={() => remove(item.symbol)}
                className="inline-flex items-center gap-2 rounded-lg bg-danger/20 px-3 py-2 text-sm text-danger transition hover:bg-danger/30"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
