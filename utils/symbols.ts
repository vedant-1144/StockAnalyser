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

export function normalizeInputSymbol(symbol: string): string {
  let decoded = symbol;

  try {
    decoded = decodeURIComponent(symbol);
  } catch {
    decoded = symbol;
  }

  return decoded.replace(".NS", "").replace(".BO", "").trim().toUpperCase();
}

export function toNseTicker(symbol: string): string {
  const cleaned = normalizeInputSymbol(symbol);
  if (cleaned.includes(".")) return cleaned;
  return `${cleaned}.NS`;
}
