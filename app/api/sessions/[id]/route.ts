import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { Session } from "@/types/domain";

function parseJsonField(raw: unknown): unknown[] {
  try {
    let v = raw;
    if (typeof v === "string") v = JSON.parse(v);
    if (typeof v === "string") v = JSON.parse(v);
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

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const [rows] = await pool.query("SELECT * FROM sessions WHERE id = ? LIMIT 1", [id]);
  const row = (rows as Record<string, unknown>[])[0];
  if (!row) return NextResponse.json({ error: "세션을 찾을 수 없습니다." }, { status: 404 });
  return NextResponse.json(rowToSession(row));
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const [result] = await pool.query(
    "DELETE FROM sessions WHERE id = ?",
    [id]
  );
  const affected = (result as { affectedRows: number }).affectedRows;
  if (affected === 0) {
    return NextResponse.json({ error: "세션을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
