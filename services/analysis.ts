import { appCache } from "@/lib/cache";
import type { MarketScan, StockAnalysis } from "@/types/stock";
import { DEFAULT_SCAN_SYMBOLS, normalizeInputSymbol } from "@/utils/symbols";
import { buildSwingSetup, calculateEarningsScore, calculateFundamentalScore, calculateTechnicalScore } from "./scoring";
import { upsertStockScore } from "./stock-scores";
import { calculateTechnicals } from "./technical";
import { fetchFundamentalsAndQuarterly, fetchHistoricalSeries, fetchNiftyOverview, fetchQuoteSnapshot } from "./yahoo";

const STOCK_CACHE_TTL = 10 * 60 * 1000;
const SCAN_CACHE_TTL = 5 * 60 * 1000;

function normalizeSymbol(symbol: string): string {
  return normalizeInputSymbol(symbol);
}

export async function analyzeStock(symbol: string): Promise<StockAnalysis> {
  const normalized = normalizeSymbol(symbol);
  const cacheKey = `stock:${normalized}`;
  const cached = appCache.get<StockAnalysis>(cacheKey);
  if (cached) return cached;

  const quote = await fetchQuoteSnapshot(normalized);

  const [summary, historyRaw] = await Promise.all([
    fetchFundamentalsAndQuarterly(normalized, quote.marketCap),
    fetchHistoricalSeries(normalized)
  ]);

  const { technicals, history } = calculateTechnicals(historyRaw, quote.price, quote.volume);

  const fundamentalScore = calculateFundamentalScore(summary.fundamentals);
  const earningsScore = calculateEarningsScore(summary.quarterly);
  const technicalResult = calculateTechnicalScore(technicals, quote, summary.quarterly);

  const swing = buildSwingSetup({
    quote,
    technicals,
    fundamentalScore,
    earningsScore,
    technicalScore: technicalResult.score,
    reasons: technicalResult.reasons
  });

  const result: StockAnalysis = {
    quote,
    fundamentals: summary.fundamentals,
    quarterly: summary.quarterly,
    technicals,
    swing,
    history
  };

  await upsertStockScore({
    symbol: quote.symbol,
    technicalScore: swing.technicalScore,
    fundamentalScore: swing.fundamentalScore,
    swingScore: swing.swingTradeScore
  });

  appCache.set(cacheKey, result, STOCK_CACHE_TTL);
  return result;
}

export async function scanMarket(symbols = [...DEFAULT_SCAN_SYMBOLS]): Promise<MarketScan> {
  const normalizedSymbols = symbols.map((symbol) => normalizeSymbol(symbol));
  const cacheKey = `scan:${normalizedSymbols.join(",")}`;
  const cached = appCache.get<MarketScan>(cacheKey);
  if (cached) return cached;

  const [niftyOverview, analysisList] = await Promise.all([
    fetchNiftyOverview(),
    Promise.allSettled(normalizedSymbols.map((symbol) => analyzeStock(symbol)))
  ]);

  const all = analysisList
    .filter((item): item is PromiseFulfilledResult<StockAnalysis> => item.status === "fulfilled")
    .map((item) => item.value);

  const topGainers = [...all].sort((a, b) => b.quote.changePercent - a.quote.changePercent).slice(0, 5);
  const topLosers = [...all].sort((a, b) => a.quote.changePercent - b.quote.changePercent).slice(0, 5);

  const swingCandidates = [...all]
    .filter((stock) => stock.swing.recommendation !== "Avoid")
    .sort((a, b) => b.swing.swingTradeScore - a.swing.swingTradeScore)
    .slice(0, 8);

  const volumeBreakouts = [...all]
    .filter((stock) => stock.technicals.volumeBreakout)
    .sort((a, b) => b.quote.changePercent - a.quote.changePercent)
    .slice(0, 8);

  const momentumStocks = [...all]
    .filter((stock) => stock.technicals.trend === "uptrend" && stock.technicals.rsi >= 52)
    .sort((a, b) => b.swing.technicalScore - a.swing.technicalScore)
    .slice(0, 8);

  const marketScan: MarketScan = {
    timestamp: new Date().toISOString(),
    marketOverview: niftyOverview,
    all,
    topGainers,
    topLosers,
    swingCandidates,
    volumeBreakouts,
    momentumStocks
  };

  appCache.set(cacheKey, marketScan, SCAN_CACHE_TTL);
  return marketScan;
}
