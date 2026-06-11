"use client";
import { useMemo, useState } from "react";
import { IconPlus, IconSearch, IconFilter } from "@tabler/icons-react";
import { Caption } from "@/components/ui/Caption";
import { LinkButton } from "@/components/ui/Button";
import { PatientTable } from "@/components/patients/PatientTable";
import { usePatientsStore } from "@/lib/store/patients";
import { cn } from "@/lib/utils";
import type { PatientStatus } from "@/types/domain";

type Filter = "all" | PatientStatus;

export default function PatientsPage() {
  const patients = usePatientsStore((s) => s.patients);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = patients;
    if (filter !== "all") {
      list = list.filter((p) => p.status === filter);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.pid.toLowerCase().includes(q),
      );
    }
    return list;
  }, [patients, filter, query]);

  const counts = useMemo(() => {
    return {
      all: patients.length,
      active: patients.filter((p) => p.status === "active").length,
      watch: patients.filter((p) => p.status === "watch").length,
      ready: patients.filter((p) => p.status === "ready").length,
      inactive: patients.filter((p) => p.status === "inactive").length,
    };
  }, [patients]);

  const TABS: {
    id: Filter;
    label: string;
    count: number;
    tone?: "red";
  }[] = [
    { id: "all", label: "전체", count: counts.all },
    { id: "watch", label: "관찰 필요", count: counts.watch, tone: "red" },
    { id: "active", label: "운동 중", count: counts.active },
    { id: "ready", label: "성숙 완료 임박", count: counts.ready },
    { id: "inactive", label: "미참여", count: counts.inactive },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Caption>PATIENT ROSTER</Caption>
          <h1 className="mt-2 text-[28px] font-bold text-navy tracking-tight">
            대상자 관리{" "}
            <span className="text-[14px] font-medium text-ink-500 ml-1">
              총 <b className="text-navy">{patients.length}명</b>
            </span>
          </h1>
          <p className="mt-1 text-[13px] text-ink-500">
            등록된 AVF 수술 환자의 운동 수행 데이터를 한 곳에서 관리합니다.
          </p>
        </div>
        <LinkButton href="/patients/new" size="md" variant="primary">
          <IconPlus size={18} stroke={2.4} />
          대상자 등록
        </LinkButton>
      </div>

      {/* Filter tabs */}
      <div className="mt-7 bg-white border-[0.5px] border-ink-200 rounded-card p-1.5 inline-flex gap-1 flex-wrap">
        {TABS.map((t) => {
          const active = filter === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setFilter(t.id)}
              className={cn(
                "px-3.5 py-2 rounded-btn text-[12px] font-semibold flex items-center gap-1.5 transition-colors",
                active
                  ? "bg-navy text-white"
                  : "text-ink-500 hover:text-navy hover:bg-snow",
              )}
            >
              <span>{t.label}</span>
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded",
                  t.tone === "red" && !active
                    ? "bg-red-light text-red"
                    : active
                      ? "bg-white/15 text-white"
                      : "bg-ink-100 text-ink-500",
                )}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="mt-4 flex items-center gap-3">
        <label className="flex items-center gap-2 h-10 px-3.5 bg-white border border-ink-200 rounded-btn w-full max-w-md focus-within:border-teal transition-colors">
          <IconSearch size={16} className="text-ink-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름 · 환자번호로 검색"
            className="flex-1 bg-transparent outline-none text-[13px] text-ink-700 placeholder:text-ink-500/70"
          />
        </label>
        <button className="h-10 px-3 border border-ink-200 rounded-btn bg-white text-[12px] font-semibold text-ink-700 hover:border-navy/40 flex items-center gap-1.5">
          <IconFilter size={14} />
          정밀 필터
        </button>
        <div className="ml-auto text-[12px] text-ink-500">
          <b className="text-navy fl-num">{filtered.length}</b>명 표시 중
        </div>
      </div>

      <div className="mt-5">
        <PatientTable data={filtered} />
      </div>
    </div>
  );
}
