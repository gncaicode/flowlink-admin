import { cn } from "@/lib/utils";

type Tone = "active" | "watch" | "ready" | "inactive" | "info" | "neutral";

const TONES: Record<Tone, { bg: string; fg: string; dot: string; label: string }> = {
  active: { bg: "bg-teal-light", fg: "text-teal", dot: "bg-teal", label: "운동 중" },
  watch: { bg: "bg-red-light", fg: "text-red", dot: "bg-red", label: "관찰 필요" },
  ready: { bg: "bg-navy-faint", fg: "text-navy", dot: "bg-navy", label: "성숙 완료 임박" },
  inactive: { bg: "bg-ink-100", fg: "text-ink-500", dot: "bg-ink-500", label: "미참여" },
  info: { bg: "bg-navy-faint", fg: "text-navy", dot: "bg-navy", label: "" },
  neutral: { bg: "bg-ink-100", fg: "text-ink-700", dot: "bg-ink-500", label: "" },
};

type Props = {
  tone: Tone;
  label?: string;
  showDot?: boolean;
  className?: string;
};

export function Badge({ tone, label, showDot = true, className }: Props) {
  const t = TONES[tone];
  const text = label ?? t.label;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold tracking-[0.06em]",
        t.bg,
        t.fg,
        className,
      )}
    >
      {showDot && <span className={cn("w-1.5 h-1.5 rounded-full", t.dot)} />}
      {text}
    </span>
  );
}
