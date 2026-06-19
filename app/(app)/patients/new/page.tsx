"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconChevronLeft, IconCheck } from "@tabler/icons-react";
import { Caption } from "@/components/ui/Caption";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { IconUser, IconLock } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { usePatientsStore } from "@/lib/store/patients";

export default function NewPatientPage() {
  const router = useRouter();
  const addPatient = usePatientsStore((s) => s.add);

  const [name, setName] = useState("");
  const [pid, setPid] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [gender, setGender] = useState<"M" | "F">("F");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    if (!name || !pid) {
      setError("이름과 아이디를 입력해 주세요.");
      return;
    }
    if (!password) {
      setError("비밀번호를 입력해 주세요.");
      return;
    }
    setLoading(true);
    try {
      await addPatient({
        pid,
        name,
        password,
        age: Number(age) || 0,
        gender,
        surgeryDate: new Date().toISOString().slice(0, 10),
        surgeryLocation: "좌측 요골동맥",
        anastomosis: "단단 문합",
        surgeonName: "",
        baselineDiameterMm: 0,
        baselineFlowMlMin: 0,
        previousAvfHistory: "없음",
        adherence: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      });
      router.push("/patients");
    } catch (e) {
      setError(e instanceof Error ? e.message : "등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Link
        href="/patients"
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-ink-500 hover:text-navy"
      >
        <IconChevronLeft size={14} /> 대상자 목록으로
      </Link>

      <div className="mt-3">
        <Caption>NEW PATIENT</Caption>
        <h1 className="mt-2 text-[28px] font-bold text-navy tracking-tight">
          대상자 등록
        </h1>
        <p className="mt-1 text-[13px] text-ink-500">
          기본 정보를 입력하고 대상자를 등록합니다.
        </p>
      </div>

      <div className="mt-7 bg-white border border-ink-200 rounded-card p-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="이름"
            placeholder="환자 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leading={<IconUser size={16} />}
          />
          <Input
            label="아이디"
            placeholder="아이디 입력"
            value={pid}
            onChange={(e) => setPid(e.target.value)}
          />
        </div>

        <Input
          label="비밀번호"
          placeholder="환자에게 전달할 비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          leading={<IconLock size={16} />}
          caption="환자가 모바일 앱에 로그인할 때 사용합니다."
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="연령"
            placeholder="58"
            value={age === "" ? "" : String(age)}
            onChange={(e) =>
              setAge(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))
            }
            type="number"
          />
          <div>
            <div className="text-[11px] font-semibold tracking-wide12 uppercase text-ink-500 mb-2">
              성별
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["M", "F"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={cn(
                    "h-10 rounded-btn font-semibold text-[13px] transition-colors",
                    gender === g
                      ? "bg-navy text-white border border-navy"
                      : "bg-white border border-ink-200 text-ink-700 hover:border-navy/40",
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-light border border-red/20 text-red text-[12px] font-semibold px-4 py-3 rounded-card">
            {error}
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        >
          {loading ? "처리 중..." : <><IconCheck size={18} /> 등록 완료</>}
        </Button>
      </div>
    </div>
  );
}
