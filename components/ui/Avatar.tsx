import { cn } from "@/lib/utils";

type Props = {
  name: string;
  tone?: "navy" | "red" | "teal";
  size?: number;
  className?: string;
};

export function Avatar({ name, tone = "navy", size = 42, className }: Props) {
  const toneClass =
    tone === "red"
      ? "bg-red-light text-red"
      : tone === "teal"
        ? "bg-teal-light text-teal"
        : "bg-navy-faint text-navy";
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-[10px] font-bold flex-shrink-0",
        toneClass,
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.4),
      }}
    >
      {name.trim().charAt(0)}
    </span>
  );
}
