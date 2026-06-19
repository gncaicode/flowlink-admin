export default function DeleteAccountPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* 헤더 */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-900 tracking-widest uppercase mb-2">FlowLink · 지앤씨</p>
          <h1 className="text-3xl font-bold text-gray-900">계정 삭제 요청</h1>
          <p className="mt-3 text-gray-500 text-sm leading-relaxed">
            FlowLink 앱 계정 삭제를 원하시면 아래 절차에 따라 요청해 주세요.
            담당자가 확인 후 영업일 기준 7일 이내에 처리해 드립니다.
          </p>
        </div>

        {/* 요청 절차 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">계정 삭제 요청 방법</h2>
          <div className="space-y-4">
            {[
              {
                step: "1단계",
                title: "이메일 발송",
                desc: (
                  <>
                    아래 주소로 이메일을 보내주세요.{" "}
                    <a
                      href="mailto:gncai.contact@gmail.com"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      gncai.contact@gmail.com
                    </a>
                  </>
                ),
              },
              {
                step: "2단계",
                title: "제목 작성",
                desc: '이메일 제목에 "계정 삭제 요청" 이라고 기재해 주세요.',
              },
              {
                step: "3단계",
                title: "아이디 기재",
                desc: "본문에 앱 로그인 시 사용한 아이디(사용자 ID)를 입력해 주세요.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50">
                <div className="shrink-0 w-20 text-xs font-bold text-blue-700 pt-0.5">{step}</div>
                <div>
                  <div className="font-semibold text-gray-900 mb-0.5">{title}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ※ 처리 기간: 접수일로부터 <strong>영업일 기준 7일 이내</strong>
          </p>
        </section>

        {/* 삭제되는 데이터 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">삭제되는 데이터</h2>
          <p className="text-sm text-gray-500 mb-3">계정 삭제 시 아래 데이터가 모두 영구 삭제됩니다.</p>
          <ul className="space-y-2">
            {[
              "아이디, 이름, 나이, 성별",
              "운동 기록 (세션 데이터 전체)",
              "신체 관절 랜드마크 좌표 데이터",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 보관 데이터 */}
        <section className="mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">보관 데이터 및 기간</h2>
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600 leading-relaxed">
            관계 법령에 따라 보존이 필요한 데이터는 해당 법령에서 정한 기간 동안 보관 후 파기합니다.
          </div>
        </section>

        {/* 푸터 */}
        <div className="pt-6 border-t border-gray-200 text-xs text-gray-400">
          <p>운영사: 지앤씨 | 서비스명: FlowLink</p>
          <p className="mt-1">문의: gncai.contact@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
