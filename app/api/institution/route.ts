import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken, extractBearer } from "@/lib/auth";

export async function GET(req: Request) {
  const token = extractBearer(req.headers.get("Authorization"));
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const [rows] = await pool.query(
    "SELECT i.* FROM institutions i INNER JOIN users u ON u.institution_id = i.id WHERE u.id = ? LIMIT 1",
    [payload.userId]
  );
  const list = rows as Record<string, unknown>[];
  if (!list.length) return NextResponse.json(null);
  const row = list[0];
  return NextResponse.json({
    id: row.id,
    name: row.name,
    department: row.department,
    manager: row.manager,
    bizNumber: row.biz_number ?? "",
    phone: row.phone ?? "",
  });
}

export async function PATCH(req: Request) {
  const token = extractBearer(req.headers.get("Authorization"));
  const payload = token ? await verifyToken(token) : null;
  if (!payload) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });

  const body = await req.json() as { name?: string; department?: string; bizNumber?: string; phone?: string };

  const [rows] = await pool.query("SELECT institution_id FROM users WHERE id = ?", [payload.userId]);
  const user = (rows as Record<string, unknown>[])[0];
  if (!user?.institution_id) return NextResponse.json({ error: "기관 정보가 없습니다." }, { status: 404 });

  const sets: string[] = [];
  const values: unknown[] = [];
  if (body.name !== undefined) { sets.push("name = ?"); values.push(body.name); }
  if (body.department !== undefined) { sets.push("department = ?"); values.push(body.department); }
  if (body.bizNumber !== undefined) { sets.push("biz_number = ?"); values.push(body.bizNumber); }
  if (body.phone !== undefined) { sets.push("phone = ?"); values.push(body.phone); }
  if (!sets.length) return NextResponse.json({ ok: true });

  values.push(user.institution_id);
  await pool.query(`UPDATE institutions SET ${sets.join(", ")} WHERE id = ?`, values);

  return NextResponse.json({ ok: true });
}
