import Link from "next/link";
import { FLSymbol } from "@/components/brand/FLSymbol";
import { FLWordmark } from "@/components/brand/FLWordmark";
import { FLDotPattern } from "@/components/brand/FLDotPattern";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-snow">
      {/* Left brand panel */}
      <aside className="hidden lg:flex w-[40%] xl:w-[44%] bg-navy text-white relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-60">
          <FLDotPattern width={900} height={900} opacity={0.5} />
        </div>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(45% 40% at 70% 25%, rgba(49,151,149,0.22) 0%, rgba(26,54,93,0) 70%)",
          }}
        />
        <Link href="/" className="relative flex items-center gap-2.5 z-10">
          <FLSymbol size={36} dark />
          <FLWordmark size={20} dark />
        </Link>

        <div className="relative z-10">
          <div
            className="text-[11px] font-semibold tracking-[0.22em] uppercase text-white/55"
          >
            FLOWLINK FOR CLINICIANS
          </div>
          <div
            className="mt-4 text-[40px] xl:text-[44px] font-bold leading-[1.08] tracking-tight"
            style={{ letterSpacing: "-0.02em" }}
          >
            완벽한 투석을 위한
            <br />
            <span className="text-teal">과학적 연결</span>
          </div>
          <p className="mt-5 text-[14px] text-white/70 leading-relaxed max-w-md">
            AVF 수술 환자의 혈관 성숙을 AI 자세 인식과 운동 데이터로
            정밀하게 추적합니다. 의료기관 단위로 가입하세요.
          </p>
        </div>

        <div className="relative z-10 text-[11px] text-white/40">
          © 2026 FlowLink Medical. 의료 데이터 암호화 저장 · ISO 27001
        </div>
      </aside>

      {/* Right form area */}
      <section className="flex-1 flex flex-col">
        <div className="lg:hidden p-6">
          <Link href="/" className="flex items-center gap-2">
            <FLSymbol size={28} />
            <FLWordmark size={16} />
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-[460px]">{children}</div>
        </div>
      </section>
    </div>
  );
}
