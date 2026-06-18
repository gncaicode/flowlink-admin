"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IconCheck, IconUser, IconLock } from "@tabler/icons-react";
import { Caption } from "@/components/ui/Caption";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { usePatientsStore } from "@/lib/store/patients";

export default function EditPatientPage({
  params,
}: {
  params: { pid: string };
}) {
  const router = useRouter();
  const decoded = decodeURIComponent(params.pid);
  const patient = usePatientsStore((s) => s.patients.find((p) => p.pid === decoded));
  const updatePatient = usePatientsStore((s) => s.update);

  const [name, setName] = useState(patient?.name ?? "");
  const [pid, setPid] = useState(patient?.pid ?? "");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState<number | "">(patient?.age ?? "");
  const [gender, setGender] = useState<"M" | "F">(patient?.gender ?? "F");

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!patient) return null;

  async function save() {
    setError(null);
    if (!name || !pid) {
      setError("이름과 환자번호를 입력해 주세요.");
      return;
    }
    try {
      const patch: Parameters<typeof updatePatient>[1] & { password?: string } = {
        name,
        pid,
        age: Number(age) || 0,
        gender,
      };
      if (password) patch.password = password;
      await updatePatient(patient!.id, patch);
      setSaved(true);
      setTimeout(() => router.push(`/patients/${pid}`), 800);
    } catch (e) {
      setError(e instanceof Error ? e.message : "수정에 실패했습니다.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <Caption>EDIT PATIENT</Caption>
          <h2 className="mt-1 text-[20px] font-bold text-navy">대상자 정보 수정</h2>
        </div>
      </div>

      <div className="bg-white border border-ink-200 rounded-card p-6 flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="이름"
            placeholder="환자 이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            leading={<IconUser size={16} />}
          />
          <Input
            label="환자번호 (PID)"
            placeholder="P-2026-00000"
            value={pid}
            onChange={(e) => setPid(e.target.value)}
          />
        </div>

        <Input
          label="비밀번호"
          placeholder="변경할 경우에만 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          leading={<IconLock size={16} />}
          caption="비워두면 기존 비밀번호가 유지됩니다."
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
