"use client";
import { IconSearch, IconMenu2 } from "@tabler/icons-react";
import { useSessionStore } from "@/lib/store/session";

export function Topbar({ onMenuToggle }: { onMenuToggle: () => void }) {
  const username = useSessionStore((s) => s.username);
  const email = useSessionStore((s) => s.email);
  const institutionName = useSessionStore((s) => s.institutionName);
  const displayName = username || email || "admin";
  const initial = displayName.charAt(0).toUpperCase();
  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-ink-200 px-4 lg:px-8 h-16 flex items-center gap-3">
      {/* 모바일 햄버거 버튼 */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden w-10 h-10 flex items-center justify-center rounded-btn hover:bg-snow text-ink-700 transition-colors"
        aria-label="메뉴 열기"
      >
        <IconMenu2 size={22} />
      </button>

      <div className="flex-1 max-w-md hidden sm:block">
        <label className="flex items-center gap-2 h-10 px-3.5 bg-snow border border-ink-200 rounded-btn focus-within:border-teal transition-colors">
          <IconSearch size={16} className="text-ink-500" />
          <input
            placeholder="이름, 환자번호로 빠르게 검색"
            className="flex-1 bg-transparent outline-none text-[13px] font-medium text-ink-700 placeholder:text-ink-500/70"
          />
          <kbd className="hidden md:inline text-[10px] font-bold text-ink-500 bg-white border border-ink-200 rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </label>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="w-9 h-9 rounded-full bg-navy text-white flex items-center justify-center font-bold text-[13px]">
          {initial}
        </div>
        <div className="hidden md:block leading-tight pr-1">
          <div className="text-[12px] font-bold text-navy">
            {displayName}
          </div>
          <div className="text-[10px] text-ink-500">{institutionName}</div>
        </div>
      </div>
    </header>
  );
}
