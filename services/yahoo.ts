import yahooFinance from "yahoo-finance2";
import type { FundamentalMetrics, MarketOverview, QuarterlyMetrics, QuoteSnapshot } from "@/types/stock";
import { percentDelta, safeNumber } from "@/utils/math";
import { toNseTicker } from "@/utils/symbols";

interface SummaryNumeric {
  raw?: number;
  fmt?: string;
}

function numericFromUnknown(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object" && "raw" in value) {
    const raw = (value as SummaryNumeric).raw;
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
  }
  return fallback;
}

function normalizePercent(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (Math.abs(value) <= 1) return value * 100;
  return value;
}

export async function fetchQuoteSnapshot(symbol: string): Promise<QuoteSnapshot> {
  const ticker = toNseTicker(symbol);
  const quote = await yahooFinance.quote(ticker);

  return {
    symbol: symbol.toUpperCase(),
    exchangeSymbol: ticker,
    shortName: quote.shortName ?? quote.longName ?? symbol.toUpperCase(),
    price: safeNumber(quote.regularMarketPrice),
    change: safeNumber(quote.regularMarketChange),
    changePercent: safeNumber(quote.regularMarketChangePercent),
    volume: safeNumber(quote.regularMarketVolume),
    marketCap: safeNumber(quote.marketCap),
    previousClose: safeNumber(quote.regularMarketPreviousClose),
    dayHigh: safeNumber(quote.regularMarketDayHigh),
    dayLow: safeNumber(quote.regularMarketDayLow)
  };
}

export async function fetchFundamentalsAndQuarterly(
  symbol: string,
  marketCap: number
): Promise<{ fundamentals: FundamentalMetrics; quarterly: QuarterlyMetrics }> {
  const ticker = toNseTicker(symbol);

  let summary: any = {};

  try {
    summary = (await yahooFinance.quoteSummary(ticker, {
      modules: [
        "defaultKeyStatistics",
        "financialData",
        "incomeStatementHistoryQuarterly",
        "earnings",
        "summaryDetail"
      ]
    })) as any;
  } catch {
    summary = {};
  }

  const financialData = summary.financialData ?? {};
  const stats = summary.defaultKeyStatistics ?? {};
  const summaryDetail = summary.summaryDetail ?? {};

  const revenueGrowth = normalizePercent(numericFromUnknown(financialData.revenueGrowth));
  const profitGrowth = normalizePercent(numericFromUnknown(financialData.earningsGrowth));

  const roe = normalizePercent(numericFromUnknown(financialData.returnOnEquity));
  const roce = normalizePercent(numericFromUnknown(financialData.returnOnAssets));

  const quarterlyIncome =
    summary.incomeStatementHistoryQuarterly?.incomeStatementHistory?.map((row: any) => ({
      revenue: numericFromUnknown(row.totalRevenue),
      netIncome: numericFromUnknown(row.netIncome)
    })) ?? [];

  const latestRevenue = safeNumber(quarterlyIncome[0]?.revenue);
  const previousRevenue = safeNumber(quarterlyIncome[1]?.revenue);
  const yearAgoRevenue = safeNumber(quarterlyIncome[4]?.revenue || quarterlyIncome[3]?.revenue);

  const latestProfit = safeNumber(quarterlyIncome[0]?.netIncome);
  const previousProfit = safeNumber(quarterlyIncome[1]?.netIncome);

  const earningsChart = summary.earnings?.financialsChart?.quarterly ?? [];
  const latestEps = numericFromUnknown(stats.trailingEps);
  const prevEps = numericFromUnknown(earningsChart[1]?.earnings);

  const qoqRevenueGrowth = percentDelta(latestRevenue, previousRevenue);
  const yoyRevenueGrowth = percentDelta(latestRevenue, yearAgoRevenue);

  const fundamentals: FundamentalMetrics = {
    peRatio: numericFromUnknown(summaryDetail.trailingPE),
    pbRatio: numericFromUnknown(stats.priceToBook),
    roe,
    roce,
    eps: latestEps,
    debtToEquity: numericFromUnknown(financialData.debtToEquity),
    revenueGrowth,
    profitGrowth,
    marketCap
  };

  const quarterly: QuarterlyMetrics = {
    qoqRevenueGrowth,
    yoyRevenueGrowth,
    profitGrowth: percentDelta(latestProfit, previousProfit) || profitGrowth,
    epsGrowth: percentDelta(latestEps, prevEps)
  };

  return { fundamentals, quarterly };
}

export async function fetchHistoricalSeries(symbol: string): Promise<any[]> {
  const ticker = toNseTicker(symbol);

  const end = new Date();
  const start = new Date();
  start.setFullYear(end.getFullYear() - 1);

  try {
    const history = await yahooFinance.historical(ticker, {
      period1: start,
      period2: end,
      interval: "1d"
    });
    return history;
  } catch {
    return [];
  }
}

export async function fetchNiftyOverview(): Promise<MarketOverview> {
  try {
    const nifty = await yahooFinance.quote("^NSEI");
    const niftyPrice = safeNumber(nifty.regularMarketPrice);
    const niftyChangePercent = safeNumber(nifty.regularMarketChangePercent);

    let trend: MarketOverview["trend"] = "Neutral";
    if (niftyChangePercent > 0.6) trend = "Bullish";
    if (niftyChangePercent < -0.6) trend = "Bearish";

    return {
      niftyPrice,
      niftyChangePercent,
      trend
    };
  } catch {
    return {
      niftyPrice: 0,
      niftyChangePercent: 0,
      trend: "Neutral"
    };
  }
}
