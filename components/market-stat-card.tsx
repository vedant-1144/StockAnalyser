import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface MarketStatCardProps {
  title: string;
  value: string;
  hint?: string;
  positive?: boolean;
}

export function MarketStatCard({ title, value, hint, positive }: MarketStatCardProps) {
  return (
    <Card className="p-4">
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className={cn("mt-2 text-2xl font-semibold", positive === false ? "text-danger" : positive ? "text-success" : "text-foreground")}>
        {value}
      </p>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}
