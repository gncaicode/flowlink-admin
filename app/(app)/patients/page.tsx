"use client";
import { useMemo, useState } from "react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { Caption } from "@/components/ui/Caption";
import { LinkButton } from "@/components/ui/Button";
import { PatientTable } from "@/components/patients/PatientTable";
import { usePatientsStore } from "@/lib/store/patients";

export default function PatientsPage() {
  const patients = usePatientsStore((s) => s.patients);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return patients;
    const q = query.trim().toLowerCase();
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.pid.toLowerCase().includes(q),
    );
  }, [patients, query]);

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

      {/* Search */}
      <div className="mt-7 flex items-center gap-3">
        <label className="flex items-center gap-2 h-10 px-3.5 bg-white border border-ink-200 rounded-btn w-full max-w-md focus-within:border-teal transition-colors">
          <IconSearch size={16} className="text-ink-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="이름 · 환자번호로 검색"
            className="flex-1 bg-transparent outline-none text-[13px] text-ink-700 placeholder:text-ink-500/70"
          />
        </label>
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
