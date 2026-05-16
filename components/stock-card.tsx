import Link from "next/link";
import { ArrowUpRight, CandlestickChart } from "lucide-react";
import type { StockAnalysis } from "@/types/stock";
import { formatCompactINR, formatINR, formatPercent } from "@/utils/format";
import { RecommendationBadge } from "./recommendation-badge";
import { Card } from "@/components/ui/card";

export function StockCard({ stock }: { stock: StockAnalysis }) {
  const positive = stock.quote.changePercent >= 0;

  return (
    <Card className="flex h-full flex-col justify-between p-4">
      <div>
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">{stock.quote.shortName}</p>
            <h3 className="text-lg font-semibold text-foreground">{stock.quote.symbol}</h3>
          </div>
          <RecommendationBadge recommendation={stock.swing.recommendation} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Price</p>
            <p className="font-medium">{formatINR(stock.quote.price)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Day Move</p>
            <p className={positive ? "font-medium text-success" : "font-medium text-danger"}>
              {formatPercent(stock.quote.changePercent)}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Swing Score</p>
            <p className="font-medium">{stock.swing.swingTradeScore.toFixed(1)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Market Cap</p>
            <p className="font-medium">{formatCompactINR(stock.quote.marketCap)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CandlestickChart className="h-3.5 w-3.5" />
          {stock.technicals.trend}
        </div>

        <Link
          href={`/stocks/${stock.quote.symbol}`}
          className="inline-flex items-center gap-1 rounded-lg bg-primary/20 px-2.5 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/30"
        >
          Analyze
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </Card>
  );
}
