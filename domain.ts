export type PatientStatus = "active" | "watch" | "ready" | "inactive";

export type SurgeryLocation =
  | "좌측 요골동맥"
  | "우측 요골동맥"
  | "좌측 상완동맥"
  | "우측 상완동맥";

export type AnastomosisType = "단단 문합" | "단측 문합" | "측측 문합";

export type ExerciseKind = "grip" | "dumbbell" | "wrist_rotation";

export type Patient = {
  id: string;
  pid: string;
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
  maturity: number;
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
  patientId: string;
  kind: ExerciseKind;
  reps: number;
  sets: number;
  frequencyPerDay: number;
  durationWeeks: number;
  startedAt: string;
};

export type SessionFeedback = "perfect" | "minor" | "major";

export type Session = {
  id: string;
  patientId: string;
  date: string;
  kind: ExerciseKind;
  repsCompleted: number;
  repsTarget: number;
  postureScore: number;
  durationSec: number;
  feedback: SessionFeedback;
  landmarks: number[];
};

export type Institution = {
  id: string;
  name: string;
  department: string;
  manager: string;
};

export type Group = {
  id: string;
  name: string;
  patientIds: string[];
};
