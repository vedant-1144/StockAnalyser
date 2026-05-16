import { SectionHeader } from "@/components/section-header";
import { MarketStatCard } from "@/components/market-stat-card";
import { StockCard } from "@/components/stock-card";
import { FadeIn } from "@/components/fade-in";
import { Nifty50WeightageTable } from "@/components/nifty50-weightage-table";
import { NIFTY50_STOCKS } from "@/data/nifty50";
import { scanMarket } from "@/services/analysis";
import { formatINR, formatPercent } from "@/utils/format";

export const revalidate = 300;

export default async function HomePage() {
  try {
    const scan = await scanMarket();
    const marketPositive = scan.marketOverview.niftyChangePercent >= 0;

    return (
      <div className="space-y-8">
        <FadeIn>
          <section>
            <h2 className="heading-gradient text-3xl font-bold tracking-tight sm:text-4xl">
              Indian Stocks Swing Dashboard
            </h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground sm:text-base">
              Daily rule-based scan for fundamentals, technical momentum, volume breakouts, and swing setup quality across major NSE symbols.
            </p>
          </section>
        </FadeIn>

        <FadeIn delay={0.05}>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MarketStatCard
              title="Nifty 50"
              value={formatINR(scan.marketOverview.niftyPrice)}
              hint={`${scan.marketOverview.trend} • ${formatPercent(scan.marketOverview.niftyChangePercent)}`}
              positive={marketPositive}
            />
            <MarketStatCard title="Scanned Stocks" value={String(scan.all.length)} hint="Universe scanned daily" />
            <MarketStatCard title="Nifty 50 List" value={String(NIFTY50_STOCKS.length)} hint="Sorted by index weight" />
            <MarketStatCard title="Swing Candidates" value={String(scan.swingCandidates.length)} hint="Strong Buy + Watchlist" />
          </section>
        </FadeIn>

        <FadeIn delay={0.1}>
          <section>
            <SectionHeader title="Nifty 50 by Weightage" subtitle="Ranked constituents with direct watchlist add" />
            <Nifty50WeightageTable />
          </section>
        </FadeIn>

        <FadeIn delay={0.15}>
          <section>
            <SectionHeader title="Swing Trade Candidates" subtitle="Top setups by swing score" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {scan.swingCandidates.map((stock) => (
                <StockCard key={stock.quote.symbol} stock={stock} />
              ))}
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.2}>
          <section className="grid gap-6 lg:grid-cols-2">
            <div>
              <SectionHeader title="Top Gainers" subtitle="Highest daily momentum" />
              <div className="grid gap-4">
                {scan.topGainers.map((stock) => (
                  <StockCard key={`gainer-${stock.quote.symbol}`} stock={stock} />
                ))}
              </div>
            </div>
            <div>
              <SectionHeader title="Top Losers" subtitle="Mean-reversion watch" />
              <div className="grid gap-4">
                {scan.topLosers.map((stock) => (
                  <StockCard key={`loser-${stock.quote.symbol}`} stock={stock} />
                ))}
              </div>
            </div>
          </section>
        </FadeIn>

        <FadeIn delay={0.25}>
          <section>
            <SectionHeader title="Momentum Stocks" subtitle="Uptrend + strong technical score" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {scan.momentumStocks.map((stock) => (
                <StockCard key={`momentum-${stock.quote.symbol}`} stock={stock} />
              ))}
            </div>
          </section>
        </FadeIn>
      </div>
    );
  } catch (error) {
    return (
      <div className="space-y-8">
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold">Market data unavailable</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Unable to fetch live stock data right now. Check Yahoo Finance access and try again.
          </p>
          <p className="mt-2 text-xs text-danger">{(error as Error).message}</p>
        </div>

        <section>
          <SectionHeader title="Nifty 50 by Weightage" subtitle="Ranked constituents with direct watchlist add" />
          <Nifty50WeightageTable />
        </section>
      </div>
    );
  }
}
