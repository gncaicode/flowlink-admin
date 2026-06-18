"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconUsers,
  IconArrowRight,
  IconBellRinging,
  IconPlus,
  IconClockPlay,
  IconActivity,
  IconHandGrab,
  IconBarbell,
  IconRotateClockwise,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Caption } from "@/components/ui/Caption";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EcgLineChart } from "@/components/charts/EcgLineChart";
import { usePatientsStore } from "@/lib/store/patients";
import { useSessionStore } from "@/lib/store/session";
import { formatDate, cn } from "@/lib/utils";

type RecentSession = {
  id: number;
  date: string;
  kind: string;
  repsCompleted: number;
  repsTarget: number;
  feedback: string;
  patientName: string;
  pid: string;
};

type DashboardData = {
  patients: { total: number };
  sessions: { total: number; todayCount: number };
  trend: { label: string; value: number }[];
  recentSessions: RecentSession[];
};

export default function DashboardPage() {
  const router = useRouter();
  const patients = usePatientsStore((s) => s.patients);
  const token = useSessionStore((s) => s.token);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, [token]);

  const recentAlerts = patients.filter((p) => p.alert).slice(0, 5);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Caption>DASHBOARD</Caption>
          <h1 className="mt-2 text-[28px] font-bold text-navy tracking-tight">
            오늘의 코호트 현황
          </h1>
          <p className="mt-1 text-[13px] text-ink-500">
            기관에 등록된 모든 AVF 환자의 운동 모니터링 데이터를 요약합니다.
          </p>
        </div>
        <LinkButton href="/patients/new" size="md" variant="primary">
          <IconPlus size={18} stroke={2.4} /> 대상자 등록
        </LinkButton>
      </div>

      {/* KPI grid */}
      <div className="mt-7 flex flex-wrap gap-4">
        <Kpi
          icon={<IconUsers size={16} />}
          caption="등록 대상자"
          value={data ? String(data.patients.total) : "-"}
        />
        <Kpi
          icon={<IconClockPlay size={16} />}
          caption="오늘 측정 세션"
          value={data ? String(data.sessions.todayCount) : "-"}
          tone="teal"
        />
        <Kpi
          icon={<IconActivity size={16} />}
          caption="누적 세션"
          value={data ? String(data.sessions.total) : "-"}
        />
      </div>

      {/* 최근 측정 현황 */}
      <div className="mt-6">
        <Card padded={false}>
          <div className="px-5 py-4 border-b border-ink-200 flex items-center justify-between">
            <Caption tone="ink">최근 측정 현황</Caption>
          </div>
          {!data ? (
            <div className="py-10 text-center text-[13px] text-ink-500">불러오는 중...</div>
          ) : data.recentSessions.length === 0 ? (
            <div className="py-10 text-center text-[13px] text-ink-500">측정 기록이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[13px] min-w-[540px]">
                <thead>
                  <tr className="border-b border-ink-200 bg-snow/50">
                    {["환자", "날짜", "운동", "완료 / 목표", "피드백"].map((h) => (
                      <th key={h} className="text-left py-3 px-4 first:pl-5 text-[11px] font-semibold tracking-wide uppercase text-ink-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recentSessions.map((s) => (
                    <tr
                      key={s.id}
                      className="border-b border-ink-200/70 last:border-b-0 hover:bg-snow/60 cursor-pointer"
                      onClick={() => router.push(`/patients/${s.pid}/sessions/${s.id}`)}
                    >
                      <td className="py-3.5 px-4 pl-5 font-bold text-navy">{s.patientName}</td>
                      <td className="py-3.5 px-4 fl-num text-ink-700">{formatDate(s.date)}</td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {s.kind === "grip"          ? <IconHandGrab size={15} className="text-navy" /> :
                           s.kind === "dumbbell"       ? <IconBarbell size={15} className="text-navy" /> :
                           s.kind === "wrist_rotation" ? <IconRotateClockwise size={15} className="text-navy" /> :
                                                         <IconActivity size={15} className="text-navy" />}
                          <span className="font-semibold">
                            {s.kind === "grip"          ? "공쥐기" :
                             s.kind === "dumbbell"       ? "덤벨 컬" :
                             s.kind === "wrist_rotation" ? "손목 회전" : "모니터링"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 fl-num">
                        <span className="font-bold text-navy">{s.repsCompleted}</span>
                        <span className="text-ink-500"> / {s.repsTarget}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {s.feedback === "perfect" && <Badge tone="active" label="우수" />}
                        {s.feedback === "minor"   && <Badge tone="ready"  label="양호" />}
                        {s.feedback === "major"   && <Badge tone="watch"  label="교정 필요" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* 추이 차트 + 알림 */}
      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        {/* 30일 세션 추이 */}
        <Card className="!p-6">
          <Caption tone="ink">30일 세션 추이</Caption>
          <div className="mt-1 text-[14px] font-bold text-navy mb-4">날짜별 측정 세션 수</div>
          {data && data.trend.length > 0 ? (
            <EcgLineChart data={data.trend} yLabel="건" color="#1A365D" height={180} />
          ) : (
            <div className="h-[180px] flex items-center justify-center text-[13px] text-ink-500">
              데이터가 없습니다.
            </div>
          )}
        </Card>

        {/* 알림 */}
        <Card className="!p-6">
          <div className="flex items-center justify-between">
            <Caption tone="ink">최근 알림</Caption>
            <Badge tone="watch" label={`${recentAlerts.length}건`} />
          </div>
          <div className="mt-4 space-y-2.5">
            {recentAlerts.length === 0 ? (
              <div className="text-[12px] text-ink-500 py-3">현재 알림이 없습니다.</div>
            ) : (
              recentAlerts.map((p) => (
                <Link
                  key={p.id}
                  href={`/patients/${p.pid}`}
                  className="flex items-center gap-3 p-3 -mx-1 rounded-card hover:bg-snow transition-colors"
                >
                  <IconBellRinging size={16} className="text-red flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-navy">{p.name}</div>
                    <div className="text-[11px] text-ink-500 truncate">{p.alert}</div>
                  </div>
                  <IconArrowRight size={14} className="text-ink-500" />
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Kpi({ icon, caption, value, sub, tone = "navy" }: {
  icon: React.ReactNode;
  caption: string;
  value: string;
  sub?: string;
  tone?: "navy" | "teal" | "red";
}) {
  const color = tone === "teal" ? "text-teal" : tone === "red" ? "text-red" : "text-navy";
  return (
    <Card className="!p-5">
      <div className="flex items-center gap-2 text-ink-500">
        {icon}
        <Caption tone="ink">{caption}</Caption>
      </div>
      <div className={cn("mt-2 text-[30px] font-bold fl-num leading-none", color)}>{value}</div>
      {sub && <div className="mt-2 text-[11px] text-ink-500 font-medium">{sub}</div>}
    </Card>
  );
}
