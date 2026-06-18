import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken, extractBearer } from "@/lib/auth";

export async function GET(req: Request) {
  const token = extractBearer(req.headers.get("Authorization"));
  if (!token) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const payload = await verifyToken(token);
  if (!payload || payload.role !== "patient") {
    return NextResponse.json({ error: "환자 전용 API입니다." }, { status: 403 });
  }

  const patientId = Number(payload.sub);
  const [rows] = await pool.query(
    "SELECT id, pid, name, age, gender, program, scheduled, adherence FROM patients WHERE id = ? LIMIT 1",
    [patientId]
  );

  const row = (rows as Record<string, unknown>[])[0];
  if (!row) return NextResponse.json({ error: "환자 정보를 찾을 수 없습니다." }, { status: 404 });

  return NextResponse.json({
    id: row.id,
    pid: row.pid,
    name: row.name,
    age: row.age,
    gender: row.gender,
    program: row.program ?? null,
    scheduled: row.scheduled ? (row.scheduled as Date).toISOString().slice(0, 10) : null,
    adherence: row.adherence,
  });
}
