"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconHandGrab,
  IconBarbell,
  IconRotateClockwise,
  IconActivity,
  IconTrash,
  IconChartLine,
  IconList,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Caption } from "@/components/ui/Caption";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { EcgLineChart } from "@/components/charts/EcgLineChart";
import { usePatientsStore } from "@/lib/store/patients";
import { useSessionsStore } from "@/lib/store/sessions";
import { formatDate, cn } from "@/lib/utils";
import type { Session } from "@/types/domain";

export default function PatientSessionsPage({
  params,
}: {
  params: { pid: string };
}) {
  const router = useRouter();
  const decoded = decodeURIComponent(params.pid);
  const patient = usePatientsStore((s) => s.patients.find((p) => p.pid === decoded));
  const { sessions, total, loading, fetchForPatient, remove } = useSessionsStore();
  const [confirmDelete, setConfirmDelete] = useState<Session | null>(null);
  const [view, setView] = useState<"list" | "chart">("list");

  useEffect(() => {
    if (patient?.id) fetchForPatient(patient.id);
  }, [patient?.id, fetchForPatient]);

  if (!patient) return null;

  // 차트용 데이터: 날짜 오름차순 (최대 30개)
  const chartSessions = [...sessions].reverse().slice(-30);
  const scoreData = chartSessions.map((s) => ({
    label: formatDate(s.date).slice(5),
    value: s.postureScore,
  }));
  const completionData = chartSessions.map((s) => ({
    label: formatDate(s.date).slice(5),
    value: s.repsTarget > 0 ? Math.round((s.repsCompleted / s.repsTarget) * 100) : 0,
  }));
  const durationData = chartSessions.map((s) => ({
    label: formatDate(s.date).slice(5),
    value: Math.round((s.durationSec / 60) * 10) / 10,
  }));

  const avgScore =
    sessions.length > 0
      ? Math.round(sessions.reduce((a, s) => a + s.postureScore, 0) / sessions.length)
      : 0;
  const avgCompletion =
    sessions.length > 0
      ? Math.round(
          (sessions.reduce((a, s) => a + (s.repsTarget > 0 ? s.repsCompleted / s.repsTarget : 0), 0) /
            sessions.length) *
            100,
        )
      : 0;
  const totalMinutes = Math.round(sessions.reduce((a, s) => a + s.durationSec, 0) / 60);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <Caption>MEASUREMENT SESSIONS</Caption>
          <h2 className="mt-1 text-[20px] font-bold text-navy">측정 세션 기록</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-ink-500">
            총 <b className="text-navy fl-num">{total}</b>건
          </span>
          {sessions.length > 0 && (
            <div className="flex rounded-lg border border-ink-200 overflow-hidden">
              <button
                onClick={() => setView("list")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  view === "list"
                    ? "bg-navy text-white"
                    : "bg-white text-ink-500 hover:bg-snow",
                )}
              >
                <IconList size={13} /> 목록
              </button>
              <button
                onClick={() => setView("chart")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  view === "chart"
                    ? "bg-navy text-white"
                    : "bg-white text-ink-500 hover:bg-snow",
                )}
              >
                <IconChartLine size={13} /> 그래프
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <Card className="!p-10 text-center text-[13px] text-ink-500">불러오는 중...</Card>
      ) : sessions.length === 0 ? (
        <Card className="!p-10 text-center text-[13px] text-ink-500">
          아직 기록된 측정 세션이 없습니다.
        </Card>
      ) : view === "chart" ? (
        /* ─── 그래프 뷰 ─── */
        <div className="flex flex-col gap-5">
          {/* 요약 stat */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryStat label="평균 자세 정확도" value={`${avgScore}%`}
              tone={avgScore >= 80 ? "teal" : avgScore < 65 ? "red" : "navy"} />
            <SummaryStat label="평균 완료율" value={`${avgCompletion}%`}
              tone={avgCompletion >= 80 ? "teal" : avgCompletion < 60 ? "red" : "navy"} />
            <SummaryStat label="총 운동 시간" value={`${totalMinutes}분`} tone="navy" />
          </div>

          {/* 자세 정확도 추이 */}
          <Card className="!p-5">
            <Caption tone="ink">POSTURE SCORE TREND</Caption>
            <div className="mt-1 text-[14px] font-bold text-navy mb-4">자세 정확도 추이</div>
            <EcgLineChart data={scoreData} yLabel="SCORE %" color="#319795" height={200} />
          </Card>

          {/* 완료율 + 소요시간 */}
          <div className="grid lg:grid-cols-2 gap-5">
            <Card className="!p-5">
              <Caption tone="ink">COMPLETION RATE</Caption>
              <div className="mt-1 text-[14px] font-bold text-navy mb-4">운동 완료율</div>
              <EcgLineChart data={completionData} yLabel="RATE %" color="#1A365D" height={180} />
            </Card>
            <Card className="!p-5">
              <Caption tone="ink">SESSION DURATION</Caption>
              <div className="mt-1 text-[14px] font-bold text-navy mb-4">소요 시간</div>
              <EcgLineChart data={durationData} yLabel="MIN" color="#744210" height={180} />
            </Card>
          </div>
        </div>
      ) : (
        /* ─── 목록 뷰 ─── */
        <Card padded={false}>
          <div className="overflow-x-auto">
          <table className="w-full text-[13px] min-w-[620px]">
            <thead>
              <tr className="border-b border-ink-200 bg-snow/50">
                <Th>일자</Th>
                <Th>운동</Th>
                <Th>완료 / 목표</Th>
                <Th>자세 정확도</Th>
                <Th>소요 시간</Th>
                <Th>피드백</Th>
                <th className="w-[5%]" />
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-ink-200/70 last:border-b-0 hover:bg-snow/60 group cursor-pointer"
                  onClick={() => router.push(`/patients/${decoded}/sessions/${s.id}`)}
                >
                  <td className="py-3.5 px-4 pl-5 fl-num text-navy font-semibold">
                    {formatDate(s.date)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {s.kind === "grip"           ? <IconHandGrab size={16} className="text-navy" /> :
                       s.kind === "dumbbell"        ? <IconBarbell size={16} className="text-navy" /> :
                       s.kind === "wrist_rotation"  ? <IconRotateClockwise size={16} className="text-navy" /> :
                                                      <IconActivity size={16} className="text-navy" />}
                      <span className="font-semibold">
                        {s.kind === "grip"          ? "공쥐기"   :
                         s.kind === "dumbbell"       ? "덤벨 컬" :
                         s.kind === "wrist_rotation" ? "손목 회전" :
                                                       "모니터링"}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 fl-num">
                    <span className="font-bold text-navy">{s.repsCompleted}</span>
                    <span className="text-ink-500"> / {s.repsTarget}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            s.postureScore >= 80 ? "bg-teal" : s.postureScore < 65 ? "bg-red" : "bg-navy",
                          )}
                          style={{ width: `${s.postureScore}%` }}
                        />
                      </div>
                      <span className={cn(
                        "fl-num font-bold text-[13px]",
                        s.postureScore >= 80 ? "text-teal" : s.postureScore < 65 ? "text-red" : "text-navy",
                      )}>
                        {s.postureScore}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 fl-num text-ink-700">
                    {Math.floor(s.durationSec / 60)}분 {s.durationSec % 60}초
                  </td>
                  <td className="py-3.5 px-4">
                    {s.feedback === "perfect" && <Badge tone="active" label="우수" />}
                    {s.feedback === "minor" && <Badge tone="ready" label="양호" />}
                    {s.feedback === "major" && <Badge tone="watch" label="교정 필요" />}
                  </td>
                  <td
                    className="py-3.5 px-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setConfirmDelete(s)}
                      className="w-7 h-7 rounded-full hover:bg-red-light flex items-center justify-center text-ink-500 hover:text-red opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IconTrash size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>
      )}

      {/* 삭제 확인 모달 */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        caption="DELETE SESSION"
        title="세션을 삭제하시겠어요?"
        footer={
          <>
            <Button variant="secondary" size="md" onClick={() => setConfirmDelete(null)}>
              취소
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={async () => {
                if (confirmDelete) await remove(confirmDelete.id);
                setConfirmDelete(null);
              }}
            >
              삭제
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-ink-700 leading-relaxed">
          <b className="text-navy fl-num">{confirmDelete && formatDate(confirmDelete.date)}</b> 세션을
          삭제하면 복구할 수 없습니다.
        </p>
      </Modal>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left py-3 px-4 first:pl-5 text-[11px] font-semibold tracking-wide12 uppercase text-ink-500">
      {children}
    </th>
  );
}

function SummaryStat({
  label, value, tone = "navy",
}: {
  label: string;
  value: string;
  tone?: "navy" | "teal" | "red";
}) {
  const color = tone === "teal" ? "text-teal" : tone === "red" ? "text-red" : "text-navy";
  return (
    <Card className="!p-4">
      <div className="text-[10px] font-semibold tracking-wide12 uppercase text-ink-500">{label}</div>
      <div className={cn("mt-1.5 text-[22px] font-bold fl-num", color)}>{value}</div>
    </Card>
  );
}

