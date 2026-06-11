"use client";
import { useEffect } from "react";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  caption?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

export function Modal({
  open,
  onClose,
  title,
  caption,
  children,
  footer,
  size = "md",
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const widthClass =
    size === "sm" ? "max-w-md" : size === "lg" ? "max-w-3xl" : "max-w-xl";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-navy/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative bg-white rounded-card shadow-card-hover w-full overflow-hidden",
          widthClass,
        )}
      >
        {(title || caption) && (
          <div className="px-6 pt-6 pb-4 border-b border-ink-200 flex items-start justify-between gap-4">
            <div>
              {caption && (
                <div className="text-[11px] font-semibold tracking-caption uppercase text-teal">
                  {caption}
                </div>
              )}
              {title && (
                <div className="text-[18px] font-bold text-navy mt-1">
                  {title}
                </div>
              )}
            </div>
            <button
              aria-label="닫기"
              onClick={onClose}
              className="text-ink-500 hover:text-navy hover:bg-ink-100 rounded-full p-1.5 transition-colors"
            >
              <IconX size={18} />
            </button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-ink-200 bg-snow flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
