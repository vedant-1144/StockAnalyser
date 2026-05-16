"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import type { WatchlistItem } from "@/types/stock";
import { OpenTradingViewButton } from "@/components/open-tradingview-button";

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [symbol, setSymbol] = useState("");
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

  const canSubmit = useMemo(() => symbol.trim().length > 0 && !saving, [symbol, saving]);

  const add = async () => {
    if (!canSubmit) return;
    setSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol })
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        throw new Error(body.error || "Failed to add symbol");
      }

      setSymbol("");
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

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
          Save swing-trade symbols and jump directly into detail analysis or TradingView charts.
        </p>
      </section>

      <section className="glass-card p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="symbol" className="mb-1 block text-sm text-muted-foreground">
              NSE Symbol
            </label>
            <input
              id="symbol"
              value={symbol}
              onChange={(event) => setSymbol(event.target.value.toUpperCase())}
              placeholder="RELIANCE"
              className="w-full rounded-xl border border-border bg-muted/60 px-3 py-2 text-sm outline-none ring-primary transition focus:ring-2"
            />
          </div>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={add}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary/20 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/30 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            Add to Watchlist
          </button>
        </div>
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
                href={`/stocks/${encodeURIComponent(item.symbol)}`}
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
