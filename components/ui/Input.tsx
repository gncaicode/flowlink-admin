import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  caption?: string;
  trailing?: ReactNode;
  leading?: ReactNode;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, caption, trailing, leading, error, className, ...rest },
  ref,
) {
  const hasError = !!error;
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-[11px] font-semibold tracking-wide12 uppercase text-ink-500">
          {label}
        </label>
      )}
      <div
        className={cn(
          "h-11 bg-snow border rounded-btn px-3 flex items-center gap-2 transition-colors",
          hasError ? "border-red" : "border-ink-200 focus-within:border-teal",
        )}
      >
        {leading && <span className="text-ink-500 flex">{leading}</span>}
        <input
          ref={ref}
          className={cn(
            "flex-1 bg-transparent outline-none text-[14px] font-medium text-ink-700 placeholder:text-ink-500/60 fl-num",
            className,
          )}
          {...rest}
        />
        {trailing && <span className="text-ink-500 flex">{trailing}</span>}
      </div>
      {(caption || error) && (
        <div
          className={cn(
            "text-[11px] font-medium",
            hasError ? "text-red" : "text-ink-500",
          )}
        >
          {error || caption}
        </div>
      )}
    </div>
  );
});
