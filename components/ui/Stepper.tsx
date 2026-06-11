import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";

type Step = { label: string; sub?: string };

type Props = {
  steps: Step[];
  current: number;
  orientation?: "horizontal" | "vertical";
  className?: string;
};

export function Stepper({
  steps,
  current,
  orientation = "horizontal",
  className,
}: Props) {
  if (orientation === "vertical") {
    return (
      <ol className={cn("flex flex-col gap-6", className)}>
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={i} className="flex items-start gap-3">
              <div className="flex flex-col items-center self-stretch">
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold border transition-colors",
                    done && "bg-teal border-teal text-white",
                    active && "border-navy bg-white text-navy",
                    !done && !active && "border-ink-200 bg-white text-ink-500",
                  )}
                >
                  {done ? <IconCheck size={14} stroke={2.6} /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-px flex-1 mt-1 min-h-[28px]",
                      done ? "bg-teal" : "bg-ink-200",
                    )}
                  />
                )}
              </div>
              <div className="pt-0.5">
                <div
                  className={cn(
                    "text-[13px] font-semibold",
                    active ? "text-navy" : done ? "text-teal" : "text-ink-500",
                  )}
                >
                  {s.label}
                </div>
                {s.sub && (
                  <div className="text-[11px] text-ink-500 mt-0.5">{s.sub}</div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    );
  }
  return (
    <div className={cn("flex gap-2 w-full", className)}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={i} className="flex-1">
            <div
              className={cn(
                "h-[3px] rounded-full",
                done || active ? "bg-teal" : "bg-ink-200",
              )}
            />
            <div
              className={cn(
                "mt-2 text-[10px] font-semibold tracking-[0.06em]",
                done ? "text-teal" : active ? "text-navy" : "text-ink-500",
              )}
            >
              {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
