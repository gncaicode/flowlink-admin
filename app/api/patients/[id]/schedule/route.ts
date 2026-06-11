import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { scheduled } = await req.json() as { scheduled: string | null };

  await pool.query(
    "UPDATE patients SET scheduled = ? WHERE id = ?",
    [scheduled ?? null, params.id]
  );

  return NextResponse.json({ ok: true });
}
