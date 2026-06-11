"use client";
import { useEffect, useState } from "react";
import { IconBuildingHospital, IconUser, IconLock, IconPhone, IconId } from "@tabler/icons-react";
import { Card } from "@/components/ui/Card";
import { Caption } from "@/components/ui/Caption";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useSessionStore } from "@/lib/store/session";

type UserInfo = {
  email: string;
  institutionName: string;
  department: string;
  managerName: string;
};

export default function SettingsPage() {
  const token = useSessionStore((s) => s.token);
  const updateSession = useSessionStore((s) => s.login);
  const sessionEmail = useSessionStore((s) => s.email);
  const sessionInstitutionId = useSessionStore((s) => s.institutionId);
  const authHeader = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const [info, setInfo] = useState<UserInfo>({ email: "", institutionName: "", department: "", managerName: "" });
  const [institutionName, setInstitutionName] = useState("");
  const [department, setDepartment] = useState("");
  const [bizNumber, setBizNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [managerName, setManagerName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [institutionSaving, setInstitutionSaving] = useState(false);
  const [accountSaving, setAccountSaving] = useState(false);
  const [institutionMsg, setInstitutionMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [accountMsg, setAccountMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/users/me", { headers: authHeader })
      .then((r) => r.json())
      .then((d: UserInfo) => {
        setInfo(d);
        setInstitutionName(d.institutionName ?? "");
        setDepartment(d.department ?? "");
        setManagerName(d.managerName ?? "");
      })
      .catch(console.error);

    fetch("/api/institution", { headers: authHeader })
      .then((r) => r.json())
      .then((d: { bizNumber?: string; phone?: string }) => {
        setBizNumber(d.bizNumber ?? "");
        setPhone(d.phone ?? "");
      })
      .catch(console.error);
  }, [token]);

  async function saveInstitution() {
    setInstitutionSaving(true);
    setInstitutionMsg(null);
    try {
      const res = await fetch("/api/institution", {
        method: "PATCH",
        headers: authHeader,
        body: JSON.stringify({ name: institutionName, department, bizNumber, phone }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setInstitutionMsg({ type: "ok", text: "저장되었습니다." });
      updateSession({ email: sessionEmail!, institutionId: sessionInstitutionId, institutionName, token: token! });
    } catch (e) {
      setInstitutionMsg({ type: "err", text: e instanceof Error ? e.message : "저장 실패" });
    } finally {
      setInstitutionSaving(false);
    }
  }

  async function saveAccount() {
    setAccountSaving(true);
    setAccountMsg(null);
    if (newPassword && newPassword !== confirmPassword) {
      setAccountMsg({ type: "err", text: "새 비밀번호가 일치하지 않습니다." });
      setAccountSaving(false);
      return;
    }
    if (newPassword && newPassword.length < 8) {
      setAccountMsg({ type: "err", text: "비밀번호는 8자 이상이어야 합니다." });
      setAccountSaving(false);
      return;
    }
    try {
      const body: Record<string, string> = { managerName };
      if (newPassword) { body.currentPassword = currentPassword; body.newPassword = newPassword; }
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: authHeader,
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setAccountMsg({ type: "ok", text: "저장되었습니다." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      setAccountMsg({ type: "err", text: e instanceof Error ? e.message : "저장 실패" });
    } finally {
      setAccountSaving(false);
    }
  }

  return (
    <div>
      <Caption>SETTINGS</Caption>
      <h1 className="mt-2 text-[28px] font-bold text-navy tracking-tight">기관 설정</h1>
      <p className="mt-1 text-[13px] text-ink-500">기관 프로필과 담당자 계정 정보를 관리합니다.</p>

      <div className="mt-7 grid lg:grid-cols-2 gap-5 max-w-4xl">
        {/* 기관 프로필 */}
        <Card className="!p-6">
          <Caption>INSTITUTION PROFILE</Caption>
          <div className="mt-1 text-[16px] font-bold text-navy">기관 프로필</div>
          <div className="mt-5 flex flex-col gap-4">
            <Input
              label="기관명"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              leading={<IconBuildingHospital size={16} />}
            />
            <Input
              label="진료과 / 부서"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <Input
              label="사업자 등록번호"
              value={bizNumber}
              onChange={(e) => setBizNumber(e.target.value)}
              leading={<IconId size={16} />}
              placeholder="000-00-00000"
            />
            <Input
              label="기관 연락처"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^0-9-]/g, ""))}
              leading={<IconPhone size={16} />}
              placeholder="02-0000-0000"
            />
          </div>
          {institutionMsg && (
            <div className={`mt-3 text-[12px] font-semibold ${institutionMsg.type === "ok" ? "text-teal" : "text-red"}`}>
              {institutionMsg.text}
            </div>
          )}
          <div className="mt-5 flex justify-end">
            <Button size="md" onClick={saveInstitution} disabled={institutionSaving}>
              {institutionSaving ? "저장 중..." : "변경사항 저장"}
            </Button>
          </div>
        </Card>

        {/* 담당자 계정 */}
        <Card className="!p-6">
          <Caption>ACCOUNT</Caption>
          <div className="mt-1 text-[16px] font-bold text-navy">담당자 계정</div>
          <div className="mt-5 flex flex-col gap-4">
            <Input
              label="담당자 이름"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              leading={<IconUser size={16} />}
            />
            <Input
              label="기관 이메일"
              value={info.email}
              leading={<IconUser size={16} />}
              type="email"
              disabled
            />
            <Input
              label="현재 비밀번호"
              placeholder="비밀번호 변경 시 입력"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              leading={<IconLock size={16} />}
              type="password"
            />
            <Input
              label="새 비밀번호"
              placeholder="변경하지 않으려면 비워두세요"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leading={<IconLock size={16} />}
              type="password"
            />
            <Input
              label="새 비밀번호 확인"
              placeholder="새 비밀번호를 다시 입력"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leading={<IconLock size={16} />}
              type="password"
            />
          </div>
          {accountMsg && (
            <div className={`mt-3 text-[12px] font-semibold ${accountMsg.type === "ok" ? "text-teal" : "text-red"}`}>
              {accountMsg.text}
            </div>
          )}
          <div className="mt-5 flex justify-end">
            <Button size="md" onClick={saveAccount} disabled={accountSaving}>
              {accountSaving ? "저장 중..." : "변경사항 저장"}
            </Button>
          </div>
        </Card>

        {/* Danger zone */}
        <Card className="!p-6 lg:col-span-2 border-red/20">
          <Caption className="!text-red">DANGER ZONE</Caption>
          <div className="mt-1 text-[16px] font-bold text-navy">기관 계정 해지</div>
          <p className="mt-2 text-[12px] text-ink-500 leading-relaxed">
            계정 해지 시 등록된 모든 환자 데이터에 대한 접근이 영구적으로 중단됩니다.
            진행 전 임상 리포트를 백업하세요.
          </p>
          <Button variant="danger" size="md" className="mt-4"
            onClick={() => alert("계정 해지는 관리자에게 문의해 주세요.")}>
            해지 요청
          </Button>
        </Card>
      </div>
    </div>
  );
}
