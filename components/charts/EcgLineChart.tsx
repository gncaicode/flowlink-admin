"use client";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Point = { label: string; value: number };

type Props = {
  data: Point[];
  yLabel?: string;
  color?: string;
  height?: number;
};

export function EcgLineChart({
  data,
  yLabel,
  color = "#319795",
  height = 200,
}: Props) {
  return (
    <div style={{ width: "100%", height, minWidth: 0 }}>
      <ResponsiveContainer debounce={50}>
        <LineChart data={data} margin={{ top: 14, right: 12, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="#EDF2F7" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#718096", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#718096", fontWeight: 600 }}
            axisLine={false}
            tickLine={false}
            label={
              yLabel
                ? {
                    value: yLabel,
                    angle: -90,
                    position: "insideLeft",
                    style: {
                      fontSize: 10,
                      fill: "#718096",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                    },
                  }
                : undefined
            }
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "0.5px solid #E2E8F0",
              fontSize: 12,
              fontWeight: 600,
            }}
            labelStyle={{ color: "#1A365D", fontWeight: 700 }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0, fill: color }}
            activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
