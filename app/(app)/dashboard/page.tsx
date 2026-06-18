"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IconUsers,
  IconArrowRight,
  IconBellRinging,
  IconPlus,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Caption } from "@/components/ui/Caption";
import { LinkButton } from "@/components/ui/Button";
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
      <div className="mt-7 flex gap-4">
        <Kpi
          icon={<IconUsers size={16} />}
          caption="등록 대상자"
          value={stats ? String(stats.total) : "-"}
        />
      </div>

      <div className="mt-6">
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
