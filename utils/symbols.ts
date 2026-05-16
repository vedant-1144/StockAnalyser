export const DEFAULT_SCAN_SYMBOLS = [
  "RELIANCE",
  "TCS",
  "INFY",
  "HDFCBANK",
  "ICICIBANK",
  "SBIN",
  "LT",
  "ITC",
  "BHARTIARTL",
  "AXISBANK",
  "KOTAKBANK",
  "MARUTI",
  "BAJFINANCE",
  "HCLTECH",
  "ASIANPAINT",
  "SUNPHARMA",
  "ULTRACEMCO",
  "TITAN",
  "WIPRO",
  "NTPC"
] as const;

export function toNseTicker(symbol: string): string {
  const cleaned = symbol.trim().toUpperCase();
  if (cleaned.includes(".")) return cleaned;
  return `${cleaned}.NS`;
}
