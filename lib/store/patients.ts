"use client";
import { create } from "zustand";
import type { Patient } from "@/types/domain";
import { useSessionStore } from "@/lib/store/session";

function authHeader(): Record<string, string> {
  const token = useSessionStore.getState().token;
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

type State = {
  patients: Patient[];
  loaded: boolean;
  fetch: () => Promise<void>;
  add: (p: Omit<Patient, "id"> & { password?: string }) => Promise<void>;
  update: (id: number, patch: Partial<Patient>) => Promise<void>;
  remove: (id: number) => Promise<void>;
};

export const usePatientsStore = create<State>()((set) => ({
  patients: [],
  loaded: false,

  fetch: async () => {
    const res = await fetch("/api/patients", { headers: authHeader() });
    if (!res.ok) return;
    const data: Patient[] = await res.json();
    set({ patients: data, loaded: true });
  },

  add: async (p) => {
    const res = await fetch("/api/patients", {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(p),
    });
    if (!res.ok) throw new Error("환자 등록에 실패했습니다.");
    // 서버에서 id를 AUTO_INCREMENT로 부여하므로 재조회
    const allRes = await fetch("/api/patients", { headers: authHeader() });
    if (allRes.ok) {
      const data: Patient[] = await allRes.json();
      set({ patients: data, loaded: true });
    }
  },

  update: async (id, patch) => {
    const res = await fetch(`/api/patients/${id}`, {
      method: "PATCH",
      headers: authHeader(),
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error("환자 정보 수정에 실패했습니다.");
    set((s) => ({
      patients: s.patients.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  },

  remove: async (id) => {
    const res = await fetch(`/api/patients/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    if (!res.ok) throw new Error("환자 삭제에 실패했습니다.");
    set((s) => ({ patients: s.patients.filter((p) => p.id !== id) }));
  },
}));
