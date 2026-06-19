"use client";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";
import { Avatar } from "@/components/ui/Avatar";
import { TabNav } from "@/components/ui/Tabs";
import { Caption } from "@/components/ui/Caption";
import type { Patient } from "@/types/domain";

type Props = {
  patient: Patient;
};

export function PatientHeader({ patient }: Props) {
  const p = patient;
  return (
    <div>
      <Link
        href="/patients"
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-500 hover:text-navy"
      >
        <IconChevronLeft size={14} /> 대상자 목록으로
      </Link>

      <div className="mt-4 bg-white border-[0.5px] border-ink-200 rounded-card p-6 flex flex-wrap items-start gap-6">
        <Avatar
          name={p.name}
          tone="navy"
          size={64}
        />
        <div className="flex-1 min-w-[260px]">
          <Caption>PATIENT · {p.pid}</Caption>
          <div className="mt-1 flex items-baseline gap-3 flex-wrap">
            <h1 className="text-[28px] font-bold text-navy tracking-tight">
              {p.name}
            </h1>
            <div className="text-[13px] text-ink-500">
              {p.age}세 · {p.gender === "M" ? "남성" : "여성"}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <TabNav
          tabs={[
            { label: "측정 세션", href: `/patients/${p.pid}/sessions` },
            { label: "정보 수정", href: `/patients/${p.pid}/edit` },
          ]}
        />
      </div>
    </div>
  );
}
