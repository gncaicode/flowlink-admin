import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import {
  IconScanEye,
  IconChartLine,
  IconStethoscope,
  IconActivityHeartbeat,
  IconHandGrab,
  IconBarbell,
  IconArrowRight,
  IconShieldCheck,
  IconReportMedical,
  IconBellRinging,
} from "@tabler/icons-react";
import { FLSymbol } from "@/components/brand/FLSymbol";
import { FLWordmark } from "@/components/brand/FLWordmark";
import { FLDotPattern } from "@/components/brand/FLDotPattern";
import { Caption } from "@/components/ui/Caption";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MaturityBar } from "@/components/ui/MaturityBar";
import { Badge } from "@/components/ui/Badge";

export default function PromotionPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-navy text-white overflow-hidden">
        <div className="absolute inset-0 opacity-60">
          <FLDotPattern width={1400} height={700} opacity={0.5} />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 70% 30%, rgba(49,151,149,0.18) 0%, rgba(26,54,93,0) 70%), radial-gradient(40% 40% at 20% 80%, rgba(229,62,62,0.18) 0%, rgba(26,54,93,0) 70%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-8 pt-36 pb-32 grid lg:grid-cols-[1.1fr,1fr] gap-12 items-center">
          <div>
            <Caption tone="white" className="text-teal/90 tracking-wide22">
              FOR CLINICIANS · CLINICAL DASHBOARD
            </Caption>
            <h1
              className="mt-5 text-[44px] md:text-[56px] font-bold leading-[1.05] tracking-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              완벽한 투석을 위한
              <br />
              <span className="text-teal">과학적 연결</span>
            </h1>
            <p className="mt-6 text-[16px] text-white/75 leading-relaxed max-w-[520px]">
              AVF 수술 환자의 혈관 성숙을 AI 자세 인식과 운동 데이터로 정밀하게
              추적합니다. 의료진은 한 화면에서 코호트 전체를 진단하고, 운동 처방을
              관리하세요.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <LinkButton href="/signup" size="lg" variant="primary">
                기관 회원가입 <IconArrowRight size={18} />
              </LinkButton>
              <LinkButton
                href="/login"
                size="lg"
                variant="secondary"
                className="!bg-transparent !text-white !border-white/30 hover:!bg-white/10"
              >
                로그인
              </LinkButton>
            </div>
            <div className="mt-10 flex items-center gap-8 text-[12px] text-white/55">
              <div className="flex items-center gap-2">
                <IconShieldCheck size={16} className="text-teal" />
                <span>의료 데이터 암호화 저장</span>
              </div>
              <div className="flex items-center gap-2">
                <IconActivityHeartbeat size={16} className="text-teal" />
                <span>실시간 자세 피드백</span>
              </div>
              <div className="flex items-center gap-2">
                <IconReportMedical size={16} className="text-teal" />
                <span>임상 리포트 자동 생성</span>
              </div>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-[28px] opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, rgba(49,151,149,0.45) 0%, rgba(26,54,93,0) 100%)",
              }}
            />
            <div className="relative rounded-[20px] bg-white text-ink-700 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FLSymbol size={28} />
                  <FLWordmark size={16} />
                </div>
                <Badge tone="info" label="CLINICIAN" showDot={false} />
              </div>
              <div className="mt-4">
                <Caption>PATIENT ROSTER · 3F 신장내과</Caption>
                <div className="mt-2 flex items-baseline gap-2">
                  <div className="text-[22px] font-bold text-navy tracking-tight">
                    대상자 관리
                  </div>
                  <span className="text-[12px] text-ink-500">
                    총 <b className="text-navy">24명</b>
                  </span>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  { name: "김선영", pid: "P-2026-04812", m: 64, st: "active" as const },
                  { name: "이재호", pid: "P-2026-04787", m: 48, st: "watch" as const },
                  { name: "박미경", pid: "P-2026-04779", m: 89, st: "ready" as const },
                ].map((p) => (
                  <div
                    key={p.pid}
                    className="border-[0.5px] border-ink-200 rounded-card p-3.5 flex items-center gap-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-[10px] flex items-center justify-center font-bold ${
                        p.st === "watch"
                          ? "bg-red-light text-red"
                          : "bg-navy-faint text-navy"
                      }`}
                    >
                      {p.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy text-[13px]">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-ink-500 fl-num">
                          {p.pid}
                        </span>
                      </div>
                      <MaturityBar
                        value={p.m}
                        size="sm"
                        showLabel={false}
                        className="mt-2"
                      />
                    </div>
                    <Badge tone={p.st} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section id="features" className="px-8 py-24 bg-snow">
        <div className="max-w-6xl mx-auto">
          <Caption>WHY FLOWLINK</Caption>
          <h2 className="mt-3 text-[32px] md:text-[40px] font-bold text-navy tracking-tight max-w-2xl">
            국내 유일의 AVF 특화
            <br />
            <span className="text-red">AI 모니터링 플랫폼</span>
          </h2>
          <p className="mt-4 text-[15px] text-ink-500 max-w-2xl leading-relaxed">
            환자의 운동 수행도, 자세 정확도, 혈관 성숙도를 한 곳에서. 시간만 잡아먹던
            진료 전 챠트 정리를 AI가 대신합니다.
          </p>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <IconScanEye size={22} stroke={1.6} />,
                title: "AI 자세 감지",
                desc: "21점 손 랜드마크 추적으로 공쥐기·덤벨컬 자세를 실시간 분석합니다.",
              },
              {
                icon: <IconChartLine size={22} stroke={1.6} />,
                title: "정량적 횟수 카운팅",
                desc: "동작 인식 기반 반복 횟수 자동 카운트, 데이터 위·변조 없이 기록.",
              },
              {
                icon: <IconStethoscope size={22} stroke={1.6} />,
                title: "의료진 대시보드",
                desc: "전체 코호트의 성숙도·순응도·알림을 단일 화면으로 빠르게 진단합니다.",
              },
              {
                icon: <IconActivityHeartbeat size={22} stroke={1.6} />,
                title: "AVF 특화 설계",
                desc: "수술 부위·문합 유형·혈관 직경을 반영한 맞춤 운동 처방.",
              },
            ].map((f) => (
              <Card key={f.title} className="!p-6">
                <div className="w-10 h-10 rounded-[10px] bg-navy-faint text-navy flex items-center justify-center">
                  {f.icon}
                </div>
                <div className="mt-4 text-[15px] font-bold text-navy">
                  {f.title}
                </div>
                <p className="mt-2 text-[13px] text-ink-500 leading-relaxed">
                  {f.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-8 py-24 bg-white border-t border-ink-200">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr,1.1fr] gap-14 items-center">
          <div>
            <Caption>HOW IT WORKS</Caption>
            <h2 className="mt-3 text-[32px] md:text-[40px] font-bold text-navy tracking-tight">
              환자는 휴대폰으로 운동,
              <br />
              <span className="text-teal">의료진은 데스크톱으로 진단.</span>
            </h2>
            <ol className="mt-9 space-y-7">
              {[
                {
                  icon: <IconHandGrab size={22} />,
                  title: "AVF 수술 환자 등록",
                  desc: "수술 정보, 기저 혈관 직경·혈류량을 입력해 환자를 등록하면, FlowLink 모바일 앱에 자동 연동됩니다.",
                },
                {
                  icon: <IconBarbell size={22} />,
                  title: "운동 처방 & 측정",
                  desc: "공쥐기·덤벨컬 운동을 처방하면, 환자는 모바일 앱의 카메라로 자세를 측정하며 운동합니다.",
                },
                {
                  icon: <IconReportMedical size={22} />,
                  title: "성숙도 추적 & 알림",
                  desc: "AI가 일별 수행 데이터를 누적해 혈관 성숙도를 추정하고, 미수행·자세 저하 환자를 자동 알림합니다.",
                },
              ].map((s, i) => (
                <li key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-navy flex items-center gap-2">
                      <span className="text-teal">{s.icon}</span>
                      {s.title}
                    </div>
                    <p className="mt-1 text-[13px] text-ink-500 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Stat cards mock */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="!p-5">
              <Caption>주간 평균 자세 정확도</Caption>
              <div className="mt-2 text-[40px] font-bold text-navy fl-num leading-none">
                87
                <span className="text-[18px] text-teal ml-1">%</span>
              </div>
              <div className="mt-3 text-[11px] text-ink-500">전주 대비 +4%p</div>
            </Card>
            <Card className="!p-5">
              <Caption>총 측정 세션</Caption>
              <div className="mt-2 text-[40px] font-bold text-navy fl-num leading-none">
                312
              </div>
              <div className="mt-3 text-[11px] text-ink-500">이번 달 누적</div>
            </Card>
            <Card className="col-span-2 !p-5">
              <div className="flex items-center justify-between">
                <Caption>관찰 필요 환자</Caption>
                <Badge tone="watch" label="3건" />
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { name: "이재호", reason: "3일 연속 미수행", time: "2시간 전" },
                  { name: "한상호", reason: "자세 정확도 58%", time: "5시간 전" },
                  { name: "차동현", reason: "운동 누락 4일", time: "어제" },
                ].map((r) => (
                  <div
                    key={r.name}
                    className="flex items-center gap-3 py-2 border-b last:border-b-0 border-ink-200"
                  >
                    <IconBellRinging size={16} className="text-red" />
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-navy">
                        {r.name}
                      </div>
                      <div className="text-[11px] text-ink-500">{r.reason}</div>
                    </div>
                    <div className="text-[10px] text-ink-500">{r.time}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 bg-snow">
        <div className="max-w-4xl mx-auto text-center">
          <FLSymbol size={56} className="mx-auto" />
          <h2 className="mt-6 text-[28px] md:text-[36px] font-bold text-navy tracking-tight">
            귀 기관의 AVF 케어를
            <br />
            <span className="text-red">데이터로 증명</span>하세요.
          </h2>
          <p className="mt-4 text-[14px] text-ink-500 leading-relaxed max-w-xl mx-auto">
            기관 회원가입 후 5분이면 첫 환자를 등록하고 모니터링을 시작할 수 있습니다.
            도입 문의는 1:1 문의를 이용해 주세요.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <LinkButton href="/signup" size="lg" variant="primary">
              기관 회원가입 <IconArrowRight size={18} />
            </LinkButton>
            <Link
              href="/login"
              className="text-[14px] font-semibold text-navy underline-offset-4 hover:underline"
            >
              이미 계정이 있나요?
            </Link>
          </div>

          {/* 환자 앱 QR */}
          <div className="mt-14 inline-flex flex-col items-center gap-4 bg-white border border-ink-200 rounded-[20px] px-8 py-6 shadow-sm">
            <p className="text-[12px] font-semibold text-ink-500 tracking-widest uppercase">Google Play</p>
            <QRCodeSVG
              value="https://play.google.com/store/apps/details?id=com.gncaitech.flowlink"
              size={120}
              bgColor="#ffffff"
              fgColor="#1a364d"
              level="M"
            />
            <p className="text-[12px] text-ink-500 leading-relaxed text-center max-w-[200px]">
              환자에게 QR코드를 스캔하게 하여<br />FlowLink 앱을 설치하세요.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
