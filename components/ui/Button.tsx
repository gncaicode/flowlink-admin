import { forwardRef, type ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-btn transition-all disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/40 focus-visible:ring-offset-1";

const variants: Record<Variant, string> = {
  primary:
    "bg-red text-white font-bold hover:bg-[#C53030] active:bg-[#9B2C2C] shadow-red-soft hover:shadow-red-glow",
  secondary:
    "bg-white text-navy border border-navy/80 hover:bg-navy-faint",
  ghost: "bg-transparent text-ink-700 hover:bg-ink-100",
  danger:
    "bg-white text-red border border-red/30 hover:bg-red-light",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-[12px]",
  md: "h-11 px-4 text-[13px]",
  lg: "h-[52px] px-6 text-[14px]",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = "primary", size = "md", className, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...rest}
      />
    );
  },
);

type LinkButtonProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  target?: string;
};

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  target,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
