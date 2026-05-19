"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { DailyPoint } from "@/lib/analytics";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMounted } from "@/hooks/useMounted";
import ChartCard from "./ChartCard";
import ChartTooltip from "./ChartTooltip";

interface DailyTrendChartProps {
  data: DailyPoint[];
}

/* Show only every Nth label to avoid crowding */
function tickInterval(len: number): number {
  if (len <= 10) return 0;
  if (len <= 20) return 1;
  if (len <= 40) return 2;
  return Math.ceil(len / 15) - 1;
}

export default function DailyTrendChart({ data }: DailyTrendChartProps) {
  const { t } = useLanguage();
  const a = t.analytics;
  const mounted = useMounted();

  const hasData = data.some((d) => d.minutes > 0);
  const interval = tickInterval(data.length);

  const totalH = Math.round(data.reduce((s, d) => s + d.minutes, 0) / 60);

  return (
    <ChartCard
      title={a.trendTitle}
      desc={a.trendDesc}
      minH={260}
      right={
        hasData ? (
          <span className="num rounded-lg px-2 py-1 text-xs font-medium" style={{ backgroundColor: "var(--bg-raised)", color: "var(--text-2)" }}>
            {totalH}{a.kpiHoursUnit}
          </span>
        ) : undefined
      }
    >
      {!hasData ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 py-12">
          <p className="text-sm" style={{ color: "var(--text-3)" }}>{a.trendNoData}</p>
        </div>
      ) : !mounted ? (
        <div style={{ height: 240 }} />
      ) : (
        <div style={{ width: "100%", height: 240, overflow: "hidden" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.35} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-color)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fill: "var(--text-3)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={interval}
            />

            <YAxis
              tickFormatter={(v: number) => `${Math.round(v / 60)}h`}
              tick={{ fill: "var(--text-3)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              content={(props) => (
                <ChartTooltip
                  active={props.active}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  payload={props.payload as any}
                  label={String(props.label ?? "")}
                  labelFormatter={(label, payload) => {
                    const p = payload?.[0]?.payload as DailyPoint | undefined;
                    return `${label}${p?.logCount ? ` · ${p.logCount} ${a.trendLogCount}` : ""}`;
                  }}
                  formatter={(value, name) => {
                    if (name === "ma7") return [`${Math.round(value / 60)}h`, a.trendMa7];
                    return [`${Math.round(value / 60)}h`, a.trendHours];
                  }}
                />
              )}
              cursor={{ fill: "rgba(59,130,246,0.06)" }}
            />

            <Bar
              dataKey="minutes"
              name={a.trendHours}
              fill="url(#barGrad)"
              radius={[3, 3, 0, 0]}
              maxBarSize={28}
            />

            <Line
              type="monotone"
              dataKey="ma7"
              name="ma7"
              stroke="#60a5fa"
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              activeDot={{ r: 3, fill: "#60a5fa" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
        </div>
      )}
    </ChartCard>
  );
}
