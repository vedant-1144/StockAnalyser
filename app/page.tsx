import { SectionHeader } from "@/components/section-header";
import { MarketStatCard } from "@/components/market-stat-card";
import { FadeIn } from "@/components/fade-in";
import { DashboardTabs } from "@/components/dashboard-tabs";
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

        <FadeIn delay={0.15}>
          <section>
            <SectionHeader title="Actionable Setups" subtitle="Switch between clean buy-side views" />
            <DashboardTabs
              swingCandidates={scan.swingCandidates}
              momentumStocks={scan.momentumStocks}
              volumeBreakouts={scan.volumeBreakouts}
              topGainers={scan.topGainers}
            />
          </section>
        </FadeIn>

        <FadeIn delay={0.2}>
          <section>
            <SectionHeader title="Nifty 50 by Weightage" subtitle="Directly add symbols to watchlist" />
            <Nifty50WeightageTable />
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
          <SectionHeader title="Nifty 50 by Weightage" subtitle="Directly add symbols to watchlist" />
          <Nifty50WeightageTable />
        </section>
      </div>
    );
  }
}
