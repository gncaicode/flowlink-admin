"use client";
import { IconActivity, IconClockPlay } from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Caption } from "@/components/ui/Caption";
import { usePatientsStore } from "@/lib/store/patients";
import { sessionsForPatient } from "@/lib/mock/sessions";

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

  return (
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
