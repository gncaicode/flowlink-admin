"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconUsers,
  IconChartBar,
  IconArrowRight,
  IconBellRinging,
  IconPlus,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Caption } from "@/components/ui/Caption";
import { LinkButton } from "@/components/ui/Button";
import { EcgLineChart } from "@/components/charts/EcgLineChart";
import { Badge } from "@/components/ui/Badge";
import { usePatientsStore } from "@/lib/store/patients";
import { useSessionStore } from "@/lib/store/session";
import { cn } from "@/lib/utils";

type DashboardData = {
  patients: {
    total: number;
    avgAdherence: number;
  };
  sessions: {
    total: number;
    avgPostureScore: number;
    todayCount: number;
  };
  trend: { label: string; value: number }[];
};

export default function DashboardPage() {
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

  const stats = data?.patients;
  const sessionStats = data?.sessions;
  const trend = data?.trend ?? [];

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
      <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi
          icon={<IconUsers size={16} />}
          caption="등록 대상자"
          value={stats ? String(stats.total) : "-"}
        />
        <Kpi
          icon={<IconChartBar size={16} />}
          caption="평균 순응도"
          value={stats ? `${stats.avgAdherence}%` : "-"}
          sub="최근 14일 기준"
          tone={stats && stats.avgAdherence >= 75 ? "teal" : "navy"}
        />
      </div>

      <div className="mt-6 grid lg:grid-cols-[1.6fr,1fr] gap-6">
        {/* Trend chart */}
        <Card className="!p-6">
          <div className="flex items-center justify-between">
            <div>
              <Caption>POSTURE ACCURACY TREND</Caption>
              <div className="mt-1 text-[18px] font-bold text-navy">
                코호트 평균 자세 정확도
              </div>
            </div>
            <div className="text-[11px] text-ink-500">최근 30일</div>
          </div>
          <div className="mt-3">
            {trend.length > 0 ? (
              <EcgLineChart data={trend} yLabel="ACCURACY %" />
            ) : (
              <div className="h-[160px] flex items-center justify-center text-[12px] text-ink-500">
                세션 데이터가 없습니다.
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-4 text-[11px] text-ink-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal" /> 평균 정확도
            </span>
            <span>총 {sessionStats?.total ?? 0}개 세션 집계</span>
          </div>
        </Card>

        {/* Alerts */}
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
