import { EMA, MACD, RSI, SMA } from "technicalindicators";
import type { PricePoint, TechnicalMetrics } from "@/types/stock";
import { safeNumber } from "@/utils/math";

interface RawHistoryPoint {
  date: Date;
  close?: number | null;
  low?: number | null;
  high?: number | null;
  volume?: number | null;
}

interface TechnicalOutput {
  technicals: TechnicalMetrics;
  history: PricePoint[];
}

export function calculateTechnicals(
  rawHistory: RawHistoryPoint[],
  latestPrice: number,
  latestVolume: number
): TechnicalOutput {
  const history = rawHistory
    .map((item) => ({
      date: item.date.toISOString().slice(0, 10),
      close: safeNumber(item.close),
      volume: safeNumber(item.volume),
      low: safeNumber(item.low),
      high: safeNumber(item.high)
    }))
    .filter((item) => item.close > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  const closes = history.map((item) => item.close);

  if (closes.length < 30) {
    const fallbackHistory: PricePoint[] = history.map((item) => ({
      date: item.date,
      close: item.close,
      volume: item.volume
    }));

    return {
      technicals: {
        rsi: 50,
        macd: 0,
        macdSignal: 0,
        ema20: latestPrice,
        ema50: latestPrice,
        sma200: latestPrice,
        volumeBreakout: false,
        support: latestPrice * 0.96,
        resistance: latestPrice * 1.04,
        trend: "sideways",
        setup: "none"
      },
      history: fallbackHistory
    };
  }

  const rsiSeries = RSI.calculate({ values: closes, period: 14 });
  const ema20Series = EMA.calculate({ values: closes, period: 20 });
  const ema50Series = EMA.calculate({ values: closes, period: 50 });
  const sma200Series = SMA.calculate({ values: closes, period: 200 });
  const macdSeries = MACD.calculate({
    values: closes,
    fastPeriod: 12,
    slowPeriod: 26,
    signalPeriod: 9,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });

  const rsi = safeNumber(rsiSeries.at(-1), 50);
  const ema20 = safeNumber(ema20Series.at(-1), latestPrice);
  const ema50 = safeNumber(ema50Series.at(-1), latestPrice);
  const sma200 = safeNumber(sma200Series.at(-1), latestPrice);
  const macd = safeNumber(macdSeries.at(-1)?.MACD, 0);
  const macdSignal = safeNumber(macdSeries.at(-1)?.signal, 0);

  const lookbackWindow = history.slice(-20);
  const lows = lookbackWindow.map((item) => item.low).filter((value) => value > 0);
  const highs = lookbackWindow.map((item) => item.high).filter((value) => value > 0);
  const support = lows.length > 0 ? Math.min(...lows) : latestPrice * 0.96;
  const resistance = highs.length > 0 ? Math.max(...highs) : latestPrice * 1.04;

  const avgVol20 =
    lookbackWindow.reduce((acc, item) => acc + safeNumber(item.volume), 0) /
    Math.max(lookbackWindow.length, 1);
  const volumeBreakout = latestVolume > avgVol20 * 1.5;

  let trend: TechnicalMetrics["trend"] = "sideways";
  if (latestPrice > ema20 && ema20 > ema50 && ema50 > sma200) {
    trend = "uptrend";
  } else if (latestPrice < ema20 && ema20 < ema50) {
    trend = "downtrend";
  }

  let setup: TechnicalMetrics["setup"] = "none";
  if (latestPrice >= resistance * 0.995 && volumeBreakout) {
    setup = "breakout";
  } else if (rsi < 40 && latestPrice > ema20) {
    setup = "reversal";
  } else if (rsi >= 45 && rsi <= 55) {
    setup = "consolidation";
  }

  const mergedHistory: PricePoint[] = history.map((item) => ({
    date: item.date,
    close: item.close,
    volume: item.volume
  }));

  const applySeries = (values: number[], key: "ema20" | "ema50" | "rsi") => {
    const offset = mergedHistory.length - values.length;
    values.forEach((value, index) => {
      mergedHistory[index + offset][key] = value;
    });
  };

  applySeries(ema20Series, "ema20");
  applySeries(ema50Series, "ema50");
  applySeries(rsiSeries, "rsi");

  return {
    technicals: {
      rsi,
      macd,
      macdSignal,
      ema20,
      ema50,
      sma200,
      volumeBreakout,
      support,
      resistance,
      trend,
      setup
    },
    history: mergedHistory
  };
}
