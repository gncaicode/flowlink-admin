import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken, extractBearer } from "@/lib/auth";

export async function GET(req: Request) {
  const token = extractBearer(req.headers.get("Authorization"));
  const payload = token ? await verifyToken(token) : null;
  const institutionId = (payload?.institutionId as string) ?? null;
  if (!institutionId) return NextResponse.json({ error: "인증 오류" }, { status: 401 });

  const today = new Date().toISOString().slice(0, 10);

  const [[patientStats], [sessionStats], [todaySessions], [trendRows]] = await Promise.all([
    pool.query(`
      SELECT
        COUNT(*)                          AS total,
        COALESCE(AVG(maturity), 0)        AS avgMaturity,
        COALESCE(AVG(adherence), 0)       AS avgAdherence,
        SUM(status = 'active')            AS active,
        SUM(status = 'watch')             AS watch,
        SUM(status = 'ready')             AS ready,
        SUM(status = 'inactive')          AS inactive
      FROM patients
      WHERE institution_id = ?
    `, [institutionId]),
    pool.query(`
      SELECT
        COUNT(*)                          AS totalSessions,
        COALESCE(AVG(posture_score), 0)   AS avgPostureScore
      FROM sessions
      WHERE patient_id IN (SELECT id FROM patients WHERE institution_id = ?)
    `, [institutionId]),
    pool.query(
      "SELECT COUNT(*) AS count FROM sessions WHERE date = ? AND patient_id IN (SELECT id FROM patients WHERE institution_id = ?)",
      [today, institutionId]
    ),
    pool.query(`
      SELECT date, ROUND(AVG(posture_score)) AS avgScore, COUNT(*) AS cnt
      FROM sessions
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        AND patient_id IN (SELECT id FROM patients WHERE institution_id = ?)
      GROUP BY date
      ORDER BY date ASC
    `, [institutionId]),
  ]);

  const p = (patientStats as Record<string, unknown>[])[0];
  const s = (sessionStats as Record<string, unknown>[])[0];
  const t = (todaySessions as Record<string, unknown>[])[0];
  const trend = (trendRows as Record<string, unknown>[]).map((r) => ({
    label: (r.date as Date).toISOString().slice(5, 10),
    value: Number(r.avgScore),
  }));

  return NextResponse.json({
    patients: {
      total: Number(p.total),
      active: Number(p.active),
      watch: Number(p.watch),
      ready: Number(p.ready),
      inactive: Number(p.inactive),
      avgMaturity: Math.round(Number(p.avgMaturity)),
      avgAdherence: Math.round(Number(p.avgAdherence)),
    },
    sessions: {
      total: Number(s.totalSessions),
      avgPostureScore: Math.round(Number(s.avgPostureScore)),
      todayCount: Number(t.count),
    },
    trend,
  });
}
