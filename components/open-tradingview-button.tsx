"use client";

import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OpenTradingViewButtonProps {
  symbol: string;
  className?: string;
}

export function OpenTradingViewButton({ symbol, className }: OpenTradingViewButtonProps) {
  return (
    <Button
      onClick={() => {
        const tradingViewSymbol = encodeURIComponent(`NSE:${symbol.toUpperCase()}`);
        window.open(`https://www.tradingview.com/chart/?symbol=${tradingViewSymbol}`, "_blank", "noopener,noreferrer");
      }}
      className={className}
    >
      Open TradingView
      <ExternalLink className="h-4 w-4" />
    </Button>
  );
}
