import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className,
      )}
    >
      {icon && (
        <div className="w-14 h-14 rounded-full bg-navy-faint text-navy flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <div className="text-[15px] font-bold text-navy">{title}</div>
      {description && (
        <div className="text-[12px] text-ink-500 mt-1 max-w-sm">
          {description}
        </div>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
