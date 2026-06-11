import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { institutionName, department, bizNumber, managerName, managerEmail, managerPhone, password } =
    await req.json() as Record<string, string>;

  if (!institutionName || !managerEmail || !password) {
    return NextResponse.json({ error: "필수 항목을 입력해 주세요." }, { status: 400 });
  }

  const [existing] = await pool.query(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [managerEmail]
  );
  if ((existing as unknown[]).length > 0) {
    return NextResponse.json({ error: "이미 등록된 이메일입니다." }, { status: 409 });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // institution 생성 (id는 AUTO_INCREMENT)
    const [instResult] = await conn.query(
      "INSERT INTO institutions (name, department, manager, biz_number, phone) VALUES (?, ?, ?, ?, ?)",
      [institutionName, department ?? "", managerName ?? "", bizNumber ?? null, managerPhone ?? null]
    ) as [{ insertId: number }, unknown];
    const institutionId = instResult.insertId;

    // user 생성
    const passwordHash = await bcrypt.hash(password, 10);
    const [userResult] = await conn.query(
      "INSERT INTO users (email, password_hash, institution_id) VALUES (?, ?, ?)",
      [managerEmail, passwordHash, institutionId]
    ) as [{ insertId: number }, unknown];

    await conn.commit();

    const token = await signToken({
      userId: userResult.insertId,
      email: managerEmail,
      institutionId,
    });

    return NextResponse.json({
      email: managerEmail,
      institutionId,
      institutionName,
      token,
    });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  } finally {
    conn.release();
  }
}
