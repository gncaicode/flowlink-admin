import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { pid, password } = await req.json() as { pid: string; password: string };

  if (!pid || !password) {
    return NextResponse.json({ error: "환자번호와 비밀번호를 입력해 주세요." }, { status: 400 });
  }

  const [rows] = await pool.query(
    "SELECT id, pid, name, password_hash FROM patients WHERE pid = ? LIMIT 1",
    [pid]
  );

  const patient = (rows as Record<string, unknown>[])[0];
  if (!patient || !patient.password_hash) {
    return NextResponse.json({ error: "환자번호 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, patient.password_hash as string);
  if (!valid) {
    return NextResponse.json({ error: "환자번호 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const token = await signToken(
    { sub: patient.id, role: "patient", pid: patient.pid, name: patient.name },
    "30d"
  );

  return NextResponse.json({
    patientId: patient.id,
    pid: patient.pid,
    name: patient.name,
    token,
  });
}
