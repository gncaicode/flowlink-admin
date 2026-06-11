"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconBuildingHospital,
  IconUser,
  IconMail,
  IconPhone,
  IconLock,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconFileText,
} from "@tabler/icons-react";
import { Caption } from "@/components/ui/Caption";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import { useSessionStore } from "@/lib/store/session";

type Form = {
  institutionName: string;
  department: string;
  bizNumber: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  password: string;
  passwordConfirm: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeMarketing: boolean;
};

const EMPTY: Form = {
  institutionName: "",
  department: "",
  bizNumber: "",
  managerName: "",
  managerEmail: "",
  managerPhone: "",
  password: "",
  passwordConfirm: "",
  agreeTerms: false,
  agreePrivacy: false,
  agreeMarketing: false,
};

export default function SignupPage() {
  const router = useRouter();
  const login = useSessionStore((s) => s.login);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const update = (patch: Partial<Form>) => setForm((f) => ({ ...f, ...patch }));

  function validateStep(): boolean {
    setError(null);
    if (step === 0) {
      if (!form.institutionName) {
        setError("institutionName");
        return false;
      }
      if (!form.department) {
        setError("department");
        return false;
      }
      if (!form.bizNumber) {
        setError("bizNumber");
        return false;
      }
      const biz = form.bizNumber.trim();
      const validFormat = /^\d{10}$/.test(biz) || /^\d{3}-\d{2}-\d{5}$/.test(biz);
      if (!validFormat) {
        setError("bizNumberFormat");
        return false;
      }
    } else if (step === 1) {
      if (!form.managerName) {
        setError("managerName");
        return false;
      }
      if (!form.managerEmail) {
        setError("managerEmail");
        return false;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.managerEmail)) {
        setError("managerEmailFormat");
        return false;
      }
      if (!form.managerPhone) {
        setError("managerPhone");
        return false;
      }
      if (!/^[\d-]+$/.test(form.managerPhone)) {
        setError("managerPhoneFormat");
        return false;
      }
      if (!form.password) {
        setError("password");
        return false;
      }
      if (form.password.length < 8) {
        setError("passwordLength");
        return false;
      }
      if (!form.passwordConfirm) {
        setError("passwordConfirm");
        return false;
      }
      if (form.password !== form.passwordConfirm) {
        setError("passwordMismatch");
        return false;
      }
    } else if (step === 2) {
      if (!form.agreeTerms || !form.agreePrivacy) {
        setError("필수 약관에 동의해 주세요.");
        return false;
      }
    }
    return true;
  }

  async function next() {
    if (!validateStep()) return;
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionName: form.institutionName,
          department: form.department,
          bizNumber: form.bizNumber,
          managerName: form.managerName,
          managerEmail: form.managerEmail,
          managerPhone: form.managerPhone,
          password: form.password,
        }),
      });
      const data = await res.json() as { email: string; institutionId: number; institutionName: string; token: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "가입에 실패했습니다.");
        return;
      }
      login({
        email: data.email,
        institutionId: data.institutionId,
        institutionName: data.institutionName,
        token: data.token,
      });
      setDone(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-teal-light text-teal flex items-center justify-center mx-auto">
          <IconCheck size={32} stroke={2.4} />
        </div>
        <div className="mt-5 text-[22px] font-bold text-navy">가입이 완료되었습니다</div>
        <p className="mt-2 text-[13px] text-ink-500">잠시 후 대시보드로 이동합니다.</p>
      </div>
    );
  }

  return (
    <div>
      <Caption>SIGN UP · INSTITUTION</Caption>
      <h1 className="mt-2 text-[24px] font-bold text-navy tracking-tight">기관 회원가입</h1>
      <p className="mt-2 text-[13px] text-ink-500">
        의료기관 단위로 가입하면 등록된 환자들의 데이터를 함께 관리합니다.
      </p>

      <div className="mt-7">
        <Stepper
          steps={[{ label: "기관 정보" }, { label: "담당자 정보" }, { label: "약관 동의" }]}
          current={step}
        />
      </div>

      <div className="mt-7 flex flex-col gap-4 min-h-[260px]">
        {step === 0 && (
          <>
            <Input
              label="기관명"
              placeholder="예) 서울대학교병원"
              value={form.institutionName}
              onChange={(e) => { update({ institutionName: e.target.value }); setError(null); }}
              leading={<IconBuildingHospital size={16} />}
              error={error === "institutionName" ? "기관명을 입력해 주세요." : undefined}
            />
            <Input
              label="진료과 / 부서"
              placeholder="예) 신장내과 3F"
              value={form.department}
              onChange={(e) => { update({ department: e.target.value }); setError(null); }}
              leading={<IconFileText size={16} />}
              error={error === "department" ? "진료과/부서를 입력해 주세요." : undefined}
            />
            <Input
              label="사업자등록번호"
              placeholder="000-00-00000"
              value={form.bizNumber}
              onChange={(e) => { update({ bizNumber: e.target.value }); setError(null); }}
              error={
                error === "bizNumber" ? "사업자등록번호를 입력해 주세요." :
                error === "bizNumberFormat" ? "형식이 올바르지 않습니다. (예: 1234567890 또는 123-45-67890)" :
                undefined
              }
            />
          </>
        )}

        {step === 1 && (
          <>
            <Input
              label="담당자 이름"
              placeholder="예) 박지훈"
              value={form.managerName}
              onChange={(e) => { update({ managerName: e.target.value }); setError(null); }}
              leading={<IconUser size={16} />}
              error={error === "managerName" ? "담당자 이름을 입력해 주세요." : undefined}
            />
            <Input
              label="기관 이메일 (로그인 ID)"
              placeholder="clinician@hospital.kr"
              value={form.managerEmail}
              onChange={(e) => { update({ managerEmail: e.target.value }); setError(null); }}
              leading={<IconMail size={16} />}
              type="email"
              error={
                error === "managerEmail" ? "이메일을 입력해 주세요." :
                error === "managerEmailFormat" ? "올바른 이메일 형식이 아닙니다." :
                undefined
              }
            />
            <Input
              label="연락처"
              placeholder="010-0000-0000"
              value={form.managerPhone}
              onChange={(e) => { update({ managerPhone: e.target.value }); setError(null); }}
              leading={<IconPhone size={16} />}
              error={
                error === "managerPhone" ? "연락처를 입력해 주세요." :
                error === "managerPhoneFormat" ? "숫자와 대쉬(-)만 입력 가능합니다." :
                undefined
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="비밀번호"
                placeholder="8자 이상"
                value={form.password}
                onChange={(e) => { update({ password: e.target.value }); setError(null); }}
                leading={<IconLock size={16} />}
                type="password"
                error={
                  error === "password" ? "비밀번호를 입력해 주세요." :
                  error === "passwordLength" ? "8자 이상이어야 합니다." :
                  undefined
                }
              />
              <Input
                label="비밀번호 확인"
                placeholder="다시 한 번 입력"
                value={form.passwordConfirm}
                onChange={(e) => { update({ passwordConfirm: e.target.value }); setError(null); }}
                leading={<IconLock size={16} />}
                type="password"
                error={
                  error === "passwordConfirm" ? "비밀번호 확인을 입력해 주세요." :
                  error === "passwordMismatch" ? "비밀번호가 일치하지 않습니다." :
                  undefined
                }
              />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="border border-ink-200 rounded-card p-4 space-y-3">
              {[
                { key: "agreeTerms" as const, label: "FlowLink 의료기관 이용약관 동의 (필수)" },
                { key: "agreePrivacy" as const, label: "개인정보 및 환자 의료정보 처리방침 동의 (필수)" },
                // { key: "agreeMarketing" as const, label: "제품 소식·임상 연구 자료 수신 동의 (선택)" },
              ].map((row) => (
                <label key={row.key} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-teal w-4 h-4 rounded"
                    checked={form[row.key]}
                    onChange={(e) => update({ [row.key]: e.target.checked })}
                  />
                  <span className="text-[13px] text-ink-700">{row.label}</span>
                </label>
              ))}
            </div>
            {error && <div className="text-[12px] text-red font-medium">{error}</div>}
            <div className="bg-snow border border-ink-200 rounded-card p-4 text-[12px] text-ink-500 leading-relaxed">
              FlowLink는 의료기관과 환자 사이의 데이터를 암호화하여 저장하고,
              개인 식별 정보는 의료진 외 외부에 제공되지 않습니다.
            </div>
          </>
        )}
      </div>

      <div className="mt-8 flex gap-3">
        {step > 0 && (
          <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)} type="button">
            <IconArrowLeft size={18} /> 이전
          </Button>
        )}
        <Button size="lg" className="flex-1" onClick={next} type="button" disabled={loading}>
          {step < 2 ? "다음 단계" : loading ? "처리 중..." : "가입 완료"}
          {!loading && <IconArrowRight size={18} />}
        </Button>
      </div>

      <div className="mt-6 text-center text-[12px] text-ink-500">
        이미 계정이 있나요?{" "}
        <Link href="/login" className="font-semibold text-navy hover:text-teal">
          로그인
        </Link>
      </div>
    </div>
  );
}
