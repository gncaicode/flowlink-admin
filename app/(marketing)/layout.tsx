import Link from "next/link";
import { FLSymbol } from "@/components/brand/FLSymbol";
import { FLWordmark } from "@/components/brand/FLWordmark";
import { LinkButton } from "@/components/ui/Button";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-snow text-ink-700">
      <header className="absolute top-0 left-0 right-0 z-10 px-8 py-5 flex items-center justify-between text-white">
        <Link href="/" className="flex items-center gap-2.5">
          <FLSymbol size={32} dark />
          <FLWordmark size={20} dark />
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-medium">
          <a href="#features" className="text-white/80 hover:text-white">
            기능
          </a>
          <a href="#how" className="text-white/80 hover:text-white">
            동작 원리
          </a>
          <a href="#partners" className="text-white/80 hover:text-white">
            파트너 의료기관
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-[13px] font-semibold text-white/85 hover:text-white px-3 py-2"
          >
            로그인
          </Link>
          <LinkButton href="/signup" size="sm" variant="primary">
            기관 회원가입
          </LinkButton>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-navy text-white/60 py-12 px-8 mt-0">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FLSymbol size={28} dark />
              <FLWordmark size={16} dark />
            </div>
            <p className="text-[12px] leading-relaxed">
              완벽한 투석을 위한 과학적 연결.
              <br />
              AVF 수술 환자의 혈관 성숙을
              <br />
              AI로 모니터링합니다.
            </p>
          </div>
          <div>
            <div className="fl-caption text-white/40 mb-3">제품</div>
            <ul className="space-y-2 text-[12px]">
              <li>FlowLink 모바일</li>
              <li>FlowLink 의료진</li>
              <li>리서치 데이터셋</li>
            </ul>
          </div>
          <div>
            <div className="fl-caption text-white/40 mb-3">회사</div>
            <ul className="space-y-2 text-[12px]">
              <li>소개</li>
              <li>임상 연구</li>
              <li>채용</li>
            </ul>
          </div>
          <div>
            <div className="fl-caption text-white/40 mb-3">고객지원</div>
            <ul className="space-y-2 text-[12px]">
              <li>
                <Link href="/recover" className="hover:text-white">
                  아이디·비밀번호 찾기
                </Link>
              </li>
              <li>1:1 문의</li>
              <li>도움말 센터</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between text-[11px] gap-2">
          <span>© 2026 FlowLink Medical, Inc. All rights reserved.</span>
          <span className="text-white/40">
            의료기기 등록번호 · 식약처 인증 진행 중 (가상 데이터)
          </span>
        </div>
      </footer>
    </div>
  );
}
