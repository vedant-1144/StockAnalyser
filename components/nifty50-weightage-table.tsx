import Link from "next/link";
import { AddToWatchlistButton } from "@/components/add-to-watchlist-button";
import { NIFTY50_STOCKS } from "@/data/nifty50";

export function Nifty50WeightageTable() {
  return (
    <div className="overflow-hidden rounded-lg border border-border/70 bg-card/65">
      <div className="max-h-[640px] overflow-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-border bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th className="w-16 px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="w-32 px-4 py-3 text-right font-medium">Weight</th>
              <th className="w-32 px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {NIFTY50_STOCKS.map((stock) => (
              <tr key={stock.symbol} className="border-b border-border/45 transition hover:bg-muted/50">
                <td className="px-4 py-3 text-muted-foreground">{stock.rank}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/stocks/${encodeURIComponent(stock.symbol)}`}
                    className="font-semibold text-primary transition hover:text-foreground"
                  >
                    {stock.symbol}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{stock.company}</td>
                <td className="px-4 py-3 text-right font-medium">{stock.weight.toFixed(2)}%</td>
                <td className="px-4 py-3 text-right">
                  <AddToWatchlistButton symbol={stock.symbol} compact />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
