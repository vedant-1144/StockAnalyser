export type Recommendation = "Strong Swing Buy" | "Watchlist" | "Avoid";

export interface QuoteSnapshot {
  symbol: string;
  exchangeSymbol: string;
  shortName: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  previousClose: number;
  dayHigh: number;
  dayLow: number;
}

export interface FundamentalMetrics {
  peRatio: number;
  pbRatio: number;
  roe: number;
  roce: number;
  eps: number;
  debtToEquity: number;
  revenueGrowth: number;
  profitGrowth: number;
  marketCap: number;
}

export interface QuarterlyMetrics {
  qoqRevenueGrowth: number;
  yoyRevenueGrowth: number;
  profitGrowth: number;
  epsGrowth: number;
}

export interface TechnicalMetrics {
  rsi: number;
  macd: number;
  macdSignal: number;
  ema20: number;
  ema50: number;
  sma200: number;
  volumeBreakout: boolean;
  support: number;
  resistance: number;
  trend: "uptrend" | "downtrend" | "sideways";
  setup: "breakout" | "reversal" | "consolidation" | "none";
}

export interface SwingSetup {
  swingTradeScore: number;
  technicalScore: number;
  fundamentalScore: number;
  earningsScore: number;
  recommendation: Recommendation;
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  reasons: string[];
}

export interface PricePoint {
  date: string;
  close: number;
  volume: number;
  ema20?: number;
  ema50?: number;
  rsi?: number;
}

export interface StockAnalysis {
  quote: QuoteSnapshot;
  fundamentals: FundamentalMetrics;
  quarterly: QuarterlyMetrics;
  technicals: TechnicalMetrics;
  swing: SwingSetup;
  history: PricePoint[];
}

export interface MarketOverview {
  niftyPrice: number;
  niftyChangePercent: number;
  trend: "Bullish" | "Neutral" | "Bearish";
}

export interface MarketScan {
  timestamp: string;
  marketOverview: MarketOverview;
  all: StockAnalysis[];
  topGainers: StockAnalysis[];
  topLosers: StockAnalysis[];
  swingCandidates: StockAnalysis[];
  volumeBreakouts: StockAnalysis[];
  momentumStocks: StockAnalysis[];
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  user_id?: string;
  created_at?: string;
}
