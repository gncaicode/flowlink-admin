"use client";
import { Caption } from "@/components/ui/Caption";
import { Input } from "@/components/ui/Input";
import {
  IconCalendar,
  IconUser,
  IconActivityHeartbeat,
  IconBarbell,
  IconHandGrab,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { EXERCISE_TEMPLATES } from "@/lib/mock/programs";
import type {
  AnastomosisType,
  ExerciseKind,
  SurgeryLocation,
} from "@/types/domain";

export type PatientDraft = {
  name: string;
  pid: string;
  age: number | "";
  gender: "M" | "F";
  surgeryDate: string;
  surgeryLocation: SurgeryLocation;
  anastomosis: AnastomosisType;
  surgeonName: string;
  baselineDiameterMm: number | "";
  baselineFlowMlMin: number | "";
  previousAvfHistory: "없음" | "1회" | "2회 이상";
  prescriptions: {
    kind: ExerciseKind;
    enabled: boolean;
    reps: number;
    sets: number;
    frequencyPerDay: number;
    durationWeeks: number;
  }[];
};

export const EMPTY_DRAFT: PatientDraft = {
  name: "",
  pid: "",
  age: "",
  gender: "F",
  surgeryDate: "",
  surgeryLocation: "좌측 요골동맥",
  anastomosis: "단단 문합",
  surgeonName: "",
  baselineDiameterMm: "",
  baselineFlowMlMin: "",
  previousAvfHistory: "없음",
  prescriptions: EXERCISE_TEMPLATES.map((t) => ({
    kind: t.kind,
    enabled: t.kind === "grip",
    reps: t.defaultReps,
    sets: t.defaultSets,
    frequencyPerDay: t.defaultFrequencyPerDay,
    durationWeeks: 8,
  })),
};

export function FormSection({
  caption,
  title,
  children,
}: {
  caption: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border-[0.5px] border-ink-200 rounded-card p-6">
      <Caption>{caption}</Caption>
      <div className="mt-1 text-[16px] font-bold text-navy">{title}</div>
      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </section>
  );
}

export function RadioGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <div className="text-[11px] font-semibold tracking-wide12 uppercase text-ink-500 mb-2">
        {label}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {options.map((o) => {
          const active = value === o;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={cn(
                "h-10 rounded-btn font-semibold text-[13px] transition-colors",
                active
                  ? "bg-navy text-white border border-navy"
                  : "bg-white border border-ink-200 text-ink-700 hover:border-navy/40",
              )}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Step1Basic({
  v,
  set,
}: {
  v: PatientDraft;
  set: (p: Partial<PatientDraft>) => void;
}) {
  return (
    <FormSection caption="BASIC INFO" title="기본 정보">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="이름"
          placeholder="환자 이름"
          value={v.name}
          onChange={(e) => set({ name: e.target.value })}
          leading={<IconUser size={16} />}
        />
        <Input
          label="환자번호 (PID)"
          placeholder="P-2026-00000"
          value={v.pid}
          onChange={(e) => set({ pid: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="연령"
          placeholder="58"
          value={v.age === "" ? "" : String(v.age)}
          onChange={(e) =>
            set({
              age:
                e.target.value === "" ? "" : Math.max(0, Number(e.target.value)),
            })
          }
          type="number"
        />
        <RadioGroup<"M" | "F">
          label="성별"
          value={v.gender}
          options={["M", "F"]}
          onChange={(g) => set({ gender: g })}
        />
      </div>
    </FormSection>
  );
}

export function Step2Avf({
  v,
  set,
}: {
  v: PatientDraft;
  set: (p: Partial<PatientDraft>) => void;
}) {
  const locOptions: SurgeryLocation[] = [
    "좌측 요골동맥",
    "우측 요골동맥",
    "좌측 상완동맥",
    "우측 상완동맥",
  ];
  const anaOptions: AnastomosisType[] = ["단단 문합", "단측 문합", "측측 문합"];
  return (
    <>
      <FormSection caption="VASCULAR ACCESS" title="AVF 수술 정보">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="수술일"
            placeholder="2026-05-04"
            value={v.surgeryDate}
            onChange={(e) => set({ surgeryDate: e.target.value })}
            type="date"
            trailing={<IconCalendar size={16} />}
          />
          <Input
            label="담당 외과의"
            placeholder="예) 김민준 교수"
            value={v.surgeonName}
            onChange={(e) => set({ surgeonName: e.target.value })}
            leading={<IconUser size={16} />}
          />
        </div>
        <div>
          <div className="text-[11px] font-semibold tracking-wide12 uppercase text-ink-500 mb-2">
            수술 부위
          </div>
          <div className="grid grid-cols-2 gap-2">
            {locOptions.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => set({ surgeryLocation: o })}
                className={cn(
                  "h-10 rounded-btn font-semibold text-[13px] transition-colors",
                  v.surgeryLocation === o
                    ? "bg-navy text-white border border-navy"
                    : "bg-white border border-ink-200 text-ink-700 hover:border-navy/40",
                )}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
        <RadioGroup<AnastomosisType>
          label="문합 유형"
          value={v.anastomosis}
          options={anaOptions}
          onChange={(o) => set({ anastomosis: o })}
        />
      </FormSection>

      <FormSection caption="BASELINE METRICS" title="기저 상태">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="혈관 직경 (mm)"
            placeholder="3.2"
            value={
              v.baselineDiameterMm === ""
                ? ""
                : String(v.baselineDiameterMm)
            }
            onChange={(e) =>
              set({
                baselineDiameterMm:
                  e.target.value === "" ? "" : Number(e.target.value),
              })
            }
            type="number"
            trailing={<span className="text-[11px] font-semibold">mm</span>}
          />
          <Input
            label="혈류량 (mL/min)"
            placeholder="412"
            value={
              v.baselineFlowMlMin === ""
                ? ""
                : String(v.baselineFlowMlMin)
            }
            onChange={(e) =>
              set({
                baselineFlowMlMin:
                  e.target.value === "" ? "" : Number(e.target.value),
              })
            }
            type="number"
            trailing={<span className="text-[11px] font-semibold">mL/min</span>}
          />
        </div>
        <RadioGroup<"없음" | "1회" | "2회 이상">
          label="이전 AVF 수술 이력"
          value={v.previousAvfHistory}
          options={["없음", "1회", "2회 이상"]}
          onChange={(o) => set({ previousAvfHistory: o })}
        />
      </FormSection>
    </>
  );
}

const KIND_META: Record<
  ExerciseKind,
  { label: string; icon: React.ReactNode; desc: string }
> = {
  grip: {
    label: "공쥐기",
    icon: <IconHandGrab size={22} stroke={1.6} />,
    desc: "전완근 자극 · 정맥 직경 성장",
  },
  dumbbell: {
    label: "덤벨 컬",
    icon: <IconBarbell size={22} stroke={1.6} />,
    desc: "상완근 자극 · 혈류량 증진",
  },
  wrist_rotation: {
    label: "혈류 모니터링",
    icon: <IconActivityHeartbeat size={22} stroke={1.6} />,
    desc: "혈류 변화 자가 확인",
  },
  monitor: {
    label: "혈류 모니터링",
    icon: <IconActivityHeartbeat size={22} stroke={1.6} />,
    desc: "혈류 변화 자가 확인",
  },
};

export function Step3Prescription({
  v,
  set,
}: {
  v: PatientDraft;
  set: (p: Partial<PatientDraft>) => void;
}) {
  function update(
    i: number,
    patch: Partial<PatientDraft["prescriptions"][number]>,
  ) {
    set({
      prescriptions: v.prescriptions.map((p, idx) =>
        idx === i ? { ...p, ...patch } : p,
      ),
    });
  }
  return (
    <FormSection caption="PRESCRIPTION" title="운동 처방">
      {v.prescriptions.map((p, i) => {
        const meta = KIND_META[p.kind];
        return (
          <div
            key={p.kind}
            className={cn(
              "border rounded-card p-4 transition-colors",
              p.enabled
                ? "border-navy/30 bg-navy-faint/40"
                : "border-ink-200 bg-white",
            )}
          >
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1.5 accent-teal w-4 h-4 rounded"
                checked={p.enabled}
                onChange={(e) => update(i, { enabled: e.target.checked })}
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-[10px] flex items-center justify-center",
                      p.enabled
                        ? "bg-navy text-white"
                        : "bg-ink-100 text-ink-500",
                    )}
                  >
                    {meta.icon}
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-navy">
                      {meta.label}
                    </div>
                    <div className="text-[11px] text-ink-500">{meta.desc}</div>
                  </div>
                </div>
                {p.enabled && (
                  <div className="grid grid-cols-4 gap-3 mt-4">
                    <Input
                      label="반복"
                      value={String(p.reps)}
                      onChange={(e) =>
                        update(i, { reps: Number(e.target.value) || 0 })
                      }
                      type="number"
                      trailing={<span className="text-[11px]">회</span>}
                    />
                    <Input
                      label="세트"
                      value={String(p.sets)}
                      onChange={(e) =>
                        update(i, { sets: Number(e.target.value) || 0 })
                      }
                      type="number"
                      trailing={<span className="text-[11px]">세트</span>}
                    />
                    <Input
                      label="일일 빈도"
                      value={String(p.frequencyPerDay)}
                      onChange={(e) =>
                        update(i, {
                          frequencyPerDay: Number(e.target.value) || 0,
                        })
                      }
                      type="number"
                      trailing={<span className="text-[11px]">회/일</span>}
                    />
                    <Input
                      label="처방 기간"
                      value={String(p.durationWeeks)}
                      onChange={(e) =>
                        update(i, {
                          durationWeeks: Number(e.target.value) || 0,
                        })
                      }
                      type="number"
                      trailing={<span className="text-[11px]">주</span>}
                    />
                  </div>
                )}
              </div>
            </label>
          </div>
        );
      })}
    </FormSection>
  );
}
