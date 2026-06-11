"use client";
import { create } from "zustand";
import type { Session } from "@/types/domain";
import { useSessionStore } from "@/lib/store/session";

function authHeader(): Record<string, string> {
  const token = useSessionStore.getState().token;
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

type State = {
  sessions: Session[];
  total: number;
  loading: boolean;
  fetchForPatient: (patientId: number) => Promise<void>;
  remove: (id: number) => Promise<void>;
};

export const useSessionsStore = create<State>()((set) => ({
  sessions: [],
  total: 0,
  loading: false,

  fetchForPatient: async (patientId: number) => {
    set({ loading: true });
    try {
      const res = await fetch(`/api/sessions?patientId=${patientId}&limit=100`, {
        headers: authHeader(),
      });
      if (!res.ok) return;
      const data = await res.json() as { data: Session[]; total: number };
      set({ sessions: data.data, total: data.total });
    } finally {
      set({ loading: false });
    }
  },

  remove: async (id: number) => {
    const res = await fetch(`/api/sessions/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    });
    if (!res.ok) throw new Error("세션 삭제에 실패했습니다.");
    set((s) => ({ sessions: s.sessions.filter((x) => x.id !== id) }));
  },
}));
