import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken, extractBearer } from "@/lib/auth";

export async function GET(req: Request) {
  const token = extractBearer(req.headers.get("Authorization"));
  const payload = token ? await verifyToken(token) : null;
  const institutionId = (payload?.institutionId as string) ?? null;
  if (!institutionId) return NextResponse.json({ error: "인증 오류" }, { status: 401 });

  const today = new Date().toISOString().slice(0, 10);

  const [[patientStats], [sessionStats], [todaySessions], [trendRows], [recentRows]] = await Promise.all([
    pool.query(`
      SELECT COUNT(*) AS total
      FROM patients
      WHERE institution_id = ?
    `, [institutionId]),
    pool.query(`
      SELECT COUNT(*) AS totalSessions
      FROM sessions
      WHERE patient_id IN (SELECT id FROM patients WHERE institution_id = ?)
    `, [institutionId]),
    pool.query(
      "SELECT COUNT(*) AS count FROM sessions WHERE date = ? AND patient_id IN (SELECT id FROM patients WHERE institution_id = ?)",
      [today, institutionId]
    ),
    pool.query(`
      SELECT date, COUNT(*) AS cnt
      FROM sessions
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        AND patient_id IN (SELECT id FROM patients WHERE institution_id = ?)
      GROUP BY date
      ORDER BY date ASC
    `, [institutionId]),
    pool.query(`
      SELECT s.id, s.date, s.kind, s.reps_completed, s.reps_target, s.feedback,
             p.name AS patientName, p.pid
      FROM sessions s
      JOIN patients p ON s.patient_id = p.id
      WHERE p.institution_id = ?
      ORDER BY s.date DESC, s.id DESC
      LIMIT 5
    `, [institutionId]),
  ]);

  const p = (patientStats as Record<string, unknown>[])[0];
  const s = (sessionStats as Record<string, unknown>[])[0];
  const t = (todaySessions as Record<string, unknown>[])[0];
  const trend = (trendRows as Record<string, unknown>[]).map((r) => ({
    label: (r.date as Date).toISOString().slice(5, 10),
    value: Number(r.cnt),
  }));
  const recentSessions = (recentRows as Record<string, unknown>[]).map((r) => ({
    id: Number(r.id),
    date: (r.date as Date).toISOString().slice(0, 10),
    kind: r.kind as string,
    repsCompleted: Number(r.reps_completed),
    repsTarget: Number(r.reps_target),
    feedback: r.feedback as string,
    patientName: r.patientName as string,
    pid: r.pid as string,
  }));

  return NextResponse.json({
    patients: {
      total: Number(p.total),
    },
    sessions: {
      total: Number(s.totalSessions),
      todayCount: Number(t.count),
    },
    trend,
    recentSessions,
  });
}
