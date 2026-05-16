import type {
  FundamentalMetrics,
  QuarterlyMetrics,
  QuoteSnapshot,
  Recommendation,
  SwingSetup,
  TechnicalMetrics
} from "@/types/stock";
import { clamp } from "@/utils/math";

export function calculateFundamentalScore(metrics: FundamentalMetrics): number {
  let score = 0;

  if (metrics.peRatio > 0 && metrics.peRatio < 30) score += 12;
  if (metrics.pbRatio > 0 && metrics.pbRatio < 5) score += 8;
  if (metrics.roe >= 15) score += 14;
  if (metrics.roce >= 15) score += 14;
  if (metrics.eps > 0) score += 10;
  if (metrics.debtToEquity >= 0 && metrics.debtToEquity < 1) score += 12;

  if (metrics.revenueGrowth > 20) score += 12;
  else if (metrics.revenueGrowth > 10) score += 8;

  if (metrics.profitGrowth > 20) score += 12;
  else if (metrics.profitGrowth > 10) score += 8;

  if (metrics.marketCap > 1_000_000_000_000) score += 6;

  return clamp(score);
}

export function calculateEarningsScore(quarterly: QuarterlyMetrics): number {
  let score = 0;

  if (quarterly.qoqRevenueGrowth > 5) score += 20;
  if (quarterly.yoyRevenueGrowth > 10) score += 30;
  if (quarterly.profitGrowth > 10) score += 30;
  if (quarterly.epsGrowth > 10) score += 20;

  return clamp(score);
}

export function calculateTechnicalScore(
  technicals: TechnicalMetrics,
  quote: QuoteSnapshot,
  quarterly: QuarterlyMetrics
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  if (technicals.rsi >= 50 && technicals.rsi <= 65) {
    score += 20;
    reasons.push("RSI is in bullish swing zone (50-65)");
  } else if (technicals.rsi > 65 && technicals.rsi <= 75) {
    score += 10;
    reasons.push("RSI is strong but near overbought zone");
  }

  if (technicals.ema20 > technicals.ema50) {
    score += 20;
    reasons.push("EMA20 is above EMA50");
  }

  if (quote.price > technicals.sma200) {
    score += 15;
    reasons.push("Price is above SMA200");
  }

  if (technicals.macd > technicals.macdSignal) {
    score += 15;
    reasons.push("MACD is above signal line");
  }

  if (technicals.volumeBreakout) {
    score += 15;
    reasons.push("Volume breakout detected");
  }

  if (technicals.trend === "uptrend") {
    score += 10;
    reasons.push("Stock is in uptrend");
  }

  if (quarterly.yoyRevenueGrowth > 15) {
    score += 5;
    reasons.push("Positive quarterly growth supports momentum");
  }

  if (
    technicals.rsi < 65 &&
    technicals.ema20 > technicals.ema50 &&
    quarterly.yoyRevenueGrowth > 15 &&
    technicals.volumeBreakout
  ) {
    score += 10;
    reasons.push("Matched high-conviction swing setup rule");
  }

  return { score: clamp(score), reasons };
}

export function buildSwingSetup(input: {
  quote: QuoteSnapshot;
  technicals: TechnicalMetrics;
  fundamentalScore: number;
  earningsScore: number;
  technicalScore: number;
  reasons: string[];
}): SwingSetup {
  const { quote, technicals, fundamentalScore, earningsScore, technicalScore, reasons } = input;

  const hasContextualFundamentals = fundamentalScore > 0 || earningsScore > 0;
  const bullishTrendFilter =
    technicals.trend === "uptrend" &&
    technicals.ema20 > technicals.ema50 &&
    quote.price > technicals.ema20;

  const swingTradeScore = clamp(
    hasContextualFundamentals
      ? technicalScore * 0.65 + fundamentalScore * 0.2 + earningsScore * 0.15
      : technicalScore
  );

  let recommendation: Recommendation = "Avoid";
  if (bullishTrendFilter && swingTradeScore >= 70) recommendation = "Strong Swing Buy";
  else if (bullishTrendFilter && swingTradeScore >= 55) recommendation = "Watchlist";

  const entryPrice = quote.price;
  const stopLoss = Math.max(technicals.support * 0.99, entryPrice * 0.94);
  const risk = entryPrice - stopLoss;
  const target1 = entryPrice + risk * 1.5;
  const target2 = entryPrice + risk * 2.5;

  if (bullishTrendFilter) reasons.unshift("Bullish trend filter passed");
  else reasons.unshift("Rejected by bullish trend filter");
  if (!hasContextualFundamentals) reasons.push("Technical-only mode: fundamentals unavailable");

  return {
    swingTradeScore,
    technicalScore,
    fundamentalScore,
    earningsScore,
    recommendation,
    entryPrice,
    stopLoss,
    target1,
    target2,
    reasons: reasons.slice(0, 8)
  };
}
