import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const [result] = await pool.query(
    "DELETE FROM sessions WHERE id = ?",
    [id]
  );
  const affected = (result as { affectedRows: number }).affectedRows;
  if (affected === 0) {
    return NextResponse.json({ error: "세션을 찾을 수 없습니다." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
