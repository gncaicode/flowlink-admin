"use client";
import { IconBell, IconSearch } from "@tabler/icons-react";
import { useSessionStore } from "@/lib/store/session";

export function Topbar() {
  const email = useSessionStore((s) => s.email);
  const institutionName = useSessionStore((s) => s.institutionName);
  const initial = (email || "C").charAt(0).toUpperCase();
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-ink-200 px-8 h-16 flex items-center gap-4">
      <div className="flex-1 max-w-md">
        <label className="flex items-center gap-2 h-10 px-3.5 bg-snow border border-ink-200 rounded-btn focus-within:border-teal transition-colors">
          <IconSearch size={16} className="text-ink-500" />
          <input
            placeholder="이름, 환자번호로 빠르게 검색"
            className="flex-1 bg-transparent outline-none text-[13px] font-medium text-ink-700 placeholder:text-ink-500/70"
          />
          <kbd className="text-[10px] font-bold text-ink-500 bg-white border border-ink-200 rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </label>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          aria-label="알림"
          className="relative w-10 h-10 rounded-full hover:bg-snow flex items-center justify-center text-ink-700"
        >
          <IconBell size={20} stroke={1.6} />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red border-2 border-white" />
        </button>
        <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center font-bold text-[13px]">
          {initial}
        </div>
        <div className="hidden md:block leading-tight pr-1">
          <div className="text-[12px] font-bold text-navy">
            {email || "clinician@hospital.kr"}
          </div>
          <div className="text-[10px] text-ink-500">{institutionName}</div>
        </div>
      </div>
    </header>
  );
}
