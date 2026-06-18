"use client";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconUsers,
  IconUsersGroup,
  IconTrophy,
  IconSettings,
  IconReportMedical,
  IconLogout,
  IconX,
} from "@tabler/icons-react";
import { FLSymbol } from "@/components/brand/FLSymbol";
import { FLWordmark } from "@/components/brand/FLWordmark";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/lib/store/session";
import { useRouter } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
  comingSoon?: boolean;
};

const NAV: NavItem[] = [
  { label: "대시보드", href: "/dashboard", icon: <IconLayoutDashboard size={20} /> },
  { label: "대상자 관리", href: "/patients", icon: <IconUsers size={20} /> },
  {
    label: "그룹 관리",
    href: "/groups",
    icon: <IconUsersGroup size={20} />,
    disabled: true,
    comingSoon: true,
  },
  {
    label: "랭킹",
    href: "/rankings",
    icon: <IconTrophy size={20} />,
    disabled: true,
    comingSoon: true,
  },
  {
    label: "리서치 데이터",
    href: "/research",
    icon: <IconReportMedical size={20} />,
    disabled: true,
    comingSoon: true,
  },
  { label: "설정", href: "/settings", icon: <IconSettings size={20} /> },
];

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useSessionStore((s) => s.logout);
  const institutionName = useSessionStore((s) => s.institutionName);

  // 페이지 이동 시 모바일 사이드바 닫기
  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  function onLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className={cn(
      "w-[240px] bg-navy text-white flex flex-col h-screen z-50",
      "fixed top-0 left-0 transition-transform duration-300 ease-in-out",
      isOpen ? "translate-x-0" : "-translate-x-full",
      "lg:sticky lg:top-0 lg:translate-x-0 lg:shrink-0",
    )}>
      {/* 모바일 닫기 버튼 */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-white/60 hover:text-white rounded-btn hover:bg-white/10 transition-colors"
        aria-label="메뉴 닫기"
      >
        <IconX size={18} />
      </button>

      <Link href="/dashboard" className="px-5 pt-6 pb-5 flex items-center gap-2.5">
        <FLSymbol size={32} dark />
        <FLWordmark size={18} dark />
      </Link>

      <div className="px-5 pb-5 border-b border-white/10">
        <div className="text-[10px] font-semibold tracking-[0.16em] uppercase text-white/40">
          INSTITUTION
        </div>
        <div className="mt-1 text-[13px] font-bold text-white truncate">
          {institutionName || "FlowLink 의료기관"}
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          if (item.disabled) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-white/35 cursor-not-allowed"
              >
                <span className="opacity-60">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.comingSoon && (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-white/8 text-white/50 px-1.5 py-0.5 rounded">
                    SOON
                  </span>
                )}
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-btn transition-colors",
                active
                  ? "bg-white/10 text-white font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/5 font-medium",
              )}
            >
              <span className={active ? "text-teal" : ""}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="m-3 flex items-center gap-3 px-3 py-2.5 text-[13px] text-white/55 hover:text-white hover:bg-white/5 rounded-btn font-medium transition-colors"
      >
        <IconLogout size={18} />
        로그아웃
      </button>
    </aside>
  );
}
