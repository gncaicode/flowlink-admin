import type { Session, ExerciseKind, SessionFeedback } from "@/types/domain";
import { PATIENTS } from "./patients";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function feedbackFrom(score: number): SessionFeedback {
  if (score >= 88) return "perfect";
  if (score >= 70) return "minor";
  return "major";
}

const KINDS: ExerciseKind[] = ["grip", "dumbbell"];

export const SESSIONS: Session[] = PATIENTS.flatMap((p, i) => {
  const rand = seededRandom(101 + i * 7);
  const today = new Date("2026-05-20T00:00:00Z").getTime();
  const out: Session[] = [];
  const days = 14;
  for (let d = days - 1; d >= 0; d--) {
    const skip = rand() < (1 - p.adherence / 100) * 0.6;
    if (skip) continue;
    const date = new Date(today - d * 86400 * 1000).toISOString().slice(0, 10);
    const kind = KINDS[Math.floor(rand() * KINDS.length)] ?? "grip";
    const target = kind === "grip" ? 20 : 12;
    const completion = 0.6 + rand() * 0.45;
    const reps = Math.min(target + 5, Math.round(target * completion));
    const baseScore = p.status === "watch" ? 60 : p.status === "ready" ? 90 : 78;
    const postureScore = Math.max(
      50,
      Math.min(98, Math.round(baseScore + (rand() - 0.5) * 22)),
    );
    out.push({
      id: p.id * 1000 + (days - d),
      patientId: p.id,
      date,
      kind,
      repsCompleted: reps,
      repsTarget: target,
      postureScore,
      durationSec: 60 + Math.round(rand() * 240),
      feedback: feedbackFrom(postureScore),
      landmarks: [],
    });
  }
  return out;
});

export function sessionsForPatient(patientId: number) {
  return SESSIONS.filter((s) => s.patientId === patientId).sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );
}

export function weeklyMaturityTrend(patientId: number) {
  const sessions = sessionsForPatient(patientId).slice().reverse();
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const last7 = sessions.slice(-7);
  return last7.map((s, i) => ({
    label: days[i % 7] ?? `D${i}`,
    value: s.postureScore,
  }));
}
