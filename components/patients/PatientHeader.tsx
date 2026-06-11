"use client";
import Link from "next/link";
import {
  IconChevronLeft,
  IconCalendar,
  IconActivityHeartbeat,
  IconStethoscope,
  IconBellRinging,
} from "@tabler/icons-react";
import { Avatar } from "@/components/ui/Avatar";
import { TabNav } from "@/components/ui/Tabs";
import { Caption } from "@/components/ui/Caption";
import { formatDate } from "@/lib/utils";
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
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1.5 text-[12px] text-ink-700">
            <span className="flex items-center gap-1.5">
              <IconCalendar size={14} className="text-ink-500" />
              <span className="text-ink-500">수술일</span>
              <span className="fl-num font-semibold">
                {formatDate(p.surgeryDate)}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <IconActivityHeartbeat size={14} className="text-ink-500" />
              <span className="text-ink-500">부위</span>
              <span className="font-semibold">{p.surgeryLocation}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <IconStethoscope size={14} className="text-ink-500" />
              <span className="text-ink-500">담당</span>
              <span className="font-semibold">{p.surgeonName}</span>
            </span>
          </div>
        </div>
        {p.alert && (
          <div className="bg-red-light border border-red/20 text-red px-3 py-2 rounded-card max-w-[260px] flex items-start gap-2">
            <IconBellRinging size={14} className="mt-0.5 flex-shrink-0" />
            <span className="text-[11px] font-semibold leading-snug">
              {p.alert}
            </span>
          </div>
        )}
      </div>

      <div className="mt-5">
        <TabNav
          tabs={[
            { label: "개요", href: `/patients/${p.pid}` },
            { label: "운동 프로그램", href: `/patients/${p.pid}/program` },
            { label: "측정 세션", href: `/patients/${p.pid}/sessions` },
            { label: "정보 수정", href: `/patients/${p.pid}/edit` },
          ]}
        />
      </div>
    </div>
  );
}
