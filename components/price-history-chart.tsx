"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { PricePoint } from "@/types/stock";
import { formatINR } from "@/utils/format";

interface PriceHistoryChartProps {
  data: PricePoint[];
}

export function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  const compact = data.slice(-120);

  return (
    <div className="glass-card p-4">
      <h3 className="mb-3 text-sm font-medium text-foreground">Price vs EMA Trend (1Y)</h3>
      <div className="h-[320px] w-full">
        <ResponsiveContainer>
          <LineChart data={compact} margin={{ top: 10, right: 12, left: 6, bottom: 5 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(135,145,170,0.2)" />
            <XAxis dataKey="date" hide />
            <YAxis
              tick={{ fill: "#95A2C3", fontSize: 12 }}
              domain={["auto", "auto"]}
              tickFormatter={(value) => String(Math.round(value))}
            />
            <Tooltip
              formatter={(value: number) => formatINR(Number(value))}
              labelFormatter={(label: string) => `Date: ${label}`}
              contentStyle={{
                background: "#111827",
                border: "1px solid rgba(148,163,184,0.3)",
                borderRadius: 10
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="close" stroke="#60a5fa" strokeWidth={2} dot={false} name="Close" />
            <Line type="monotone" dataKey="ema20" stroke="#34d399" strokeWidth={1.5} dot={false} name="EMA20" />
            <Line type="monotone" dataKey="ema50" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="EMA50" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
