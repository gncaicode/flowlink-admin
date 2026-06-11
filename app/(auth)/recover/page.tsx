"use client";
import { useState } from "react";
import Link from "next/link";
import {
  IconMail,
  IconPhone,
  IconBuildingHospital,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react";
import { Caption } from "@/components/ui/Caption";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Mode = "id" | "password";

export default function RecoverPage() {
  const [mode, setMode] = useState<Mode>("id");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-teal-light text-teal flex items-center justify-center mx-auto">
          <IconCheck size={32} stroke={2.4} />
        </div>
        <div className="mt-5 text-[22px] font-bold text-navy">
          {mode === "id"
            ? "아이디를 발송했습니다"
            : "비밀번호 재설정 메일을 보냈습니다"}
        </div>
        <p className="mt-2 text-[13px] text-ink-500">
          입력하신 연락처로 안내가 도착했는지 확인해 주세요.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/login">
            <Button variant="secondary" size="lg" type="button">
              로그인으로 이동
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Caption>ACCOUNT RECOVERY</Caption>
      <h1 className="mt-2 text-[24px] font-bold text-navy tracking-tight">
        아이디 · 비밀번호 찾기
      </h1>
      <p className="mt-2 text-[13px] text-ink-500">
        등록 시 입력한 기관 정보를 통해 계정을 확인합니다.
      </p>

      <div className="mt-7 inline-flex bg-snow border border-ink-200 rounded-btn p-1">
        {(["id", "password"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "px-5 py-2 text-[13px] font-semibold rounded-[6px] transition-colors",
              mode === m
                ? "bg-white text-navy shadow-card"
                : "text-ink-500 hover:text-navy",
            )}
          >
            {m === "id" ? "아이디 찾기" : "비밀번호 찾기"}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="mt-6 flex flex-col gap-4"
      >
        <Input
          label="기관명"
          placeholder="예) 서울대학교병원"
          leading={<IconBuildingHospital size={16} />}
        />
        <Input
          label="담당자 이름"
          placeholder="예) 박지훈"
        />
        {mode === "id" ? (
          <Input
            label="등록 연락처"
            placeholder="010-0000-0000"
            leading={<IconPhone size={16} />}
          />
        ) : (
          <Input
            label="기관 이메일"
            placeholder="clinician@hospital.kr"
            leading={<IconMail size={16} />}
            type="email"
          />
        )}

        <Button size="lg" type="submit" className="mt-2">
          {mode === "id" ? "아이디 발송하기" : "재설정 메일 보내기"}
          <IconArrowRight size={18} />
        </Button>
      </form>

      <div className="mt-6 text-center text-[12px] text-ink-500">
        <Link href="/login" className="font-semibold text-navy hover:text-teal">
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
