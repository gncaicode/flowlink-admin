import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { Prescription } from "@/types/domain";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string; prescriptionId: string } }
) {
  const patientId = parseInt(params.id);
  const prescriptionId = parseInt(params.prescriptionId);
  const body = await req.json() as Partial<Prescription>;
  await pool.query(
    `UPDATE prescriptions
     SET reps = ?, sets_count = ?, frequency_per_day = ?, duration_weeks = ?
     WHERE id = ? AND patient_id = ?`,
    [body.reps, body.sets, body.frequencyPerDay, body.durationWeeks, prescriptionId, patientId]
  );
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; prescriptionId: string } }
) {
  const patientId = parseInt(params.id);
  const prescriptionId = parseInt(params.prescriptionId);
  await pool.query(
    "DELETE FROM prescriptions WHERE id = ? AND patient_id = ?",
    [prescriptionId, patientId]
  );
  return NextResponse.json({ ok: true });
}
