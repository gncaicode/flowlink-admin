import type { ExerciseTemplate, Prescription } from "@/types/domain";

export const EXERCISE_TEMPLATES: ExerciseTemplate[] = [
  {
    kind: "grip",
    label: "공쥐기",
    description:
      "탄성구를 일정 횟수만큼 반복적으로 쥐어 전완근을 자극하고 혈관에 자극을 주는 기본 운동",
    defaultReps: 20,
    defaultSets: 3,
    defaultFrequencyPerDay: 3,
  },
  {
    kind: "dumbbell",
    label: "덤벨 컬",
    description:
      "0.5~1kg 덤벨로 팔꿈치를 굽혔다 펴 상완근을 자극, 정맥 직경 성장 촉진",
    defaultReps: 12,
    defaultSets: 3,
    defaultFrequencyPerDay: 2,
  },
  {
    kind: "wrist_rotation",
    label: "혈류 모니터링",
    description:
      "운동 직후 손목 압맥감과 진동을 측정하여 혈류 변화를 자가 확인하는 보조 활동",
    defaultReps: 1,
    defaultSets: 1,
    defaultFrequencyPerDay: 1,
  },
];

export const PRESCRIPTIONS: Prescription[] = [
  {
    patientId: 1,
    kind: "grip",
    reps: 25,
    sets: 3,
    frequencyPerDay: 3,
    durationWeeks: 8,
    startedAt: "2026-04-27",
  },
  {
    patientId: 1,
    kind: "dumbbell",
    reps: 12,
    sets: 3,
    frequencyPerDay: 2,
    durationWeeks: 6,
    startedAt: "2026-05-04",
  },
  {
    patientId: 2,
    kind: "grip",
    reps: 20,
    sets: 3,
    frequencyPerDay: 3,
    durationWeeks: 8,
    startedAt: "2026-04-19",
  },
  {
    patientId: 3,
    kind: "grip",
    reps: 30,
    sets: 4,
    frequencyPerDay: 4,
    durationWeeks: 8,
    startedAt: "2026-04-03",
  },
  {
    patientId: 3,
    kind: "dumbbell",
    reps: 15,
    sets: 3,
    frequencyPerDay: 2,
    durationWeeks: 6,
    startedAt: "2026-04-10",
  },
  {
    patientId: 4,
    kind: "grip",
    reps: 20,
    sets: 3,
    frequencyPerDay: 3,
    durationWeeks: 8,
    startedAt: "2026-05-05",
  },
];
