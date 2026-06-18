import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractBearer } from "@/lib/auth";

// JWT 검증이 필요 없는 경로
const PUBLIC_PATHS = ["/api/auth/login", "/api/auth/signup", "/api/auth/patient-login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // API 경로가 아니면 통과
  if (!pathname.startsWith("/api/")) return NextResponse.next();

  // 공개 경로 통과
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = extractBearer(req.headers.get("Authorization"));
  if (!token) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "토큰이 유효하지 않습니다." }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
