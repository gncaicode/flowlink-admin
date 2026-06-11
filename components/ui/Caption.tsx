import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  tone?: "teal" | "ink" | "white";
  className?: string;
};

export function Caption({ children, tone = "teal", className }: Props) {
  const toneClass =
    tone === "teal"
      ? "text-teal"
      : tone === "white"
        ? "text-white/55"
        : "text-ink-500";
  return (
    <span
      className={cn(
        "text-[11px] font-semibold tracking-caption uppercase",
        toneClass,
        className,
      )}
    >
      {children}
    </span>
  );
}
