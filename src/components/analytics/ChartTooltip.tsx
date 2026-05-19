"use client";

interface TooltipPayloadItem {
  name?: string;
  value?: number;
  color?: string;
  payload?: Record<string, unknown>;
  unit?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: readonly TooltipPayloadItem[];
  label?: string;
  formatter?: (value: number, name: string, item: TooltipPayloadItem) => [string, string];
  labelFormatter?: (label: string, payload: readonly TooltipPayloadItem[]) => string;
}

export default function ChartTooltip({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const displayLabel = labelFormatter
    ? labelFormatter(label ?? "", payload)
    : label;

  return (
    <div
      className="rounded-xl px-3 py-2.5 text-xs shadow-2xl"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        color: "var(--text-1)",
        minWidth: 120,
      }}
    >
      {displayLabel && (
        <div className="mb-1.5 font-semibold" style={{ color: "var(--text-2)" }}>
          {displayLabel}
        </div>
      )}
      {payload.map((item, i) => {
        const [valStr, nameStr] = formatter
          ? formatter(item.value ?? 0, item.name ?? "", item)
          : [String(item.value), item.name ?? ""];
        return (
          <div key={i} className="flex items-center gap-2">
            {item.color && (
              <span
                className="inline-block h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
            )}
            <span style={{ color: "var(--text-3)" }}>{nameStr}</span>
            <span className="num ml-auto font-semibold" style={{ color: "var(--text-1)" }}>
              {valStr}
            </span>
          </div>
        );
      })}
    </div>
  );
}
