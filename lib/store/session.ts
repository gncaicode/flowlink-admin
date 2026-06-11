"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const SESSION_FLAG = "fl-session-active";

type SessionState = {
  _hasHydrated: boolean;
  authed: boolean;
  email: string | null;
  institutionId: number | null;
  institutionName: string | null;
  token: string | null;
  remember: boolean;
  login: (params: {
    email: string;
    institutionId?: number | null;
    institutionName?: string | null;
    token: string;
    remember?: boolean;
  }) => void;
  logout: () => void;
  getAuthHeader: () => Record<string, string>;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      authed: false,
      email: null,
      institutionId: null,
      institutionName: null,
      token: null,
      remember: false,

      login: ({ email, institutionId, institutionName, token, remember = false }) => {
        if (!remember) {
          sessionStorage.setItem(SESSION_FLAG, "1");
        } else {
          sessionStorage.removeItem(SESSION_FLAG);
        }
        set({ authed: true, email, institutionId: institutionId ?? null, institutionName: institutionName ?? null, token, remember });
      },

      logout: () => {
        sessionStorage.removeItem(SESSION_FLAG);
        set({ authed: false, email: null, institutionId: null, institutionName: null, token: null, remember: false });
      },

      getAuthHeader: () => {
        const token = get().token;
        return token ? { Authorization: `Bearer ${token}` } : ({} as Record<string, string>);
      },
    }),
    {
      name: "fl-session",
      partialize: (state) => ({
        authed: state.authed,
        email: state.email,
        institutionId: state.institutionId,
        institutionName: state.institutionName,
        token: state.token,
        remember: state.remember,
      }),
    },
  ),
);

if (typeof window !== "undefined") {
  useSessionStore.persist.onFinishHydration(() => {
    useSessionStore.setState({ _hasHydrated: true });
  });

  if (useSessionStore.persist.hasHydrated()) {
    useSessionStore.setState({ _hasHydrated: true });
  }
}

export function checkSessionValidity() {
  const state = useSessionStore.getState();
  if (state.authed && !state.remember) {
    const flag = sessionStorage.getItem(SESSION_FLAG);
    if (!flag) {
      state.logout();
      return false;
    }
  }
  return state.authed;
}
