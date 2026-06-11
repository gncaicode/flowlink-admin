import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { Session } from "@/types/domain";

function parseJsonField(raw: unknown): unknown[] {
  try {
    let v = raw;
    if (typeof v === "string") v = JSON.parse(v);
    if (typeof v === "string") v = JSON.parse(v); // 이중 인코딩 대응
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function rowToSession(row: Record<string, unknown>): Session {
  return {
    id: row.id as number,
    patientId: row.patient_id as number,
    date: (row.date as Date).toISOString().slice(0, 10),
    kind: row.kind as Session["kind"],
    repsCompleted: row.reps_completed as number,
    repsTarget: row.reps_target as number,
    postureScore: row.posture_score as number,
    durationSec: row.duration_sec as number,
    feedback: row.feedback as Session["feedback"],
    landmarks: parseJsonField(row.landmarks),
    totalSets: row.total_sets != null ? (row.total_sets as number) : undefined,
    setSeconds: row.set_seconds != null ? (row.set_seconds as number) : undefined,
    repTimestamps: row.rep_timestamps != null
      ? (parseJsonField(row.rep_timestamps) as number[])
      : undefined,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const patientIdParam = searchParams.get("patientId");
  const page  = Math.max(1, parseInt(searchParams.get("page")  ?? "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") ?? "50")));
  const offset = (page - 1) * limit;

  let rows: unknown;
  let countRows: unknown;

  if (patientIdParam) {
    const patientId = parseInt(patientIdParam);
    [rows] = await pool.query(
      "SELECT * FROM sessions WHERE patient_id = ? ORDER BY date DESC, id DESC LIMIT ? OFFSET ?",
      [patientId, limit, offset]
    );
    [countRows] = await pool.query(
      "SELECT COUNT(*) as total FROM sessions WHERE patient_id = ?",
      [patientId]
    );
  } else {
    [rows] = await pool.query(
      "SELECT * FROM sessions ORDER BY date DESC, id DESC LIMIT ? OFFSET ?",
      [limit, offset]
    );
    [countRows] = await pool.query("SELECT COUNT(*) as total FROM sessions");
  }

  const sessions = (rows as Record<string, unknown>[]).map(rowToSession);
  const total = (countRows as Record<string, unknown>[])[0].total as number;

  return NextResponse.json({
    data: sessions,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(req: Request) {
  const body = await req.json() as Record<string, unknown>;

  const patientId = typeof body.patientId === "string"
    ? parseInt(body.patientId, 10)
    : (body.patientId as number);

  // landmarks: JSON 문자열이면 그대로, 배열이면 직렬화
  const landmarksJson =
    typeof body.landmarks === "string"
      ? body.landmarks
      : JSON.stringify(body.landmarks ?? []);

  // repTimestamps: JSON 문자열이면 그대로, 배열이면 직렬화
  const repTimestampsJson =
    body.repTimestamps == null ? null
    : typeof body.repTimestamps === "string"
      ? body.repTimestamps
      : JSON.stringify(body.repTimestamps);

  // id 필드를 external_id 로 사용 (앱이 보내는 고유 키, 중복 방지)
  const externalId = typeof body.id === "string" ? body.id : null;

  const totalSets  = body.totalSets  != null ? Number(body.totalSets)  : 1;
  const setSeconds = body.setSeconds != null ? Number(body.setSeconds) : 0;

  await pool.query(
    `INSERT IGNORE INTO sessions
      (patient_id, date, kind,
       reps_completed, reps_target, posture_score, duration_sec,
       feedback, landmarks,
       total_sets, set_seconds, rep_timestamps, external_id)
     VALUES (?,?,?, ?,?,?,?, ?,?, ?,?,?,?)`,
    [
      patientId, body.date, body.kind,
      body.repsCompleted, body.repsTarget, body.postureScore, body.durationSec,
      body.feedback, landmarksJson,
      totalSets, setSeconds, repTimestampsJson, externalId,
    ]
  );
  return NextResponse.json({ ok: true });
}
