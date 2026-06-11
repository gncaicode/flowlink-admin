"use client";
import { useEffect, useState } from "react";
import { useSessionStore, checkSessionValidity } from "@/lib/store/session";

export default function DebugPage() {
  const state = useSessionStore((s) => s);
  const [ls, setLs] = useState<string>("");
  const [ss, setSs] = useState<string>("");
  const [now, setNow] = useState<string>("");

  function refresh() {
    setLs(localStorage.getItem("fl-session") ?? "(없음)");
    setSs(sessionStorage.getItem("fl-session-active") ?? "(없음)");
    setNow(new Date().toLocaleTimeString());
  }

  useEffect(() => {
    refresh();
  }, [state]);

  return (
    <div style={{ fontFamily: "monospace", padding: 32, maxWidth: 800, margin: "0 auto" }}>
      <h1 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        🔍 자동로그인 디버그
      </h1>
      <p style={{ color: "#666", marginBottom: 24 }}>마지막 갱신: {now}</p>

      <button
        onClick={refresh}
        style={{ padding: "8px 16px", background: "#1a365d", color: "white", border: "none", borderRadius: 6, cursor: "pointer", marginBottom: 24 }}
      >
        새로고침
      </button>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#1a365d" }}>
          ① Zustand 스토어 상태
        </h2>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          {[
            ["_hasHydrated", String(state._hasHydrated)],
            ["authed", String(state.authed)],
            ["remember", String(state.remember)],
            ["email", state.email ?? "(없음)"],
            ["institutionId", state.institutionId ?? "(없음)"],
            ["token", state.token ? state.token.slice(0, 30) + "..." : "(없음)"],
          ].map(([key, val]) => (
            <tr key={key} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: "6px 12px", color: "#666", width: 160 }}>{key}</td>
              <td style={{ padding: "6px 12px", fontWeight: "bold", color: val === "true" ? "#38a169" : val === "false" ? "#e53e3e" : "#1a365d" }}>{val}</td>
            </tr>
          ))}
        </table>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#1a365d" }}>
          ② localStorage (fl-session)
        </h2>
        <pre style={{ background: "#f7f7f7", padding: 12, borderRadius: 6, fontSize: 11, overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
          {(() => {
            try { return JSON.stringify(JSON.parse(ls), null, 2); } catch { return ls; }
          })()}
        </pre>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#1a365d" }}>
          ③ sessionStorage (fl-session-active)
        </h2>
        <pre style={{ background: ss === "(없음)" ? "#fff5f5" : "#f0fff4", padding: 12, borderRadius: 6, fontSize: 13, color: ss === "(없음)" ? "#e53e3e" : "#38a169" }}>
          {ss === "(없음)" ? "❌ 없음 (브라우저 재시작됨 또는 remember=true로 로그인)" : "✅ 있음 (현재 세션 활성)"}
        </pre>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#1a365d" }}>
          ④ 판정
        </h2>
        <div style={{ padding: 16, borderRadius: 6, background: "#f7f7f7" }}>
          {!state._hasHydrated && (
            <p style={{ color: "#e53e3e" }}>⚠️ 아직 localStorage 로딩 중 (_hasHydrated=false)</p>
          )}
          {state._hasHydrated && !state.authed && (
            <p style={{ color: "#e53e3e" }}>❌ 로그인 안 됨 (authed=false)</p>
          )}
          {state._hasHydrated && state.authed && state.remember && (
            <p style={{ color: "#38a169" }}>✅ 자동로그인 ON — 브라우저 재시작 후에도 유지됨</p>
          )}
          {state._hasHydrated && state.authed && !state.remember && (
            <p style={{ color: "#dd6b20" }}>🔶 자동로그인 OFF — 브라우저 재시작 시 로그아웃됨</p>
          )}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8, color: "#1a365d" }}>
          ⑤ 직접 조작
        </h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={() => { checkSessionValidity(); refresh(); }}
            style={{ padding: "8px 16px", background: "#2b6cb0", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
          >
            checkSessionValidity() 실행
          </button>
          <button
            onClick={() => { useSessionStore.getState().logout(); refresh(); }}
            style={{ padding: "8px 16px", background: "#c53030", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
          >
            강제 로그아웃
          </button>
          <button
            onClick={() => { localStorage.clear(); sessionStorage.clear(); location.reload(); }}
            style={{ padding: "8px 16px", background: "#744210", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}
          >
            전체 초기화 (새로고침)
          </button>
        </div>
      </section>
    </div>
  );
}
