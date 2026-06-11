type Props = {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
};

export function MaturityRing({
  value,
  size = 140,
  stroke = 12,
  label = "혈관 성숙도",
}: Props) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  const color = v >= 80 ? "#1A365D" : v < 40 ? "#E53E3E" : "#319795";

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="#EDF2F7"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          fill="none"
          style={{ transition: "stroke-dashoffset 600ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[11px] font-semibold tracking-wide12 uppercase text-ink-500">
          {label}
        </div>
        <div
          className="text-[32px] font-bold text-navy fl-num leading-none mt-1"
          style={{ color }}
        >
          {v}
          <span className="text-[16px] font-semibold ml-0.5">%</span>
        </div>
      </div>
    </div>
  );
}
