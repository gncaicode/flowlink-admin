"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronLeft,
  IconCheck,
} from "@tabler/icons-react";
import { Caption } from "@/components/ui/Caption";
import { Button } from "@/components/ui/Button";
import { Stepper } from "@/components/ui/Stepper";
import {
  EMPTY_DRAFT,
  Step1Basic,
  Step2Avf,
  Step3Prescription,
  type PatientDraft,
} from "@/components/patients/PatientFormSections";
import { usePatientsStore } from "@/lib/store/patients";

const STEPS = [
  { label: "기본 정보", sub: "환자 인적사항을 입력합니다" },
  { label: "AVF 정보", sub: "수술 정보와 기저 상태" },
  { label: "운동 처방", sub: "처방할 운동과 강도" },
];

export default function NewPatientPage() {
  const router = useRouter();
  const addPatient = usePatientsStore((s) => s.add);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<PatientDraft>(EMPTY_DRAFT);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function set(patch: Partial<PatientDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  function validate(): boolean {
    setError(null);
    if (step === 0) {
      if (!draft.name || !draft.pid || !draft.age) {
        setError("기본 정보를 모두 입력해 주세요.");
        return false;
      }
    } else if (step === 1) {
      if (!draft.surgeryDate || !draft.surgeonName) {
        setError("수술일과 담당 외과의를 입력해 주세요.");
        return false;
      }
      if (!draft.baselineDiameterMm || !draft.baselineFlowMlMin) {
        setError("기저 혈관 직경과 혈류량을 입력해 주세요.");
        return false;
      }
    } else if (step === 2) {
      if (!draft.prescriptions.some((p) => p.enabled)) {
        setError("최소 한 가지 운동을 처방해 주세요.");
        return false;
      }
    }
    return true;
  }

  async function next() {
    if (!validate()) return;
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setLoading(true);
    try {
      const patient = {
        pid: draft.pid,
        name: draft.name,
        age: Number(draft.age) || 0,
        gender: draft.gender,
        surgeryDate: draft.surgeryDate,
        surgeryLocation: draft.surgeryLocation,
        anastomosis: draft.anastomosis,
        surgeonName: draft.surgeonName,
        baselineDiameterMm: Number(draft.baselineDiameterMm) || 0,
        baselineFlowMlMin: Number(draft.baselineFlowMlMin) || 0,
        previousAvfHistory: draft.previousAvfHistory,
        adherence: 0,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      await addPatient(patient);
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
      <div className="mt-3 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <Caption>NEW PATIENT</Caption>
          <h1 className="mt-2 text-[28px] font-bold text-navy tracking-tight">
            대상자 등록
          </h1>
          <p className="mt-1 text-[13px] text-ink-500">
            기관에 새 AVF 환자를 등록합니다. 모든 단계 입력 후 운동 처방을
            확정하면 모바일 앱에 자동 연동됩니다.
          </p>
        </div>
        <div className="px-3 py-2 rounded-md bg-teal-light text-teal text-[10px] font-bold tracking-wider">
          STEP {step + 1} / 3
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-[260px,1fr] gap-8">
        <aside className="lg:sticky lg:top-24 self-start">
          <Stepper steps={STEPS} current={step} orientation="vertical" />
        </aside>

        <div className="flex flex-col gap-5 min-w-0">
          {step === 0 && <Step1Basic v={draft} set={set} />}
          {step === 1 && <Step2Avf v={draft} set={set} />}
          {step === 2 && <Step3Prescription v={draft} set={set} />}

          {error && (
            <div className="bg-red-light border border-red/20 text-red text-[12px] font-semibold px-4 py-3 rounded-card">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <Button
                variant="secondary"
                size="lg"
                type="button"
                onClick={() => setStep(step - 1)}
              >
                <IconArrowLeft size={18} /> 이전
              </Button>
            )}
            <Button
              variant="primary"
              size="lg"
              type="button"
              onClick={next}
              className="flex-1"
              disabled={loading}
            >
              {step === 2 ? (
                loading ? <>처리 중...</> : <>등록 완료 <IconCheck size={18} /></>
              ) : (
                <>다음 단계로 <IconArrowRight size={18} /></>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
