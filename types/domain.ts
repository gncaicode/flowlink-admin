export type PatientStatus = "active" | "watch" | "ready" | "inactive";

export type SurgeryLocation =
  | "좌측 요골동맥"
  | "우측 요골동맥"
  | "좌측 상완동맥"
  | "우측 상완동맥";

export type AnastomosisType = "단단 문합" | "단측 문합" | "측측 문합";

export type ExerciseKind = "grip" | "dumbbell" | "wrist_rotation" | "monitor";

export type Patient = {
  id: number;       // DB AUTO_INCREMENT (등록 전에는 0)
  pid: string;      // 화면 표시용 환자번호 (라우팅에 사용)
  name: string;
  age: number;
  gender: "M" | "F";
  surgeryDate: string;
  surgeryLocation: SurgeryLocation;
  anastomosis: AnastomosisType;
  surgeonName: string;
  baselineDiameterMm: number;
  baselineFlowMlMin: number;
  previousAvfHistory: "없음" | "1회" | "2회 이상";
  program?: string;
  adherence: number;
  status: PatientStatus;
  scheduled?: string;
  alert?: string;
  groupId?: string;
  createdAt: string;
};

export type ExerciseTemplate = {
  kind: ExerciseKind;
  label: string;
  description: string;
  defaultReps: number;
  defaultSets: number;
  defaultFrequencyPerDay: number;
};

export type Prescription = {
  patientId: number;
  kind: ExerciseKind;
  reps: number;
  sets: number;
  frequencyPerDay: number;
  durationWeeks: number;
  startedAt: string;
};

export type SessionFeedback = "perfect" | "minor" | "major";

export type Session = {
  id: number;
  patientId: number;
  date: string;
  kind: ExerciseKind;
  repsCompleted: number;
  repsTarget: number;
  postureScore: number;
  durationSec: number;
  feedback: SessionFeedback;
  landmarks: unknown[];
  totalSets?: number;
  setSeconds?: number;
  repTimestamps?: number[];
};

export type Institution = {
  id: number;
  name: string;
  department: string;
  manager: string;
};

export type Group = {
  id: string;
  name: string;
  patientIds: number[];
};
