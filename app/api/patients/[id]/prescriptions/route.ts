import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { Prescription } from "@/types/domain";

function rowToPrescription(row: Record<string, unknown>): Prescription & { id: number } {
  return {
    id: row.id as number,
    patientId: row.patient_id as number,
    kind: row.kind as Prescription["kind"],
    reps: row.reps as number,
    sets: row.sets_count as number,
    frequencyPerDay: row.frequency_per_day as number,
    durationWeeks: row.duration_weeks as number,
    startedAt: (row.started_at as Date).toISOString().slice(0, 10),
  };
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const patientId = parseInt(params.id);
  const [rows] = await pool.query(
    "SELECT * FROM prescriptions WHERE patient_id = ? ORDER BY id ASC",
    [patientId]
  );
  const prescriptions = (rows as Record<string, unknown>[]).map(rowToPrescription);
  return NextResponse.json(prescriptions);
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const patientId = parseInt(params.id);
  const body = await req.json() as Prescription;
  const [result] = await pool.query(
    `INSERT INTO prescriptions (patient_id, kind, reps, sets_count, frequency_per_day, duration_weeks, started_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [patientId, body.kind, body.reps, body.sets, body.frequencyPerDay, body.durationWeeks, body.startedAt]
  ) as [{ insertId: number }, unknown];

  return NextResponse.json({ ok: true, id: result.insertId });
}
