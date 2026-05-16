import Link from "next/link";
import { OpenTradingViewButton } from "@/components/open-tradingview-button";
import { PriceHistoryChart } from "@/components/price-history-chart";
import { RecommendationBadge } from "@/components/recommendation-badge";
import { SectionHeader } from "@/components/section-header";
import { TradingViewEmbed } from "@/components/trading-view-embed";
import { analyzeStock } from "@/services/analysis";
import { formatCompactINR, formatINR, formatNumber, formatPercent } from "@/utils/format";
import { normalizeInputSymbol } from "@/utils/symbols";

const rowClass = "grid grid-cols-2 border-b border-border/50 py-2 text-sm";

interface StockDetailsPageProps {
  params: Promise<{ symbol: string }>;
}

export const revalidate = 300;

export default async function StockDetailsPage({ params }: StockDetailsPageProps) {
  const { symbol } = await params;
  const normalizedSymbol = normalizeInputSymbol(symbol);

  try {
    const stock = await analyzeStock(normalizedSymbol);

    return (
      <div className="space-y-8">
        <section className="glass-card p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{stock.quote.shortName}</p>
              <h2 className="text-3xl font-bold text-foreground">{stock.quote.symbol}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Price: <span className="text-foreground">{formatINR(stock.quote.price)}</span> • Move: {" "}
                <span className={stock.quote.changePercent >= 0 ? "text-success" : "text-danger"}>
                  {formatPercent(stock.quote.changePercent)}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <RecommendationBadge recommendation={stock.swing.recommendation} />
              <OpenTradingViewButton symbol={stock.quote.symbol} />
              <Link
                href="/watchlist"
                className="rounded-lg border border-border/80 bg-muted/60 px-3 py-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                Go to Watchlist
              </Link>
            </div>
          </div>
        </section>

        <section>
          <SectionHeader title="AI Swing Summary" subtitle="Rule-based scorecard" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="glass-card p-4">
              <p className="text-xs uppercase text-muted-foreground">Swing Score</p>
              <p className="mt-2 text-2xl font-semibold">{stock.swing.swingTradeScore.toFixed(1)}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs uppercase text-muted-foreground">Technical Score</p>
              <p className="mt-2 text-2xl font-semibold">{stock.swing.technicalScore.toFixed(1)}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs uppercase text-muted-foreground">Fundamental Score</p>
              <p className="mt-2 text-2xl font-semibold">{stock.swing.fundamentalScore.toFixed(1)}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs uppercase text-muted-foreground">Earnings Score</p>
              <p className="mt-2 text-2xl font-semibold">{stock.swing.earningsScore.toFixed(1)}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="glass-card p-4">
              <p className="text-xs uppercase text-muted-foreground">Entry</p>
              <p className="mt-1 text-lg font-medium">{formatINR(stock.swing.entryPrice)}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs uppercase text-muted-foreground">Stop Loss</p>
              <p className="mt-1 text-lg font-medium text-danger">{formatINR(stock.swing.stopLoss)}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs uppercase text-muted-foreground">Targets</p>
              <p className="mt-1 text-sm font-medium text-success">
                T1: {formatINR(stock.swing.target1)} • T2: {formatINR(stock.swing.target2)}
              </p>
            </div>
          </div>

          <div className="glass-card mt-4 p-4">
            <h3 className="text-sm font-medium text-foreground">Setup Reasons</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {stock.swing.reasons.map((reason) => (
                <li key={reason}>- {reason}</li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <SectionHeader title="Technical Chart" subtitle="TradingView widget" />
          <TradingViewEmbed symbol={stock.quote.symbol} />
        </section>

        <section>
          <SectionHeader title="Price Structure" subtitle="Close price and moving averages" />
          <PriceHistoryChart data={stock.history} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="glass-card p-4">
            <h3 className="mb-2 text-base font-semibold">Fundamentals</h3>
            <div className={rowClass}><span className="text-muted-foreground">PE Ratio</span><span>{formatNumber(stock.fundamentals.peRatio)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">PB Ratio</span><span>{formatNumber(stock.fundamentals.pbRatio)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">ROE</span><span>{formatPercent(stock.fundamentals.roe)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">ROCE</span><span>{formatPercent(stock.fundamentals.roce)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">EPS</span><span>{formatNumber(stock.fundamentals.eps)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">Debt/Equity</span><span>{formatNumber(stock.fundamentals.debtToEquity)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">Revenue Growth</span><span>{formatPercent(stock.fundamentals.revenueGrowth)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">Profit Growth</span><span>{formatPercent(stock.fundamentals.profitGrowth)}</span></div>
            <div className="grid grid-cols-2 py-2 text-sm"><span className="text-muted-foreground">Market Cap</span><span>{formatCompactINR(stock.fundamentals.marketCap)}</span></div>
          </div>

          <div className="glass-card p-4">
            <h3 className="mb-2 text-base font-semibold">Quarterly + Technical</h3>
            <div className={rowClass}><span className="text-muted-foreground">QoQ Revenue</span><span>{formatPercent(stock.quarterly.qoqRevenueGrowth)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">YoY Revenue</span><span>{formatPercent(stock.quarterly.yoyRevenueGrowth)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">Profit Growth</span><span>{formatPercent(stock.quarterly.profitGrowth)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">EPS Growth</span><span>{formatPercent(stock.quarterly.epsGrowth)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">RSI</span><span>{formatNumber(stock.technicals.rsi)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">MACD</span><span>{formatNumber(stock.technicals.macd)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">EMA20</span><span>{formatINR(stock.technicals.ema20)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">EMA50</span><span>{formatINR(stock.technicals.ema50)}</span></div>
            <div className={rowClass}><span className="text-muted-foreground">SMA200</span><span>{formatINR(stock.technicals.sma200)}</span></div>
            <div className="grid grid-cols-2 py-2 text-sm"><span className="text-muted-foreground">Trend / Setup</span><span>{stock.technicals.trend} / {stock.technicals.setup}</span></div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error(`Failed to analyze stock ${normalizedSymbol}`, error);

    return (
      <div className="space-y-6">
        <section className="glass-card p-6">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">{normalizedSymbol}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">Analysis unavailable</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            The stock symbol was found in your app, but the live Yahoo Finance analysis request failed. This can happen when Yahoo is slow, rate-limited, or the symbol mapping is temporarily unavailable.
          </p>
          <p className="mt-3 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            {error instanceof Error ? error.message : "Unknown stock analysis error"}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-lg border border-border/80 bg-muted/60 px-3 py-2 text-sm text-foreground transition hover:bg-muted"
            >
              Back to Dashboard
            </Link>
            <OpenTradingViewButton symbol={normalizedSymbol} />
          </div>
        </section>
      </div>
    );
  }
}
