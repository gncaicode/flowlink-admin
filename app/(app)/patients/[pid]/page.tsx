"use client";
import {
  IconActivity,
  IconChartBar,
  IconClockPlay,
  IconScanEye,
  IconBellRinging,
  IconBarbell,
  IconHandGrab,
  IconSparkles,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Caption } from "@/components/ui/Caption";
import { MaturityRing } from "@/components/charts/MaturityRing";
import { EcgLineChart } from "@/components/charts/EcgLineChart";
import { usePatientsStore } from "@/lib/store/patients";
import { sessionsForPatient } from "@/lib/mock/sessions";
import { PRESCRIPTIONS, EXERCISE_TEMPLATES } from "@/lib/mock/programs";
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
  const avgPosture = total
    ? Math.round(sessions.reduce((a, s) => a + s.postureScore, 0) / total)
    : 0;
  const totalReps = sessions.reduce((a, s) => a + s.repsCompleted, 0);
  const lastDate = sessions[0]?.date;

  const weekly = sessions
    .slice(0, 7)
    .reverse()
    .map((s, i) => ({
      label: ["일", "월", "화", "수", "목", "금", "토"][i % 7] ?? `D${i}`,
      value: s.postureScore,
    }));

  const prescriptions = PRESCRIPTIONS.filter(
    (pr) => pr.patientId === patient.id,
  );

  return (
    <div className="grid lg:grid-cols-[1fr,360px] gap-6">
      <div className="flex flex-col gap-6 min-w-0">
        {/* Maturity + KPIs */}
        <Card className="!p-6">
          <div className="flex gap-8 items-center flex-wrap">
            <MaturityRing value={patient.maturity} />
            <div className="flex-1 min-w-[260px]">
              <Caption>VASCULAR MATURATION</Caption>
              <div className="mt-1 text-[20px] font-bold text-navy">
                혈관 성숙 진행률
              </div>
              <p className="mt-2 text-[12px] text-ink-500 leading-relaxed">
                기저 혈관 직경{" "}
                <b className="text-navy fl-num">
                  {patient.baselineDiameterMm}mm
                </b>{" "}
                / 기저 혈류량{" "}
                <b className="text-navy fl-num">
                  {patient.baselineFlowMlMin} mL/min
                </b>{" "}
                기준 AI 추정치입니다.
                <br />
                목표 직경 도달까지 약{" "}
                <b className="text-navy">
                  {Math.max(0, Math.round((100 - patient.maturity) / 6))}주
                </b>{" "}
                예상.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-navy-faint text-navy">
                  AVF · {patient.anastomosis}
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded bg-snow border border-ink-200 text-ink-700">
                  이전 이력 {patient.previousAvfHistory}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={<IconClockPlay size={16} />}
            caption="총 측정 세션"
            value={String(total)}
            sub="14일 기준"
          />
          <StatCard
            icon={<IconScanEye size={16} />}
            caption="평균 자세 정확도"
            value={`${avgPosture}%`}
            sub={avgPosture >= 80 ? "양호" : avgPosture >= 65 ? "보통" : "교정 필요"}
            tone={avgPosture >= 80 ? "teal" : avgPosture < 65 ? "red" : "navy"}
          />
          <StatCard
            icon={<IconActivity size={16} />}
            caption="누적 반복 횟수"
            value={String(totalReps)}
            sub="회"
          />
          <StatCard
            icon={<IconChartBar size={16} />}
            caption="순응도"
            value={`${patient.adherence}%`}
            sub={lastDate ? `최근 ${formatDate(lastDate)}` : "미시작"}
            tone={
              patient.adherence >= 80
                ? "teal"
                : patient.adherence < 60
                  ? "red"
                  : "navy"
            }
          />
        </div>

        {/* Weekly chart */}
        <Card className="!p-6">
          <div className="flex items-center justify-between">
            <div>
              <Caption>WEEKLY POSTURE ACCURACY</Caption>
              <div className="mt-1 text-[18px] font-bold text-navy">
                주간 자세 정확도 추이
              </div>
            </div>
            <div className="text-[11px] text-ink-500">최근 7일</div>
          </div>
          <div className="mt-4">
            <EcgLineChart data={weekly} yLabel="ACCURACY %" />
          </div>
        </Card>
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-4">
        <Card className="!p-5">
          <div className="flex items-center justify-between">
            <Caption tone="ink">현재 처방</Caption>
          </div>
          <div className="mt-3 space-y-3">
            {prescriptions.length === 0 && (
              <div className="text-[12px] text-ink-500 py-3">
                아직 처방된 운동이 없습니다.
              </div>
            )}
            {prescriptions.map((pr) => {
              const t = EXERCISE_TEMPLATES.find((e) => e.kind === pr.kind);
              const icon =
                pr.kind === "grip" ? (
                  <IconHandGrab size={18} />
                ) : (
                  <IconBarbell size={18} />
                );
              return (
                <div
                  key={pr.kind}
                  className="flex items-center gap-3 p-3 bg-snow border border-ink-200 rounded-card"
                >
                  <div className="w-9 h-9 rounded-[10px] bg-navy text-white flex items-center justify-center">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-bold text-navy">
                      {t?.label}
                    </div>
                    <div className="text-[11px] text-ink-500 fl-num">
                      {pr.reps}회 × {pr.sets}세트 · {pr.frequencyPerDay}회/일
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-teal uppercase tracking-wider">
                    {pr.durationWeeks}w
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="!p-5 border-teal/30 bg-teal-light/40">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-teal text-white flex items-center justify-center">
              <IconSparkles size={14} stroke={2.2} />
            </div>
            <Caption tone="teal">AI COACH</Caption>
          </div>
          <p className="mt-3 text-[12px] text-ink-700 leading-relaxed">
            최근 7일간 자세 정확도가 {avgPosture}%로,{" "}
            {avgPosture >= 80
              ? "기준치를 상회하며 안정적입니다."
              : avgPosture >= 65
                ? "주의가 필요합니다. 손목 각도 모니터링을 권장합니다."
                : "교정 안내가 필요합니다. 외래 방문 시 자세 코칭 진행을 권장합니다."}
          </p>
        </Card>

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
