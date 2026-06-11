"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck } from "@tabler/icons-react";
import { Caption } from "@/components/ui/Caption";
import { Button } from "@/components/ui/Button";
import {
  Step1Basic,
  Step2Avf,
  type PatientDraft,
} from "@/components/patients/PatientFormSections";
import { usePatientsStore } from "@/lib/store/patients";

export default function EditPatientPage({
  params,
}: {
  params: { pid: string };
}) {
  const router = useRouter();
  const decoded = decodeURIComponent(params.pid);
  const patient = usePatientsStore((s) =>
    s.patients.find((p) => p.pid === decoded),
  );
  const updatePatient = usePatientsStore((s) => s.update);

  const [draft, setDraft] = useState<PatientDraft>(() => ({
    name: patient?.name ?? "",
    pid: patient?.pid ?? "",
    age: patient?.age ?? "",
    gender: patient?.gender ?? "F",
    surgeryDate: patient?.surgeryDate ?? "",
    surgeryLocation: patient?.surgeryLocation ?? "좌측 요골동맥",
    anastomosis: patient?.anastomosis ?? "단단 문합",
    surgeonName: patient?.surgeonName ?? "",
    baselineDiameterMm: patient?.baselineDiameterMm ?? "",
    baselineFlowMlMin: patient?.baselineFlowMlMin ?? "",
    previousAvfHistory: patient?.previousAvfHistory ?? "없음",
    prescriptions: [],
  }));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!patient) return null;

  function set(patch: Partial<PatientDraft>) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  async function save() {
    setError(null);
    try {
      await updatePatient(patient!.id, {
        name: draft.name,
        pid: draft.pid,
        age: Number(draft.age) || 0,
        gender: draft.gender,
        surgeryDate: draft.surgeryDate,
        surgeryLocation: draft.surgeryLocation,
        anastomosis: draft.anastomosis,
        surgeonName: draft.surgeonName,
        baselineDiameterMm: Number(draft.baselineDiameterMm) || 0,
        baselineFlowMlMin: Number(draft.baselineFlowMlMin) || 0,
        previousAvfHistory: draft.previousAvfHistory,
      });
      setSaved(true);
      setTimeout(() => router.push(`/patients/${draft.pid}`), 800);
    } catch (e) {
      setError(e instanceof Error ? e.message : "수정에 실패했습니다.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <Caption>EDIT PATIENT</Caption>
          <h2 className="mt-1 text-[20px] font-bold text-navy">
            대상자 정보 수정
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-5 max-w-3xl">
        <Step1Basic v={draft} set={set} />
        <Step2Avf v={draft} set={set} />

        {error && (
          <div className="bg-red-light border border-red/20 text-red text-[12px] font-semibold px-4 py-3 rounded-card">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => router.push(`/patients/${patient.pid}`)}
          >
            취소
          </Button>
          <Button variant="primary" size="md" onClick={save} disabled={saved}>
            {saved ? "저장 완료" : "변경사항 저장"}
            <IconCheck size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
