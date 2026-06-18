"use client";
import {
  IconActivity,
  IconClockPlay,
  IconBellRinging,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Caption } from "@/components/ui/Caption";
import { usePatientsStore } from "@/lib/store/patients";
import { sessionsForPatient } from "@/lib/mock/sessions";
import { formatDate } from "@/lib/utils";

export default function PatientOverviewPage({
  params,
}: {
  params: { pid: string };
}) {
  const decoded = decodeURIComponent(params.pid);
  const patient = usePatientsStore((s) =>
    s.patients.find((p) => p.pid === decoded),
  );
  if (!patient) return null;
  const sessions = sessionsForPatient(patient.id);
  const total = sessions.length;
  const totalReps = sessions.reduce((a, s) => a + s.repsCompleted, 0);
  const lastDate = sessions[0]?.date;

  return (
    <div className="flex flex-col gap-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<IconClockPlay size={16} />}
          caption="총 측정 세션"
          value={String(total)}
          sub="14일 기준"
        />
        <StatCard
          icon={<IconActivity size={16} />}
          caption="누적 반복 횟수"
          value={String(totalReps)}
          sub="회"
        />
      </div>

      {patient.alert && (
        <Card className="!p-5 border-red/30 bg-red-light/50">
          <div className="flex items-center gap-2">
            <IconBellRinging size={16} className="text-red" />
            <Caption className="!text-red">URGENT ALERT</Caption>
          </div>
          <p className="mt-3 text-[12px] text-ink-700 font-semibold">
            {patient.alert}
          </p>
          <p className="mt-1 text-[11px] text-ink-500">
            마지막 활동:{" "}
            {lastDate ? formatDate(lastDate) : "기록 없음"}
          </p>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  icon,
  caption,
  value,
  sub,
  tone = "navy",
}: {
  icon: React.ReactNode;
  caption: string;
  value: string;
  sub?: string;
  tone?: "navy" | "teal" | "red";
}) {
  const color =
    tone === "teal" ? "text-teal" : tone === "red" ? "text-red" : "text-navy";
  return (
    <Card className="!p-5">
      <div className="flex items-center gap-2 text-ink-500">
        {icon}
        <Caption tone="ink">{caption}</Caption>
      </div>
      <div className={`mt-2 text-[28px] font-bold fl-num ${color} leading-none`}>
        {value}
      </div>
      {sub && (
        <div className="mt-2 text-[11px] text-ink-500 font-medium">{sub}</div>
      )}
    </Card>
  );
}
