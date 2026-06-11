"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = { label: string; href: string; count?: number; tone?: "red" };

type Props = {
  tabs: Tab[];
  className?: string;
};

export function TabNav({ tabs, className }: Props) {
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto fl-noscroll border-b border-ink-200",
        className,
      )}
    >
      {tabs.map((t) => {
        const active =
          pathname === t.href || pathname?.startsWith(`${t.href}/`);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "px-4 py-3.5 flex items-center gap-2 border-b-2 transition-colors",
              active
                ? "border-navy text-navy font-bold"
                : "border-transparent text-ink-500 hover:text-navy",
            )}
          >
            <span className="text-[13px]">{t.label}</span>
            {typeof t.count === "number" && (
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-md",
                  t.tone === "red"
                    ? "bg-red-light text-red"
                    : active
                      ? "bg-navy-faint text-navy"
                      : "bg-ink-100 text-ink-500",
                )}
              >
                {t.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
