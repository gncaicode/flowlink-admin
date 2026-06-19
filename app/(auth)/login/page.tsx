"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconUser,
  IconLock,
  IconArrowRight,
  IconBuildingHospital,
} from "@tabler/icons-react";
import { Caption } from "@/components/ui/Caption";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSessionStore } from "@/lib/store/session";

export default function LoginPage() {
  const router = useRouter();
  const login = useSessionStore((s) => s.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("아이디와 비밀번호를 모두 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });
      const data = await res.json() as { email: string; institutionId: number | null; institutionName?: string; token: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "로그인에 실패했습니다.");
        return;
      }
      login({
        email: data.email,
        institutionId: data.institutionId,
        institutionName: data.institutionName ?? null,
        token: data.token,
        remember,
      });
      router.push("/dashboard");
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Caption>SIGN IN</Caption>
      <h1 className="mt-2 text-[28px] font-bold text-navy tracking-tight">
        의료진 로그인
      </h1>
      <p className="mt-2 text-[13px] text-ink-500">
        등록된 기관 계정으로 로그인하세요.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-4">
        <Input
          label="기관 아이디"
          placeholder=""
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          leading={<IconUser size={16} />}
          type="text"
          autoComplete="username"
          error={error || undefined}
        />
        <Input
          label="비밀번호"
          placeholder=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          leading={<IconLock size={16} />}
          type="password"
          autoComplete="current-password"
          error={error || undefined}
        />

        <div className="flex items-center justify-between text-[12px]">
          <label className="flex items-center gap-2 text-ink-500 cursor-pointer">
            <input
              type="checkbox"
              className="accent-teal w-3.5 h-3.5 rounded"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            로그인 상태 유지
          </label>
          <Link href="/recover" className="font-semibold text-navy hover:text-teal">
            아이디·비밀번호 찾기
          </Link>
        </div>

        <Button type="submit" size="lg" className="mt-2" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
          {!loading && <IconArrowRight size={18} />}
        </Button>
      </form>

      <div className="mt-8 flex items-center gap-3">
        <div className="flex-1 h-px bg-ink-200" />
        <span className="text-[11px] text-ink-500 tracking-wide uppercase">OR</span>
        <div className="flex-1 h-px bg-ink-200" />
      </div>

      <Link
        href="/signup"
        className="mt-6 flex items-center justify-between p-4 border border-ink-200 rounded-card bg-white hover:border-navy/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-navy-faint text-navy flex items-center justify-center">
            <IconBuildingHospital size={20} stroke={1.6} />
          </div>
          <div>
            <div className="text-[13px] font-bold text-navy">우리 기관 처음 사용해요</div>
            <div className="text-[11px] text-ink-500">의료기관 단위로 회원가입</div>
          </div>
        </div>
        <IconArrowRight size={18} className="text-ink-500" />
      </Link>
    </div>
  );
}
