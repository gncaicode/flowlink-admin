type Props = {
  width?: number;
  height?: number;
  opacity?: number;
  className?: string;
};

const DOTS: [number, number, number, number][] = [
  [40, 50, 2.2, 0.5],
  [110, 30, 1.6, 0.3],
  [180, 60, 2, 0.45],
  [260, 35, 1.4, 0.28],
  [320, 80, 1.8, 0.4],
  [70, 110, 1.5, 0.32],
  [150, 130, 2.4, 0.55],
  [220, 110, 1.6, 0.34],
  [290, 150, 2, 0.45],
  [50, 170, 1.4, 0.28],
  [130, 190, 1.8, 0.4],
  [210, 180, 1.5, 0.3],
  [300, 200, 2.2, 0.5],
  [340, 130, 1.5, 0.3],
  [20, 100, 1.4, 0.25],
  [380, 50, 1.6, 0.32],
  [400, 180, 1.8, 0.4],
];

const LINES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [5, 6],
  [6, 7],
  [7, 8],
  [9, 10],
  [10, 11],
  [11, 12],
  [1, 5],
  [2, 6],
  [3, 7],
  [4, 8],
  [6, 10],
  [7, 11],
  [8, 12],
  [0, 5],
  [13, 4],
  [14, 5],
  [3, 15],
  [12, 16],
];

export function FLDotPattern({
  width = 420,
  height = 240,
  opacity = 0.55,
  className,
}: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: "block", opacity }}
      className={className}
      aria-hidden
    >
      {LINES.map((l, i) => {
        const a = DOTS[l[0]];
        const b = DOTS[l[1]];
        if (!a || !b) return null;
        return (
          <line
            key={i}
            x1={a[0]}
            y1={a[1]}
            x2={b[0]}
            y2={b[1]}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="0.7"
          />
        );
      })}
      {DOTS.map((d, i) => (
        <circle
          key={i}
          cx={d[0]}
          cy={d[1]}
          r={d[2]}
          fill={
            i % 5 === 0
              ? "#E53E3E"
              : i % 4 === 0
                ? "#319795"
                : "rgba(255,255,255,0.55)"
          }
          opacity={d[3]}
        />
      ))}
    </svg>
  );
}
