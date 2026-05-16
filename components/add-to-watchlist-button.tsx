"use client";

import { Check, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddToWatchlistButtonProps {
  symbol: string;
  compact?: boolean;
}

export function AddToWatchlistButton({ symbol, compact = false }: AddToWatchlistButtonProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const router = useRouter();

  const addToWatchlist = async () => {
    setStatus("saving");

    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol })
      });

      if (!response.ok) {
        const body = (await response.json()) as { message?: string; error?: string };
        throw new Error(body.message || body.error || "Failed to add symbol");
      }

      setStatus("saved");
      router.push("/watchlist");
    } catch {
      setStatus("error");
    }
  };

  const Icon = status === "saving" ? Loader2 : status === "saved" ? Check : Plus;

  return (
    <Button
      type="button"
      onClick={addToWatchlist}
      disabled={status === "saving" || status === "saved"}
      className={cn(
        "h-9 gap-2 whitespace-nowrap disabled:cursor-default",
        compact ? "px-2.5" : "px-3",
        status === "saved" && "bg-success/20 text-success hover:bg-success/20",
        status === "error" && "bg-danger/20 text-danger hover:bg-danger/30"
      )}
      title={status === "error" ? "Retry add to watchlist" : `Add ${symbol} to watchlist`}
    >
      <Icon className={cn("h-4 w-4", status === "saving" && "animate-spin")} />
      <span className={compact ? "sr-only sm:not-sr-only" : ""}>
        {status === "saved" ? "Added" : status === "error" ? "Retry" : "Add"}
      </span>
    </Button>
  );
}
