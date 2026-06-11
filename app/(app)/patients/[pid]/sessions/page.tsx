"use client";
import { useEffect, useState } from "react";
import {
  IconHandGrab,
  IconBarbell,
  IconRotateClockwise,
  IconActivity,
  IconCheck,
  IconAlertTriangle,
  IconClockPlay,
  IconScanEye,
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
import { MultiLineChart } from "@/components/charts/MultiLineChart";
import type { MultiPoint } from "@/components/charts/MultiLineChart";
import { usePatientsStore } from "@/lib/store/patients";
import { useSessionsStore } from "@/lib/store/sessions";
import { formatDate, cn } from "@/lib/utils";
import type { Session } from "@/types/domain";

export default function PatientSessionsPage({
  params,
}: {
  params: { pid: string };
}) {
  const decoded = decodeURIComponent(params.pid);
  const patient = usePatientsStore((s) => s.patients.find((p) => p.pid === decoded));
  const { sessions, total, loading, fetchForPatient, remove } = useSessionsStore();
  const [active, setActive] = useState<Session | null>(null);
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
          <div className="grid grid-cols-3 gap-4">
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
          <table className="w-full text-[13px]">
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
                  onClick={() => setActive(s)}
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
        </Card>
      )}

      {/* 세션 상세 모달 */}
      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        caption="SESSION DETAIL"
        title={active ? `${formatDate(active.date)} 세션` : ""}
        size="lg"
      >
        {active && (
          <div className="space-y-5">
            <div className="grid grid-cols-4 gap-3">
              <DetailStat
                icon={<IconScanEye size={14} />}
                label="자세 정확도"
                value={`${active.postureScore}%`}
                tone={active.postureScore >= 80 ? "teal" : active.postureScore < 65 ? "red" : "navy"}
              />
              <DetailStat
                icon={<IconCheck size={14} />}
                label="완료 / 목표"
                value={`${active.repsCompleted}/${active.repsTarget}`}
              />
              <DetailStat
                icon={<IconClockPlay size={14} />}
                label="소요 시간"
                value={`${Math.floor(active.durationSec / 60)}:${String(active.durationSec % 60).padStart(2, "0")}`}
              />
              <DetailStat
                icon={<IconAlertTriangle size={14} />}
                label="피드백"
                value={active.feedback === "perfect" ? "우수" : active.feedback === "minor" ? "양호" : "교정 필요"}
                tone={active.feedback === "perfect" ? "teal" : active.feedback === "major" ? "red" : "navy"}
              />
            </div>

            {active.landmarks?.length > 0 ? (
              isMultiFrame(active.landmarks) ? (() => {
                const kind = active.kind;
                const rts = active.repTimestamps ?? [];
                const extracted =
                  kind === "dumbbell"      ? extractDumbbell(active.landmarks, rts) :
                  kind === "wrist_rotation"? extractWristRotation(active.landmarks, rts) :
                                             extractGrip(active.landmarks, rts);

                const { data, repMarkers } = extracted;

                const signalSeries =
                  kind === "dumbbell"       ? { key: "팔꿈치각도", label: "팔꿈치 각도(°)", color: "#744210" } :
                  kind === "wrist_rotation" ? { key: "xDiff",    label: "xDiff",          color: "#744210" } :
                                              { key: "상태",      label: "손 상태 (1=쥠, 0=폄)", color: "#319795" };

                const signalDesc =
                  kind === "dumbbell"       ? "팔꿈치 각도 < 80°(UP) → > 145°(DOWN) 시 카운트" :
                  kind === "wrist_rotation" ? "xDiff = pts[5].x − pts[17].x. < −0.08(뒤집힘) → > −0.02(복귀) 시 카운트" :
                                              "1=쥔 상태, 0=편 상태. 1→0 전환 시점(빨간 점선)이 1회 카운트";

                return (
                  <div className="space-y-4">
                    {/* rep 카운트 요약 */}
                    <div className="flex flex-wrap items-center gap-3 p-3 bg-snow rounded-card border border-ink-200 text-[12px]">
                      <span className="text-ink-500">그래프 감지 횟수</span>
                      <span className="font-bold text-navy fl-num">{repMarkers.length}회</span>
                      <span className="text-ink-300">|</span>
                      <span className="text-ink-500">앱 기록 완료 횟수</span>
                      <span className="font-bold text-teal fl-num">{active.repsCompleted}회</span>
                    </div>

                    {/* 운동 신호 + rep 마커 */}
                    <div>
                      <Caption tone="ink">REP COUNT SIGNAL</Caption>
                      <div className="mt-1 text-[13px] font-bold text-navy">카운트 신호 + 감지 시점</div>
                      <p className="text-[11px] text-ink-500 mt-0.5">{signalDesc}</p>
                      <div className="mt-3 bg-snow border border-ink-200 rounded-card p-3">
                        <MultiLineChart
                          data={data}
                          series={[signalSeries]}
                          repMarkers={repMarkers}
                          height={180}
                        />
                      </div>
                    </div>

                    {/* XYZ 좌표 */}
                    <div>
                      <Caption tone="ink">LANDMARK XYZ</Caption>
                      <div className="mt-1 text-[13px] font-bold text-navy">
                        {kind === "dumbbell" ? "손목(16)" : "손목(0)"} XYZ 좌표
                      </div>
                      <p className="text-[11px] text-ink-500 mt-0.5">
                        X(적)·Y(청록)·Z(네이비). 빨간 점선은 감지된 rep 시점입니다.
                      </p>
                      <div className="mt-3 bg-snow border border-ink-200 rounded-card p-3">
                        <MultiLineChart
                          data={data}
                          series={XYZ_SERIES}
                          repMarkers={repMarkers}
                          height={180}
                        />
                      </div>
                    </div>
                  </div>
                );
              })() : (
                /* 스냅샷 포맷 */
                <div>
                  <Caption tone="ink">LANDMARK XYZ SNAPSHOT</Caption>
                  <div className="mt-1 text-[13px] font-bold text-navy">주요 랜드마크 XYZ 좌표</div>
                  <p className="text-[11px] text-ink-500 mt-0.5">
                    손목·각 손가락 끝의 X(적)·Y(청록)·Z(네이비) 좌표입니다.
                  </p>
                  <div className="mt-3 bg-snow border border-ink-200 rounded-card p-3">
                    <MultiLineChart data={extractSnapshotXYZ(active.landmarks)} series={XYZ_SERIES} height={200} />
                  </div>
                  <p className="mt-2 text-[11px] text-ink-400">
                    * 단일 프레임 스냅샷입니다. 시계열 그래프를 위해 앱에서 전체 프레임 데이터를 전송해야 합니다.
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-6 text-[12px] text-ink-400 bg-snow rounded-card border border-ink-200">
                세션 상세 동작 데이터가 없습니다.
              </div>
            )}
          </div>
        )}
      </Modal>

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

// ─── 포맷 판별 ───────────────────────────────────────────────────────────────
function isMultiFrame(landmarks: unknown[]): boolean {
  if (!landmarks.length) return false;
  return Array.isArray((landmarks[0] as [number, unknown[]])[1]);
}

// ─── 공통 유틸 ────────────────────────────────────────────────────────────────
type Pt = number[]; // [x, y, z] or [x, y, z, visibility]

function sample(landmarks: unknown[], max = 120): unknown[][] {
  if (!Array.isArray(landmarks) || landmarks.length === 0) return [];
  const step = Math.max(1, Math.floor(landmarks.length / max));
  return (landmarks as unknown[][]).filter((_, i) => i % step === 0);
}

function tsLabel(t: number) { return `${(t / 1000).toFixed(1)}s`; }
function r2(n: number) { return Math.round(n * 100) / 100; }

/** Android calcAngle 와 동일: 2D(X,Y)만 사용 */
function elbowAngle2D(s: Pt, e: Pt, w: Pt): number {
  const ab = [s[0]-e[0], s[1]-e[1]];
  const cb = [w[0]-e[0], w[1]-e[1]];
  const dot = ab[0]*cb[0] + ab[1]*cb[1];
  const magAb = Math.sqrt(ab[0]**2 + ab[1]**2);
  const magCb = Math.sqrt(cb[0]**2 + cb[1]**2);
  if (magAb === 0 || magCb === 0) return 0;
  return Math.round(Math.acos(Math.max(-1, Math.min(1, dot / (magAb * magCb)))) * (180 / Math.PI));
}

/** repTimestamps(ms) → 샘플링된 frames에서 가장 가까운 인덱스 배열로 변환 */
function tsToMarkers(repTimestamps: number[], frames: unknown[][]): number[] {
  if (!repTimestamps.length || !frames.length) return [];
  const indices = repTimestamps.map((ts) => {
    let best = 0, bestDiff = Infinity;
    frames.forEach((frame, i) => {
      const diff = Math.abs((frame[0] as number) - ts);
      if (diff < bestDiff) { bestDiff = diff; best = i; }
    });
    return best;
  });
  return Array.from(new Set(indices)); // 중복 제거
}

// ─── 운동별 rep 감지 + 차트 데이터 추출 ──────────────────────────────────────

/** 공쥐기:
 *  신규 포맷(frame.length>2): frame[3]=is_closed 직접 사용
 *  구 포맷: TIP.y > PIP.y 가 3개 이상 → isClosed 계산
 *  repTimestamps 있으면 해당 타임스탬프로 마커 생성, 없으면 1→0 전환 감지 */
function extractGrip(landmarks: unknown[], repTimestamps: number[]) {
  const frames = sample(landmarks);
  const data: MultiPoint[] = [];
  const autoMarkers: number[] = [];
  let wasClosed = false;

  frames.forEach((frame, i) => {
    const t = frame[0] as number;
    const pts = frame[1] as Pt[];
    const isNewFormat = (frame as unknown[]).length > 2;

    const isClosed: boolean = isNewFormat
      ? Boolean(frame[3])
      : (() => {
          const fingers = [[8,6],[12,10],[16,14],[20,18]] as [number,number][];
          return fingers.filter(([tip, pip]) => {
            const a = pts[tip], b = pts[pip];
            return a && b && (a[1] > b[1]);
          }).length >= 3;
        })();

    if (wasClosed && !isClosed) autoMarkers.push(i);
    wasClosed = isClosed;

    const w = pts[0];
    data.push({
      label: tsLabel(t),
      상태: isClosed ? 1 : 0,
      X: w ? r2(w[0]) : 0,
      Y: w ? r2(w[1]) : 0,
      Z: w ? r2(w[2]) : 0,
    });
  });

  const repMarkers = repTimestamps.length
    ? tsToMarkers(repTimestamps, frames)
    : autoMarkers;
  return { data, repMarkers };
}

/** 덤벨컬:
 *  신규 포맷(frame.length>2): frame[2]=angle 직접 사용
 *  구 포맷: 2D(X,Y) 각도 계산, visibility<0.3 프레임 스킵
 *  !curlIsUp && angle<80 → UP, curlIsUp && angle>145 → DOWN+count */
function extractDumbbell(landmarks: unknown[], repTimestamps: number[]) {
  const frames = sample(landmarks);
  const data: MultiPoint[] = [];
  const autoMarkers: number[] = [];
  let curlIsUp = false;

  frames.forEach((frame, i) => {
    const t = frame[0] as number;
    const pts = frame[1] as Pt[];
    const isNewFormat = (frame as unknown[]).length > 2;

    let angle = 0;
    if (isNewFormat) {
      angle = (frame[2] as number) ?? 0;
    } else {
      const s = pts[12], e = pts[14], w = pts[16];
      const allVisible = [s, e, w].every((p) => p && ((p as Pt)[3] ?? 1) > 0.3);
      if (s && e && w && allVisible) {
        angle = elbowAngle2D(s, e, w);
      }
    }

    if (angle > 0) {
      if (!curlIsUp && angle < 80) curlIsUp = true;
      else if (curlIsUp && angle > 145) { curlIsUp = false; autoMarkers.push(i); }
    }

    const wrist = pts[16];
    data.push({
      label: tsLabel(t),
      팔꿈치각도: angle,
      X: wrist ? r2(wrist[0]) : 0,
      Y: wrist ? r2(wrist[1]) : 0,
      Z: wrist ? r2(wrist[2]) : 0,
    });
  });

  const repMarkers = repTimestamps.length
    ? tsToMarkers(repTimestamps, frames)
    : autoMarkers;
  return { data, repMarkers };
}

/** 손목회전:
 *  신규 포맷(frame.length>4): frame[4]=xDiff 직접 사용
 *  구 포맷: pts[5].x − pts[17].x 계산
 *  isBack(< −0.08) → isFront(zero-crossing: > −0.02) = 1회
 *  (실제 신호가 0 근처까지만 올라오는 경우를 위해 zero-crossing 방식 사용) */
function extractWristRotation(landmarks: unknown[], repTimestamps: number[]) {
  const frames = sample(landmarks);
  const data: MultiPoint[] = [];
  const autoMarkers: number[] = [];
  let wasBack = false;

  frames.forEach((frame, i) => {
    const t = frame[0] as number;
    const pts = frame[1] as Pt[];
    const isNewFormat = (frame as unknown[]).length > 4;

    const xDiff: number = isNewFormat
      ? (frame[4] as number) ?? 0
      : (pts[5] && pts[17]) ? r2((pts[5] as Pt)[0] - (pts[17] as Pt)[0]) : 0;

    const isBack  = xDiff < -0.08;          // 뒤집힘 확실한 구간
    const isFront = xDiff > -0.02;           // zero-crossing: 복귀 시점
    if (wasBack && isFront) { autoMarkers.push(i); wasBack = false; }
    else if (isBack)        { wasBack = true; }

    const w = pts[0];
    data.push({
      label: tsLabel(t),
      xDiff: r2(xDiff),
      X: w ? r2(w[0]) : 0,
      Y: w ? r2(w[1]) : 0,
      Z: w ? r2(w[2]) : 0,
    });
  });

  const repMarkers = repTimestamps.length
    ? tsToMarkers(repTimestamps, frames)
    : autoMarkers;
  return { data, repMarkers };
}

// ─── 스냅샷 포맷 추출 ─────────────────────────────────────────────────────────
function extractSnapshotXYZ(landmarks: unknown[]): MultiPoint[] {
  const pts = landmarks as Pt[];
  const keys = pts.length >= 21
    ? [
        { idx: 0,  label: "손목" }, { idx: 4,  label: "엄지" },
        { idx: 8,  label: "검지" }, { idx: 12, label: "중지" },
        { idx: 16, label: "약지" }, { idx: 20, label: "소지" },
      ]
    : pts.map((_, i) => ({ idx: i, label: `P${i}` }));
  return keys
    .filter(({ idx }) => pts[idx])
    .map(({ idx, label }) => ({
      label,
      X: r2(pts[idx][0]),
      Y: r2(pts[idx][1]),
      Z: r2(pts[idx][2]),
    }));
}

// ─── 공용 상수 ────────────────────────────────────────────────────────────────
const XYZ_SERIES = [
  { key: "X", label: "X", color: "#E53E3E" },
  { key: "Y", label: "Y", color: "#319795" },
  { key: "Z", label: "Z", color: "#1A365D" },
];


function DetailStat({
  icon, label, value, tone = "navy",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "navy" | "teal" | "red";
}) {
  const color = tone === "teal" ? "text-teal" : tone === "red" ? "text-red" : "text-navy";
  return (
    <div className="bg-snow border border-ink-200 rounded-card p-4">
      <div className="flex items-center gap-1.5 text-ink-500">
        <span>{icon}</span>
        <span className="text-[10px] font-semibold tracking-wide12 uppercase">{label}</span>
      </div>
      <div className={cn("mt-1.5 text-[18px] font-bold fl-num", color)}>{value}</div>
    </div>
  );
}
