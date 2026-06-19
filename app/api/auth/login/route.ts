import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, password, remember } = await req.json() as { username: string; password: string; remember?: boolean };

  if (!username || !password) {
    return NextResponse.json({ error: "아이디와 비밀번호를 입력해 주세요." }, { status: 400 });
  }

  const [rows] = await pool.query(
    `SELECT u.id, u.email, u.username, u.password_hash, u.institution_id, i.name AS institution_name
     FROM users u
     LEFT JOIN institutions i ON i.id = u.institution_id
     WHERE u.username = ? LIMIT 1`,
    [username]
  );

  const user = (rows as Record<string, unknown>[])[0];
  if (!user) {
    return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash as string);
  if (!valid) {
    return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  const institutionId = user.institution_id ? Number(user.institution_id) : null;
  const token = await signToken(
    { userId: user.id, email: user.email, institutionId },
    remember ? "30d" : "1d"
  );

  return NextResponse.json({
    email: user.email,
    institutionId,
    institutionName: user.institution_name ?? null,
    token,
  });
}
