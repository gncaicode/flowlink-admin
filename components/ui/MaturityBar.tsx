import { cn } from "@/lib/utils";

type Props = {
  value: number;
  showLabel?: boolean;
  size?: "sm" | "md";
  className?: string;
};

export function MaturityBar({
  value,
  showLabel = true,
  size = "md",
  className,
}: Props) {
  const v = Math.max(0, Math.min(100, value));
  const color = v >= 80 ? "bg-navy" : v < 40 ? "bg-red" : "bg-teal";
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[10px] font-semibold tracking-wide12 uppercase text-ink-500">
            혈관 성숙도
          </span>
          <span className="text-[13px] font-bold text-navy fl-num">{v}%</span>
        </div>
      )}
      <div
        className={cn(
          "bg-ink-100 rounded-full overflow-hidden",
          size === "sm" ? "h-1.5" : "h-2",
        )}
      >
        <div
          className={cn("h-full rounded-full transition-all", color)}
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}
