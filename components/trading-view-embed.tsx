"use client";

interface TradingViewEmbedProps {
  symbol: string;
}

export function TradingViewEmbed({ symbol }: TradingViewEmbedProps) {
  const tradingViewSymbol = `NSE:${symbol.toUpperCase()}`;
  const src = `https://s.tradingview.com/widgetembed/?symbol=${encodeURIComponent(tradingViewSymbol)}&interval=D&theme=dark&style=1&toolbarbg=1f2430&hide_top_toolbar=true&saveimage=false&hide_legend=true`;

  return (
    <div className="glass-card overflow-hidden">
      <iframe
        title={`${symbol} TradingView chart`}
        src={src}
        className="h-[420px] w-full"
        loading="lazy"
      />
    </div>
  );
}
