"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconChevronLeft,
  IconHandGrab,
  IconBarbell,
  IconRotateClockwise,
  IconActivity,
  IconCheck,
  IconAlertTriangle,
  IconClockPlay,
  IconTrash,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Caption } from "@/components/ui/Caption";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { MultiLineChart } from "@/components/charts/MultiLineChart";
import type { MultiPoint } from "@/components/charts/MultiLineChart";
import { useSessionStore } from "@/lib/store/session";
import { useSessionsStore } from "@/lib/store/sessions";
import { formatDate, cn } from "@/lib/utils";
import type { Session } from "@/types/domain";

export default function SessionDetailPage({
  params,
}: {
  params: { pid: string; sid: string };
}) {
  const router = useRouter();
  const token = useSessionStore((s) => s.token);
  const { remove } = useSessionsStore();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const pid = decodeURIComponent(params.pid);

  useEffect(() => {
    fetch(`/api/sessions/${params.sid}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setSession)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.sid, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[13px] text-ink-500">
        불러오는 중...
      </div>
    );
  }
  if (!session) {
    return (
      <div className="flex items-center justify-center py-20 text-[13px] text-ink-500">
        세션을 찾을 수 없습니다.
      </div>
    );
  }

  const kindLabel =
    session.kind === "grip"          ? "공쥐기"   :
    session.kind === "dumbbell"      ? "덤벨 컬"  :
    session.kind === "wrist_rotation"? "손목 회전" : "모니터링";

  const kindIcon =
    session.kind === "grip"          ? <IconHandGrab size={16} className="text-navy" /> :
    session.kind === "dumbbell"      ? <IconBarbell size={16} className="text-navy" /> :
    session.kind === "wrist_rotation"? <IconRotateClockwise size={16} className="text-navy" /> :
                                       <IconActivity size={16} className="text-navy" />;

  return (
    <div>
      {/* 헤더 */}
      <button
        onClick={() => router.push(`/patients/${pid}/sessions`)}
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-500 hover:text-navy mb-4"
      >
        <IconChevronLeft size={14} /> 세션 목록으로
      </button>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Caption>SESSION DETAIL</Caption>
          <h2 className="mt-1 text-[20px] font-bold text-navy flex items-center gap-2">
            {kindIcon} {formatDate(session.date)} · {kindLabel}
          </h2>
        </div>
        <button
          onClick={() => setConfirmDelete(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold text-red border border-red/30 rounded-btn hover:bg-red-light transition-colors"
        >
          <IconTrash size={14} /> 세션 삭제
        </button>
      </div>

      <div className="space-y-5">
        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <DetailStat
            icon={<IconCheck size={14} />}
            label="완료 / 목표"
            value={`${session.repsCompleted} / ${session.repsTarget}`}
          />
          <DetailStat
            icon={<IconClockPlay size={14} />}
            label="소요 시간"
            value={`${Math.floor(session.durationSec / 60)}:${String(session.durationSec % 60).padStart(2, "0")}`}
          />
          <DetailStat
            icon={<IconAlertTriangle size={14} />}
            label="피드백"
            value={session.feedback === "perfect" ? "우수" : session.feedback === "minor" ? "양호" : "교정 필요"}
            tone={session.feedback === "perfect" ? "teal" : session.feedback === "major" ? "red" : "navy"}
          />
        </div>

        {/* 그래프 */}
        {session.landmarks?.length > 0 ? (
          isMultiFrame(session.landmarks) ? (() => {
            const kind = session.kind;
            const rts = session.repTimestamps ?? [];
            const extracted =
              kind === "dumbbell"      ? extractDumbbell(session.landmarks, rts) :
              kind === "wrist_rotation"? extractWristRotation(session.landmarks, rts) :
                                         extractGrip(session.landmarks, rts);

            const { data, repMarkers } = extracted;

            const signalSeries =
              kind === "dumbbell"       ? { key: "팔꿈치각도", label: "팔꿈치 각도(°)", color: "#744210" } :
              kind === "wrist_rotation" ? { key: "xDiff",    label: "xDiff",          color: "#744210" } :
                                          { key: "비율",      label: "distB/distA",    color: "#319795" };

            const signalDesc =
              kind === "dumbbell"       ? "팔꿈치 각도 < 80°(UP) → > 145°(DOWN) 시 카운트" :
              kind === "wrist_rotation" ? "xDiff = pts[5].x − pts[17].x. < −0.08(뒤집힘) → > −0.02(복귀) 시 카운트" :
                                          "distB/distA = dist(손목,TIP) / dist(손목,MCP). 비율 > 1.0(폄) → < 1.0(쥠) 전환 시점(빨간 점선)이 1회 카운트";

            return (
              <div className="space-y-5">
                {/* rep 카운트 요약 */}
                <div className="flex flex-wrap items-center gap-3 p-3 bg-snow rounded-card border border-ink-200 text-[12px]">
                  <span className="text-ink-500">그래프 감지 횟수</span>
                  <span className="font-bold text-navy fl-num">{repMarkers.length}회</span>
                  <span className="text-ink-300">|</span>
                  <span className="text-ink-500">앱 기록 완료 횟수</span>
                  <span className="font-bold text-teal fl-num">{session.repsCompleted}회</span>
                </div>

                {/* 카운트 신호 */}
                <Card className="!p-5">
                  <Caption tone="ink">REP COUNT SIGNAL</Caption>
                  <div className="mt-1 text-[14px] font-bold text-navy">카운트 신호 + 감지 시점</div>
                  <p className="text-[11px] text-ink-500 mt-0.5">{signalDesc}</p>
                  <div className="mt-4 bg-snow border border-ink-200 rounded-card p-3">
                    <MultiLineChart
                      data={data}
                      series={[signalSeries]}
                      repMarkers={repMarkers}
                      height={200}
                    />
                  </div>
                </Card>

              </div>
            );
          })() : (
            <Card className="!p-10 text-center text-[12px] text-ink-400">
              세션 상세 동작 데이터가 없습니다.
            </Card>
          )
        ) : (
          <Card className="!p-10 text-center text-[12px] text-ink-400">
            세션 상세 동작 데이터가 없습니다.
          </Card>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        caption="DELETE SESSION"
        title="세션을 삭제하시겠어요?"
        footer={
          <>
            <Button variant="secondary" size="md" onClick={() => setConfirmDelete(false)}>
              취소
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={async () => {
                await remove(session.id);
                router.push(`/patients/${pid}/sessions`);
              }}
            >
              삭제
            </Button>
          </>
        }
      >
        <p className="text-[13px] text-ink-700 leading-relaxed">
          <b className="text-navy fl-num">{formatDate(session.date)}</b> 세션을
          삭제하면 복구할 수 없습니다.
        </p>
      </Modal>
    </div>
  );
}

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
      <div className={cn("mt-1.5 text-[20px] font-bold fl-num", color)}>{value}</div>
    </div>
  );
}

// ─── 포맷 판별 ────────────────────────────────────────────────────────────────
function isMultiFrame(landmarks: unknown[]): boolean {
  if (!landmarks.length) return false;
  return Array.isArray((landmarks[0] as [number, unknown[]])[1]);
}

// ─── 공통 유틸 ────────────────────────────────────────────────────────────────
type Pt = number[];

function sample(landmarks: unknown[], max = 120): unknown[][] {
  if (!Array.isArray(landmarks) || landmarks.length === 0) return [];
  const step = Math.max(1, Math.floor(landmarks.length / max));
  return (landmarks as unknown[][]).filter((_, i) => i % step === 0);
}

function tsLabel(t: number) { return `${(t / 1000).toFixed(1)}s`; }
function r2(n: number) { return Math.round(n * 100) / 100; }

function elbowAngle2D(s: Pt, e: Pt, w: Pt): number {
  const ab = [s[0]-e[0], s[1]-e[1]];
  const cb = [w[0]-e[0], w[1]-e[1]];
  const dot = ab[0]*cb[0] + ab[1]*cb[1];
  const magAb = Math.sqrt(ab[0]**2 + ab[1]**2);
  const magCb = Math.sqrt(cb[0]**2 + cb[1]**2);
  if (magAb === 0 || magCb === 0) return 0;
  return Math.round(Math.acos(Math.max(-1, Math.min(1, dot / (magAb * magCb)))) * (180 / Math.PI));
}

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
  return Array.from(new Set(indices));
}

function dist3(a: Pt, b: Pt): number {
  return Math.sqrt((a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2);
}

function extractGrip(landmarks: unknown[], repTimestamps: number[]) {
  const MCP_IDX = [5, 9, 13, 17];
  const TIP_IDX = [8, 12, 16, 20];

  const frames = sample(landmarks);
  const data: MultiPoint[] = [];

  frames.forEach((frame) => {
    const t = frame[0] as number;
    const pts = frame[1] as Pt[];
    const wrist = pts[0];

    const ratios = MCP_IDX.map((m, fi) => {
      const mcp = pts[m], tip = pts[TIP_IDX[fi]];
      if (!wrist || !mcp || !tip) return null;
      const distA = dist3(wrist, mcp);
      const distB = dist3(wrist, tip);
      return distA > 0 ? distB / distA : null;
    }).filter((v): v is number => v !== null);

    const ratio = ratios.length > 0
      ? r2(ratios.reduce((a, b) => a + b, 0) / ratios.length)
      : 1;

    data.push({ label: tsLabel(t), 비율: ratio });
  });

  return { data, repMarkers: repTimestamps.length ? tsToMarkers(repTimestamps, frames) : [] };
}

function extractDumbbell(landmarks: unknown[], repTimestamps: number[]) {
  const frames = sample(landmarks);
  const data: MultiPoint[] = [];
  frames.forEach((frame) => {
    const t = frame[0] as number;
    const pts = frame[1] as Pt[];
    const isNewFormat = (frame as unknown[]).length > 2;
    let angle = 0;
    if (isNewFormat) {
      angle = (frame[2] as number) ?? 0;
    } else {
      const s = pts[12], e = pts[14], w = pts[16];
      const allVisible = [s, e, w].every((p) => p && ((p as Pt)[3] ?? 1) > 0.3);
      if (s && e && w && allVisible) angle = elbowAngle2D(s, e, w);
    }
    data.push({ label: tsLabel(t), 팔꿈치각도: angle });
  });
  return { data, repMarkers: repTimestamps.length ? tsToMarkers(repTimestamps, frames) : [] };
}

function extractWristRotation(landmarks: unknown[], repTimestamps: number[]) {
  const frames = sample(landmarks);
  const data: MultiPoint[] = [];
  frames.forEach((frame) => {
    const t = frame[0] as number;
    const pts = frame[1] as Pt[];
    const isNewFormat = (frame as unknown[]).length > 4;
    const xDiff: number = isNewFormat
      ? (frame[4] as number) ?? 0
      : (pts[5] && pts[17]) ? r2((pts[5] as Pt)[0] - (pts[17] as Pt)[0]) : 0;
    data.push({ label: tsLabel(t), xDiff: r2(xDiff) });
  });
  return { data, repMarkers: repTimestamps.length ? tsToMarkers(repTimestamps, frames) : [] };
}

