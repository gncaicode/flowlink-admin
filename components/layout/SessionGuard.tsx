"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore, checkSessionValidity } from "@/lib/store/session";
import { usePatientsStore } from "@/lib/store/patients";

export function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authed = useSessionStore((s) => s.authed);
  const _hasHydrated = useSessionStore((s) => s._hasHydrated);
  const fetchPatients = usePatientsStore((s) => s.fetch);
  const patientsLoaded = usePatientsStore((s) => s.loaded);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // _hasHydrated가 true가 되면 (localStorage 로딩 완료) 세션 유효성 검사
    if (!_hasHydrated) return;
    checkSessionValidity();
    setChecked(true);
  }, [_hasHydrated]);

  useEffect(() => {
    if (checked && !authed) {
      router.replace("/login");
    }
  }, [checked, authed, router]);

  useEffect(() => {
    if (authed && !patientsLoaded) {
      fetchPatients();
    }
  }, [authed, patientsLoaded, fetchPatients]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-snow flex items-center justify-center text-ink-500 text-[12px]">
        세션 확인 중...
      </div>
    );
  }
  if (!authed) return null;
  return <>{children}</>;
}
