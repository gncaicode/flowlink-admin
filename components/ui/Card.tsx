import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  padded?: boolean;
  hover?: boolean;
};

export function Card({ children, className, padded = true, hover = false }: Props) {
  return (
    <div
      className={cn(
        "bg-white border-[0.5px] border-ink-200 rounded-card shadow-card",
        hover && "transition-shadow hover:shadow-card-hover",
        padded && "p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
