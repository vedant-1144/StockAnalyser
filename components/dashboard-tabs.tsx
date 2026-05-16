"use client";

import { Activity, BarChart3, Rocket, TrendingUp } from "lucide-react";
import type { ComponentType } from "react";
import { useMemo, useState } from "react";
import type { StockAnalysis } from "@/types/stock";
import { StockCard } from "@/components/stock-card";

interface DashboardTabsProps {
  swingCandidates: StockAnalysis[];
  momentumStocks: StockAnalysis[];
  volumeBreakouts: StockAnalysis[];
  topGainers: StockAnalysis[];
}

type TabKey = "swing" | "momentum" | "breakouts" | "gainers";

const tabs: Array<{ key: TabKey; label: string; icon: ComponentType<{ className?: string }> }> = [
  { key: "swing", label: "Swing Buys", icon: Rocket },
  { key: "momentum", label: "Momentum", icon: TrendingUp },
  { key: "breakouts", label: "Breakouts", icon: Activity },
  { key: "gainers", label: "Top Gainers", icon: BarChart3 }
];

export function DashboardTabs({
  swingCandidates,
  momentumStocks,
  volumeBreakouts,
  topGainers
}: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("swing");

  const tabData = useMemo(
    () => ({
      swing: swingCandidates,
      momentum: momentumStocks,
      breakouts: volumeBreakouts,
      gainers: topGainers.filter((stock) => stock.swing.recommendation !== "Avoid")
    }),
    [swingCandidates, momentumStocks, volumeBreakouts, topGainers]
  );

  const activeList = tabData[activeTab];

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2 border-b border-border/70 pb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={[
                "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                isActive
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border/80 bg-card/60 text-muted-foreground hover:text-foreground"
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeList.length === 0 ? (
        <div className="glass-card p-5 text-sm text-muted-foreground">
          No bullish buy-side setups match this tab right now.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeList.map((stock) => (
            <StockCard key={`${activeTab}-${stock.quote.symbol}`} stock={stock} />
          ))}
        </div>
      )}
    </section>
  );
}
