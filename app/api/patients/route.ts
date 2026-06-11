import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken, extractBearer } from "@/lib/auth";
import type { Patient } from "@/types/domain";

function rowToPatient(row: Record<string, unknown>): Patient {
  return {
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
    maturity: row.maturity as number,
    program: (row.program as string | null) ?? undefined,
    adherence: row.adherence as number,
    status: row.status as Patient["status"],
    scheduled: row.scheduled
      ? (row.scheduled as Date).toISOString().slice(0, 10)
      : undefined,
    alert: (row.alert as string | null) ?? undefined,
    groupId: (row.group_id as string | null) ?? undefined,
    createdAt: (row.created_at as Date).toISOString().slice(0, 10),
  };
}

async function getInstitutionId(req: Request): Promise<number | null> {
  const token = extractBearer(req.headers.get("Authorization"));
  if (!token) return null;
  const payload = await verifyToken(token);
  const val = payload?.institutionId;
  return val != null ? Number(val) : null;
}

export async function GET(req: Request) {
  const institutionId = await getInstitutionId(req);
  if (!institutionId) return NextResponse.json({ error: "인증 오류" }, { status: 401 });

  const [rows] = await pool.query(
    "SELECT * FROM patients WHERE institution_id = ? ORDER BY created_at DESC",
    [institutionId]
  );
  const patients = (rows as Record<string, unknown>[]).map(rowToPatient);
  return NextResponse.json(patients);
}

export async function POST(req: Request) {
  const institutionId = await getInstitutionId(req);
  if (!institutionId) return NextResponse.json({ error: "인증 오류" }, { status: 401 });

  const body = await req.json() as Omit<Patient, "id">;
  await pool.query(
    `INSERT INTO patients
      (pid,name,age,gender,surgery_date,surgery_location,anastomosis,surgeon_name,
       baseline_diameter_mm,baseline_flow_ml_min,previous_avf_history,maturity,program,
       adherence,status,scheduled,alert,group_id,created_at,institution_id)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      body.pid, body.name, body.age, body.gender,
      body.surgeryDate, body.surgeryLocation, body.anastomosis, body.surgeonName,
      body.baselineDiameterMm, body.baselineFlowMlMin, body.previousAvfHistory,
      body.maturity, body.program ?? null, body.adherence, body.status,
      body.scheduled ?? null, body.alert ?? null, body.groupId ?? null, body.createdAt,
      institutionId,
    ]
  );
  return NextResponse.json({ ok: true });
}
