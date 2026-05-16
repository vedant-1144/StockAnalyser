import type { Recommendation } from "@/types/stock";
import { cn } from "@/lib/utils";

export function RecommendationBadge({ recommendation }: { recommendation: Recommendation }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
        recommendation === "Strong Swing Buy" && "bg-success/20 text-success",
        recommendation === "Watchlist" && "bg-yellow-500/20 text-yellow-400",
        recommendation === "Avoid" && "bg-danger/20 text-danger"
      )}
    >
      {recommendation}
    </span>
  );
}
