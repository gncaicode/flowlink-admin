import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import type { Patient } from "@/types/domain";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const [rows] = await pool.query("SELECT * FROM patients WHERE id = ? LIMIT 1", [id]);
  const row = (rows as Record<string, unknown>[])[0];
  if (!row) return NextResponse.json({ error: "환자를 찾을 수 없습니다." }, { status: 404 });

  const patient: Patient = {
    id: row.id as number,
    pid: row.pid as string,
    name: row.name as string,
    age: row.age as number,
    gender: row.gender as "M" | "F",
    surgeryDate: (row.surgery_date as Date).toISOString().slice(0, 10),
    surgeryLocation: row.surgery_location as Patient["surgeryLocation"],
    anastomosis: row.anastomosis as Patient["anastomosis"],
    surgeonName: row.surgeon_name as string,
    baselineDiameterMm: Number(row.baseline_diameter_mm),
    baselineFlowMlMin: row.baseline_flow_ml_min as number,
    previousAvfHistory: row.previous_avf_history as Patient["previousAvfHistory"],
    program: (row.program as string | null) ?? undefined,
    adherence: row.adherence as number,
    scheduled: row.scheduled
      ? (row.scheduled as Date).toISOString().slice(0, 10)
      : undefined,
    alert: (row.alert as string | null) ?? undefined,
    groupId: (row.group_id as string | null) ?? undefined,
    createdAt: (row.created_at as Date).toISOString().slice(0, 10),
  };

  return NextResponse.json(patient);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await req.json() as Partial<Patient> & { password?: string };
  const patch = body;
  const fieldMap: Record<string, string> = {
    pid: "pid", name: "name", age: "age", gender: "gender",
    surgeryDate: "surgery_date", surgeryLocation: "surgery_location",
    anastomosis: "anastomosis", surgeonName: "surgeon_name",
    baselineDiameterMm: "baseline_diameter_mm", baselineFlowMlMin: "baseline_flow_ml_min",
    previousAvfHistory: "previous_avf_history",
    adherence: "adherence",
    scheduled: "scheduled",
    alert: "alert", groupId: "group_id",
  };

  const sets: string[] = [];
  const values: unknown[] = [];
  for (const [key, col] of Object.entries(fieldMap)) {
    if (key in patch) {
      sets.push(`${col} = ?`);
      values.push((patch as Record<string, unknown>)[key] ?? null);
    }
  }
  if (body.password) {
    sets.push("password_hash = ?");
    values.push(await bcrypt.hash(body.password, 10));
  }

  if (sets.length === 0) return NextResponse.json({ ok: true });

  values.push(id);
  await pool.query(`UPDATE patients SET ${sets.join(", ")} WHERE id = ?`, values);
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  await pool.query("DELETE FROM patients WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
