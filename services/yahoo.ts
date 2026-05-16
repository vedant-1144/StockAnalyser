import type { FundamentalMetrics, MarketOverview, QuarterlyMetrics, QuoteSnapshot } from "@/types/stock";
import { percentDelta, safeNumber } from "@/utils/math";
import { toNseTicker } from "@/utils/symbols";

interface SummaryNumeric {
  raw?: number;
  fmt?: string;
}

interface YahooSession {
  cookie: string;
  crumb: string;
  expiresAt: number;
}

interface YahooChartResult {
  meta?: {
    symbol?: string;
    shortName?: string;
    longName?: string;
    regularMarketPrice?: number;
    chartPreviousClose?: number;
    previousClose?: number;
    regularMarketDayHigh?: number;
    regularMarketDayLow?: number;
  };
  timestamp?: number[];
  indicators?: {
    quote?: Array<{
      close?: Array<number | null>;
      low?: Array<number | null>;
      high?: Array<number | null>;
      volume?: Array<number | null>;
    }>;
  };
}

const yahooUserAgent =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

let yahooSessionCache: YahooSession | null = null;

function withCrumb(url: string, crumb: string): string {
  const urlObj = new URL(url);
  if (!urlObj.searchParams.has("crumb")) {
    urlObj.searchParams.set("crumb", crumb);
  }
  return urlObj.toString();
}

async function getYahooSession(forceRefresh = false): Promise<YahooSession> {
  if (!forceRefresh && yahooSessionCache && yahooSessionCache.expiresAt > Date.now()) {
    return yahooSessionCache;
  }

  const cookieResponse = await fetch("https://fc.yahoo.com", {
    headers: {
      accept: "*/*",
      "user-agent": yahooUserAgent
    },
    cache: "no-store",
    redirect: "manual"
  });

  const setCookie = cookieResponse.headers.get("set-cookie");
  const cookie = setCookie?.split(";")[0]?.trim();

  if (!cookie) {
    throw new Error("Unable to initialize Yahoo cookie session");
  }

  const crumbResponse = await fetch("https://query2.finance.yahoo.com/v1/test/getcrumb", {
    headers: {
      accept: "text/plain",
      cookie,
      "user-agent": yahooUserAgent
    },
    cache: "no-store"
  });

  if (!crumbResponse.ok) {
    throw new Error(`Unable to fetch Yahoo crumb (${crumbResponse.status})`);
  }

  const crumb = (await crumbResponse.text()).trim();
  if (!crumb) {
    throw new Error("Yahoo crumb was empty");
  }

  yahooSessionCache = {
    cookie,
    crumb,
    expiresAt: Date.now() + 30 * 60 * 1000
  };

  return yahooSessionCache;
}

async function fetchYahooJson<T>(url: string, requiresAuth = false): Promise<T> {
  const maxAttempts = requiresAuth ? 2 : 1;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    let requestUrl = url;
    const headers: Record<string, string> = {
      accept: "application/json",
      "user-agent": yahooUserAgent
    };

    if (requiresAuth) {
      const session = await getYahooSession(attempt > 0);
      requestUrl = withCrumb(url, session.crumb);
      headers.cookie = session.cookie;
    }

    const response = await fetch(requestUrl, {
      headers,
      next: { revalidate: 300 }
    });

    if (response.ok) {
      return (await response.json()) as T;
    }

    const responseBody = await response.text();
    const canRetryWithFreshSession =
      requiresAuth &&
      attempt === 0 &&
      (response.status === 401 ||
        responseBody.toLowerCase().includes("invalid crumb") ||
        responseBody.toLowerCase().includes("invalid cookie"));

    if (canRetryWithFreshSession) {
      continue;
    }

    throw new Error(`Yahoo request failed (${response.status}) for ${requestUrl}`);
  }

  throw new Error(`Yahoo request failed for ${url}`);
}

async function fetchYahooChart(ticker: string, range: string): Promise<YahooChartResult> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=${range}&interval=1d`;
  const response = await fetchYahooJson<any>(url);
  const error = response.chart?.error;

  if (error) {
    throw new Error(error.description ?? `Yahoo chart request failed for ${ticker}`);
  }

  const result = response.chart?.result?.[0];
  if (!result) {
    throw new Error(`No Yahoo chart data found for ${ticker}`);
  }

  return result;
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
  const result = await fetchYahooChart(ticker, "5d");
  const meta = result.meta ?? {};
  const quote = result.indicators?.quote?.[0] ?? {};
  const closes = quote.close ?? [];
  const highs = quote.high ?? [];
  const lows = quote.low ?? [];
  const volumes = quote.volume ?? [];

  const latestClose = [...closes].reverse().find((value) => typeof value === "number") ?? 0;
  const previousClose =
    safeNumber(meta.previousClose) ||
    safeNumber(meta.chartPreviousClose) ||
    safeNumber(closes.at(-2));
  const price = safeNumber(meta.regularMarketPrice) || safeNumber(latestClose);
  const change = price - previousClose;
  const changePercent = previousClose ? (change / previousClose) * 100 : 0;

  return {
    symbol: symbol.toUpperCase(),
    exchangeSymbol: ticker,
    shortName: meta.shortName ?? meta.longName ?? symbol.toUpperCase(),
    price,
    change,
    changePercent,
    volume: safeNumber(volumes.at(-1)),
    marketCap: 0,
    previousClose,
    dayHigh: safeNumber(meta.regularMarketDayHigh) || safeNumber(highs.at(-1)),
    dayLow: safeNumber(meta.regularMarketDayLow) || safeNumber(lows.at(-1))
  };
}

export async function fetchFundamentalsAndQuarterly(
  symbol: string,
  marketCap: number
): Promise<{ fundamentals: FundamentalMetrics; quarterly: QuarterlyMetrics }> {
  const ticker = toNseTicker(symbol);

  let summary: any = {};

  try {
    const modules = [
      "defaultKeyStatistics",
      "financialData",
      "incomeStatementHistoryQuarterly",
      "earnings",
      "summaryDetail"
    ].join(",");
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(ticker)}?modules=${modules}`;
    const response = await fetchYahooJson<any>(url, true);
    summary = response.quoteSummary?.result?.[0] ?? {};
  } catch (error) {
    console.error(`Failed to fetch quoteSummary for ${ticker}`, error);
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
    marketCap:
      numericFromUnknown(summaryDetail.marketCap) ||
      numericFromUnknown(financialData.marketCap) ||
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

  try {
    const result = await fetchYahooChart(ticker, "1y");
    const timestamps: number[] = result?.timestamp ?? [];
    const quote = result?.indicators?.quote?.[0] ?? {};

    return timestamps.map((timestamp, index) => ({
      date: new Date(timestamp * 1000),
      close: quote.close?.[index] ?? null,
      low: quote.low?.[index] ?? null,
      high: quote.high?.[index] ?? null,
      volume: quote.volume?.[index] ?? null
    }));
  } catch {
    return [];
  }
}

export async function fetchNiftyOverview(): Promise<MarketOverview> {
  try {
    const result = await fetchYahooChart("^NSEI", "5d");
    const meta = result.meta ?? {};
    const quote = result.indicators?.quote?.[0] ?? {};
    const closes = quote.close ?? [];
    const latestClose = [...closes].reverse().find((value) => typeof value === "number") ?? 0;
    const previousClose =
      safeNumber(meta.previousClose) ||
      safeNumber(meta.chartPreviousClose) ||
      safeNumber(closes.at(-2));
    const niftyPrice = safeNumber(meta.regularMarketPrice) || safeNumber(latestClose);
    const niftyChangePercent = previousClose ? ((niftyPrice - previousClose) / previousClose) * 100 : 0;

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
