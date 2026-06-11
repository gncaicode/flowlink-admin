import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const [rows] = await pool.query(
    `SELECT
       COUNT(*)                                             AS totalSessions,
       COALESCE(AVG(reps_completed), 0)                    AS avgReps,
       COALESCE(AVG(reps_completed / reps_target * 100), 0) AS avgAchieveRate,
       COALESCE(SUM(duration_sec), 0)                      AS totalDurationSec,
       MAX(date)                                            AS lastSessionDate,
       SUM(feedback = 'perfect')                           AS perfectCount,
       SUM(feedback = 'minor')                             AS minorCount,
       SUM(feedback = 'major')                             AS majorCount
     FROM sessions
     WHERE patient_id = ?`,
    [params.id]
  );

  const row = (rows as Record<string, unknown>[])[0];

  return NextResponse.json({
    totalSessions: Number(row.totalSessions),
    avgReps: Math.round(Number(row.avgReps)),
    avgAchieveRate: Math.round(Number(row.avgAchieveRate)),
    totalDurationSec: Number(row.totalDurationSec),
    lastSessionDate: row.lastSessionDate
      ? (row.lastSessionDate as Date).toISOString().slice(0, 10)
      : null,
    feedbackBreakdown: {
      perfect: Number(row.perfectCount),
      minor: Number(row.minorCount),
      major: Number(row.majorCount),
    },
  });
}
