import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { verifyToken, extractBearer } from "@/lib/auth";

export async function GET(req: Request) {
  const token = extractBearer(req.headers.get("Authorization"));
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.username, u.institution_id, i.name AS institution_name, i.department, i.manager
     FROM users u
     LEFT JOIN institutions i ON i.id = u.institution_id
     WHERE u.id = ? LIMIT 1`,
    [payload.userId]
  );
  const user = (rows as Record<string, unknown>[])[0];
  if (!user) return NextResponse.json({ error: "사용자를 찾을 수 없습니다." }, { status: 404 });

  return NextResponse.json({
    email: user.email,
    username: user.username ?? user.email,
    institutionId: user.institution_id,
    institutionName: user.institution_name,
    department: user.department,
    managerName: user.manager,
  });
}

export async function PATCH(req: Request) {
  const token = extractBearer(req.headers.get("Authorization"));
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await req.json() as {
    managerName?: string;
    newPassword?: string;
    currentPassword?: string;
  };

  if (body.newPassword) {
    if (!body.currentPassword) {
      return NextResponse.json({ error: "현재 비밀번호를 입력해 주세요." }, { status: 400 });
    }
    const [rows] = await pool.query("SELECT password_hash FROM users WHERE id = ?", [payload.userId]);
    const user = (rows as Record<string, unknown>[])[0];
    const valid = await bcrypt.compare(body.currentPassword, user.password_hash as string);
    if (!valid) return NextResponse.json({ error: "현재 비밀번호가 올바르지 않습니다." }, { status: 400 });

    const hash = await bcrypt.hash(body.newPassword, 10);
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, payload.userId]);
  }

  if (body.managerName) {
    const [rows] = await pool.query("SELECT institution_id FROM users WHERE id = ?", [payload.userId]);
    const user = (rows as Record<string, unknown>[])[0];
    if (user?.institution_id) {
      await pool.query("UPDATE institutions SET manager = ? WHERE id = ?", [body.managerName, user.institution_id]);
    }
  }

  return NextResponse.json({ ok: true });
}
