"use client";
import { useEffect, useState, useCallback } from "react";
import {
  IconHandGrab,
  IconBarbell,
  IconActivityHeartbeat,
  IconPlus,
  IconTrash,
  IconEdit,
  IconCheck,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Caption } from "@/components/ui/Caption";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EXERCISE_TEMPLATES } from "@/lib/mock/programs";
import { usePatientsStore } from "@/lib/store/patients";
import { useSessionStore } from "@/lib/store/session";
import type { ExerciseKind, Prescription } from "@/types/domain";
import { cn } from "@/lib/utils";

type PrescriptionWithId = Prescription & { id: number };

const ICONS: Record<ExerciseKind, React.ReactNode> = {
  grip: <IconHandGrab size={22} stroke={1.6} />,
  dumbbell: <IconBarbell size={22} stroke={1.6} />,
  monitor: <IconActivityHeartbeat size={22} stroke={1.6} />,
  wrist_rotation: <IconActivityHeartbeat size={22} stroke={1.6} />,
};

export default function PatientProgramPage({ params }: { params: { pid: string } }) {
  const decoded = decodeURIComponent(params.pid);
  const patient = usePatientsStore((s) => s.patients.find((p) => p.pid === decoded));
  const token = useSessionStore((s) => s.token);
  const authHeader = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const [rows, setRows] = useState<PrescriptionWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PrescriptionWithId | null>(null);
  const [adding, setAdding] = useState(false);

  const fetchPrescriptions = useCallback(async () => {
    if (!patient) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${patient.id}/prescriptions`, { headers: authHeader });
      if (res.ok) setRows(await res.json());
    } finally {
      setLoading(false);
    }
  }, [patient?.id]);

  useEffect(() => { fetchPrescriptions(); }, [fetchPrescriptions]);

  if (!patient) return null;

  async function addPrescription(kind: ExerciseKind) {
    const t = EXERCISE_TEMPLATES.find((e) => e.kind === kind);
    if (!t) return;
    const body: Prescription = {
      patientId: patient!.id,
      kind,
      reps: t.defaultReps,
      sets: t.defaultSets,
      frequencyPerDay: t.defaultFrequencyPerDay,
      durationWeeks: 8,
      startedAt: new Date().toISOString().slice(0, 10),
    };
    const res = await fetch(`/api/patients/${patient!.id}/prescriptions`, {
      method: "POST",
      headers: authHeader,
      body: JSON.stringify(body),
    });
    if (res.ok) { await fetchPrescriptions(); setAdding(false); }
  }

  async function updatePrescription(row: PrescriptionWithId) {
    await fetch(`/api/patients/${patient!.id}/prescriptions/${row.id}`, {
      method: "PATCH",
      headers: authHeader,
      body: JSON.stringify(row),
    });
    await fetchPrescriptions();
    setEditing(null);
  }

  async function removePrescription(id: number) {
    await fetch(`/api/patients/${patient!.id}/prescriptions/${id}`, {
      method: "DELETE",
      headers: authHeader,
    });
    setRows((r) => r.filter((x) => x.id !== id));
  }

  const availableToAdd = EXERCISE_TEMPLATES.filter(
    (t) => !rows.some((r) => r.kind === t.kind)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <Caption>EXERCISE PROGRAM</Caption>
          <h2 className="mt-1 text-[20px] font-bold text-navy">처방된 운동 프로그램</h2>
        </div>
        {availableToAdd.length > 0 && (
          <Button variant="primary" size="md" onClick={() => setAdding(true)}>
            <IconPlus size={16} stroke={2.4} /> 운동 추가
          </Button>
        )}
      </div>

      {loading ? (
        <Card className="!p-10 text-center text-[13px] text-ink-500">불러오는 중...</Card>
      ) : rows.length === 0 ? (
        <Card className="!p-10 text-center">
          <div className="text-[14px] text-ink-500">아직 처방된 운동이 없습니다.</div>
          <Button variant="primary" size="md" className="mt-4" onClick={() => setAdding(true)}>
            <IconPlus size={16} /> 운동 추가
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {rows.map((r) => {
            const t = EXERCISE_TEMPLATES.find((e) => e.kind === r.kind);
            return (
              <Card key={r.id} className="!p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[10px] bg-navy text-white flex items-center justify-center">
                    {ICONS[r.kind]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[16px] font-bold text-navy">{t?.label}</div>
                      <div className="flex gap-1">
                        <button
                          className="w-8 h-8 rounded-full hover:bg-snow text-ink-500 flex items-center justify-center"
                          onClick={() => setEditing(r)}
                        >
                          <IconEdit size={14} />
                        </button>
                        <button
                          className="w-8 h-8 rounded-full hover:bg-red-light text-red flex items-center justify-center"
                          onClick={() => removePrescription(r.id)}
                        >
                          <IconTrash size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="text-[11px] text-ink-500 mt-1">{t?.description}</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  <Stat label="반복" value={`${r.reps}회`} />
                  <Stat label="세트" value={`${r.sets}세트`} />
                  <Stat label="일일 빈도" value={`${r.frequencyPerDay}회`} />
                  <Stat label="기간" value={`${r.durationWeeks}주`} />
                </div>
                <div className="mt-2 text-[11px] text-ink-500">시작일: {r.startedAt}</div>
              </Card>
            );
          })}
        </div>
      )}

      {/* 운동 추가 모달 */}
      <Modal open={adding} onClose={() => setAdding(false)} caption="ADD EXERCISE" title="운동 추가">
        <div className="grid grid-cols-1 gap-2">
          {availableToAdd.map((t) => (
            <button
              key={t.kind}
              onClick={() => addPrescription(t.kind)}
              className="flex items-center gap-3 p-4 border border-ink-200 rounded-card hover:border-navy/40 hover:bg-snow text-left"
            >
              <div className="w-10 h-10 rounded-[10px] bg-navy-faint text-navy flex items-center justify-center">
                {ICONS[t.kind]}
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-navy">{t.label}</div>
                <div className="text-[11px] text-ink-500">{t.description}</div>
              </div>
              <IconPlus size={18} className="text-ink-500" />
            </button>
          ))}
        </div>
      </Modal>

      {/* 처방 편집 모달 */}
      {editing && (
        <PrescriptionEditor
          open={!!editing}
          onClose={() => setEditing(null)}
          initial={editing}
          onSave={updatePrescription}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-snow border border-ink-200 rounded-btn py-2.5">
      <div className="text-[10px] text-ink-500 tracking-wide12 uppercase">{label}</div>
      <div className="text-[13px] font-bold text-navy fl-num mt-1">{value}</div>
    </div>
  );
}

function PrescriptionEditor({
  open, onClose, initial, onSave,
}: {
  open: boolean;
  onClose: () => void;
  initial: PrescriptionWithId;
  onSave: (row: PrescriptionWithId) => void;
}) {
  const [reps, setReps] = useState(initial.reps);
  const [sets, setSets] = useState(initial.sets);
  const [freq, setFreq] = useState(initial.frequencyPerDay);
  const [weeks, setWeeks] = useState(initial.durationWeeks);
  const t = EXERCISE_TEMPLATES.find((e) => e.kind === initial.kind);

  return (
    <Modal
      open={open}
      onClose={onClose}
      caption="EDIT PRESCRIPTION"
      title={`${t?.label ?? ""} 처방 편집`}
      footer={
        <>
          <Button variant="secondary" size="md" onClick={onClose}>취소</Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => onSave({ ...initial, reps, sets, frequencyPerDay: freq, durationWeeks: weeks })}
          >
            <IconCheck size={16} /> 저장
          </Button>
        </>
      }
    >
      <div className={cn("grid grid-cols-2 gap-3")}>
        <Input label="반복 횟수" value={String(reps)} type="number"
          onChange={(e) => setReps(Number(e.target.value) || 0)}
          trailing={<span className="text-[11px]">회</span>} />
        <Input label="세트 수" value={String(sets)} type="number"
          onChange={(e) => setSets(Number(e.target.value) || 0)}
          trailing={<span className="text-[11px]">세트</span>} />
        <Input label="일일 빈도" value={String(freq)} type="number"
          onChange={(e) => setFreq(Number(e.target.value) || 0)}
          trailing={<span className="text-[11px]">회/일</span>} />
        <Input label="처방 기간" value={String(weeks)} type="number"
          onChange={(e) => setWeeks(Number(e.target.value) || 0)}
          trailing={<span className="text-[11px]">주</span>} />
      </div>
    </Modal>
  );
}
