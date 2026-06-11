"use client";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  Legend,
} from "recharts";

export type LineSeries = { key: string; label: string; color: string };
export type MultiPoint = { label: string } & Record<string, number | string>;

type Props = {
  data: MultiPoint[];
  series: LineSeries[];
  height?: number;
  repMarkers?: number[]; // data index where rep was detected
};

const REP_COLOR = "#E53E3E";

// rep 범례 아이콘: 빨간 점선
function RepLegendIcon() {
  return (
    <svg width="24" height="12" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 4 }}>
      <line x1="0" y1="6" x2="24" y2="6" stroke={REP_COLOR} strokeWidth="2" strokeDasharray="4 2" />
    </svg>
  );
}

export function MultiLineChart({ data, series, height = 220, repMarkers = [] }: Props) {
  const markerLabels = new Set(repMarkers.map((i) => data[i]?.label).filter(Boolean));
  const hasReps = markerLabels.size > 0;

  return (
    <div style={{ width: "100%", height, minWidth: 0 }}>
      <ResponsiveContainer debounce={50}>
        <LineChart data={data} margin={{ top: 14, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#EDF2F7" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#718096", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#718096", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "0.5px solid #E2E8F0",
              fontSize: 11,
              fontWeight: 600,
            }}
            labelStyle={{ color: "#1A365D", fontWeight: 700 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, fontWeight: 600, paddingTop: 4 }}
            formatter={(value) => (
              <span style={{ color: "#4A5568" }}>{value}</span>
            )}
            content={({ payload }) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 16px", paddingTop: 6, fontSize: 11, fontWeight: 600 }}>
                {payload?.map((entry) => (
                  <span key={entry.value} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ display: "inline-block", width: 20, height: 3, background: entry.color as string, borderRadius: 2 }} />
                    <span style={{ color: "#4A5568" }}>{entry.value}</span>
                  </span>
                ))}
                {hasReps && (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <RepLegendIcon />
                    <span style={{ color: REP_COLOR }}>Rep 감지</span>
                  </span>
                )}
              </div>
            )}
          />
          {Array.from(markerLabels).map((lbl) => (
            <ReferenceLine
              key={lbl}
              x={lbl}
              stroke={REP_COLOR}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          ))}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
