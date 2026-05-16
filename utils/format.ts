const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2
});

const compactInrFormatter = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 2
});

const numberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 2
});

export function formatINR(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return inrFormatter.format(value);
}

export function formatCompactINR(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return compactInrFormatter.format(value);
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return numberFormatter.format(value);
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "-";
  return `${value.toFixed(2)}%`;
}

export function scoreTone(score: number): "text-success" | "text-yellow-400" | "text-danger" {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-yellow-400";
  return "text-danger";
}
