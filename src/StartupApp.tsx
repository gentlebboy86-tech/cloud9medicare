import { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Users,
  Activity,
  Award,
  ArrowRight,
  Phone,
  CheckCircle2,
  FileText,
  ClipboardCheck,
  Building,
  TrendingUp,
  AlertTriangle,
  Gift,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// 창업 컨설팅 전용 랜딩페이지 (/startup)
// 메타 광고 트래픽 전용 — 광고 메시지("지정심사부터 막힙니다")와 1:1 일치
// ─────────────────────────────────────────────────────────────

const BRAND_BLUE = '#0072BC';
const KAKAO_URL = 'http://pf.kakao.com/_bvZtG';
const PHONE = '1688-9739';

// 메타 픽셀 ID를 발급받으면 여기에 입력하세요 (비어 있으면 픽셀 코드가 실행되지 않습니다)
const META_PIXEL_ID = '';

const formatPhoneNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
};

const trackLead = () => {
  const w = window as any;
  if (typeof w.fbq === 'function') w.fbq('track', 'Lead');
};

const initPixel = () => {
  if (!META_PIXEL_ID) return;
  const w = window as any;
  if (w.fbq) return;
  const n: any = (w.fbq = function (...args: any[]) {
    n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
  });
  if (!w._fbq) w._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  const t = document.createElement('script');
  t.async = true;
  t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(t);
  w.fbq('init', META_PIXEL_ID);
  w.fbq('track', 'PageView');
};

const scrollToForm = () => {
  document.getElementById('startup-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ── 상담 신청 폼 ──────────────────────────────────────────────
const StartupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: '',
    region: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const interests = ['방문요양', '주간보호', '둘 다 고민 중'];

  const handleSubmit = () => {
    setErrorMsg('');
    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('이름과 전화번호를 입력해 주세요.');
      return;
    }
    if (!formData.interest) {
      setErrorMsg('관심 창업 분야를 선택해 주세요.');
      return;
    }
    setIsSubmitting(true);

    requestAnimationFrame(() => {
      fetch('https://formsubmit.co/ajax/medicare@cloud9sol.co.kr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: '[창업 컨설팅] 새로운 무료 상담 신청',
          _template: 'table',
          _captcha: 'false',
          이름: formData.name,
          전화번호: formData.phone,
          '관심 창업 분야': formData.interest,
          '희망 창업 지역': formData.region || '기재하지 않음',
          '문의 사항': formData.message || '기재하지 않음',
          '유입 경로': window.location.href,
        }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (res.ok && data.success) {
            trackLead();
            setSuccess(true);
            setFormData({ name: '', phone: '', interest: '', region: '', message: '' });
          } else {
            setErrorMsg(data.message || '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
          }
        })
        .catch(() => setErrorMsg('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.'))
        .finally(() => setIsSubmitting(false));
    });
  };

  if (success) {
    return (
      <div className="bg-white rounded-3xl p-8 md:p-10 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-3">상담 신청이 완료되었습니다</h3>
        <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-6">
          영업일 기준 24시간 이내에 담당 컨설턴트가 연락드립니다.
          <br />
          약속드린 <strong className="text-slate-800">지정심사 준비 체크리스트</strong>는 상담 시 함께 전달해 드립니다.
        </p>
        <a
          href={`tel:${PHONE}`}
          className="inline-flex items-center gap-2 text-[#0072BC] font-black hover:underline"
        >
          <Phone className="w-4 h-4" /> 급하시면 지금 전화주세요: {PHONE}
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">이름 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="성함을 입력해 주세요"
            className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-[15px] font-semibold text-slate-900 outline-none transition focus:border-[#0072BC] focus:ring-4 focus:ring-[#0072BC]/10"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">전화번호 *</label>
          <input
            type="tel"
            inputMode="numeric"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
            placeholder="010-0000-0000"
            className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-[15px] font-semibold text-slate-900 outline-none transition focus:border-[#0072BC] focus:ring-4 focus:ring-[#0072BC]/10"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">관심 창업 분야 *</label>
          <div className="grid grid-cols-3 gap-2">
            {interests.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFormData({ ...formData, interest: item })}
                className={`h-11 rounded-xl text-xs md:text-sm font-bold transition-all border ${
                  formData.interest === item
                    ? 'bg-[#0072BC] text-white border-[#0072BC] shadow-lg shadow-[#0072BC]/25'
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-[#0072BC]/40'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            희망 창업 지역 <span className="text-slate-400 font-medium">(선택)</span>
          </label>
          <input
            type="text"
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            placeholder="예: 부산 수영구"
            className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-[15px] font-semibold text-slate-900 outline-none transition focus:border-[#0072BC] focus:ring-4 focus:ring-[#0072BC]/10"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            문의 사항 <span className="text-slate-400 font-medium">(선택)</span>
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="현재 준비 단계, 궁금하신 점을 자유롭게 적어주세요"
            rows={3}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-[15px] font-semibold text-slate-900 outline-none transition focus:border-[#0072BC] focus:ring-4 focus:ring-[#0072BC]/10 resize-none"
          />
        </div>

        {errorMsg && (
          <p className="text-sm font-bold text-red-500 bg-red-50 rounded-xl px-4 py-3">{errorMsg}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-14 rounded-2xl bg-[#0072BC] text-white text-base md:text-lg font-black shadow-xl shadow-[#0072BC]/25 transition-all hover:bg-[#005f9d] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
        >
          {isSubmitting ? '전송 중...' : (
            <>
              무료 창업 상담 신청하기 <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        <p className="text-[11px] text-slate-400 text-center leading-relaxed">
          입력하신 정보는 상담 목적으로만 사용되며 안전하게 보호됩니다.
        </p>
      </div>
    </div>
  );
};

// ── 메인 페이지 ──────────────────────────────────────────────
export default function StartupApp() {
  useEffect(() => {
    document.title = '방문요양·주간보호 창업 컨설팅 | 클라우드나인 메디케어';
    initPixel();
  }, []);

  const painPoints = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: '지정제 심사, 서류부터 막힙니다',
      desc: '급여제공지침 10종, 사업계획서, 지자체마다 다른 심사 기준. 서류 하나만 어긋나도 반려되어 개원이 몇 달씩 늦어집니다.',
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: '인력·시설 요건이 복잡합니다',
      desc: '시설장 자격 요건, 상근 인력 확보, 독립 사무실 기준까지. 혼자 알아보면 알수록 기준이 헷갈리고 확신이 서지 않습니다.',
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: '개소 후 운영은 더 막막합니다',
      desc: '공단 수가 청구, 일지 작성, 어르신 모집까지. 지정을 받아도 운영 노하우가 없으면 첫 1년을 버티기 어렵습니다.',
    },
  ];

  const solutions = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-med-cyan" />,
      title: '지정제 심사 밀착 지원',
      desc: '지정 심사 서류 작성부터 심사위원회 질문 시뮬레이션까지, 본사 베테랑 팀이 합격까지 밀착 동행합니다.',
    },
    {
      icon: <Users className="w-6 h-6 text-med-cyan" />,
      title: '전국 2만 명 인력 네트워크',
      desc: '본사가 검증한 대규모 요양보호사·간병인 DB로 개설 초기 구인난 걱정을 원천 해결합니다.',
    },
    {
      icon: <Activity className="w-6 h-6 text-med-cyan" />,
      title: '스마트 행정 자동화 솔루션',
      desc: '수작업 일지 작성과 공단 청구 절차를 시스템화하여 1인 원장도 50인 이상 운영이 가능합니다.',
    },
    {
      icon: <Award className="w-6 h-6 text-med-cyan" />,
      title: '브랜드 파워 & 개소 마케팅',
      desc: '지역 타겟 온라인 광고와 정밀 브랜딩 솔루션을 무상 지원하여 오픈 첫 달 어르신 유치를 선점합니다.',
    },
  ];

  const processSteps = [
    { step: '01', title: '무료 상담 · 입지 분석', desc: '희망 지역의 수요·경쟁 현황을 분석하고 준비 단계에 맞는 로드맵을 제시합니다.' },
    { step: '02', title: '지정심사 준비', desc: '서류 꾸러미 작성·검수부터 대면 평가 시뮬레이션까지 심사 전 과정을 함께합니다.' },
    { step: '03', title: '인력 · 시설 셋팅', desc: '시설장 요건 검토, 상근 인력 매칭, 사무실 기준 충족까지 개설 요건을 완성합니다.' },
    { step: '04', title: '개소 후 운영 안정화', desc: '수가 청구, 행정 자동화, 어르신 모집 마케팅으로 운영 궤도 진입을 돕습니다.' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* ── 상단 헤더 ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="클라우드나인 메디케어" className="h-24 -my-6 object-contain" />
            <span className="text-sm md:text-base font-black tracking-tight text-[#0072BC]">
              클라우드나인 메디케어
            </span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${PHONE}`}
              className="hidden md:flex items-center gap-2 text-slate-700 font-black text-sm hover:text-[#0072BC] transition-colors"
            >
              <Phone className="w-4 h-4" /> {PHONE}
            </a>
            <button
              onClick={scrollToForm}
              className="rounded-full bg-[#0072BC] px-4 md:px-5 py-2.5 text-xs md:text-sm font-black text-white shadow-lg shadow-[#0072BC]/20 transition-all hover:-translate-y-0.5 hover:bg-[#005f9d]"
            >
              무료 상담 신청
            </button>
          </div>
        </div>
      </header>

      {/* ── 히어로: 광고 메시지와 1:1 일치 ── */}
      <section className="relative bg-slate-900 text-white pt-32 pb-20 md:pt-40 md:pb-28 px-5 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-med-cyan/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-24 w-96 h-96 bg-[#0072BC]/20 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full border border-white/20 mb-6">
            <TrendingUp className="w-3.5 h-3.5 text-med-cyan" />
            <span className="text-med-cyan font-black text-xs tracking-wide">
              초고령사회, 수요가 계속 늘어나는 시장
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight md:leading-tight mb-5">
            요양기관 창업,
            <br />
            <span className="text-med-cyan cyan-glow">지정심사부터 막힙니다</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-lg leading-relaxed max-w-2xl mx-auto mb-9">
            방문요양·주간보호센터 창업은 입지, 지정제 심사 서류, 인력 구성 중 하나만 놓쳐도 개원이 늦어집니다.
            <br className="hidden md:block" />
            예비 원장님의 지역과 준비 단계에 맞춰 <strong className="text-white">1:1로 점검</strong>해 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-med-cyan text-slate-900 px-8 py-4 rounded-2xl font-black text-base md:text-lg hover:scale-105 transition-transform shadow-lg shadow-med-cyan/20"
            >
              무료 창업 상담 신청 <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href={`tel:${PHONE}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-2xl font-black text-base md:text-lg hover:bg-white/20 transition-colors"
            >
              <Phone className="w-5 h-5" /> {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ── 문제 공감 ── */}
      <section className="py-16 md:py-24 px-5 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 rounded-full mb-4">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-amber-700 font-black text-xs tracking-wide">혼자 준비하면 겪는 일</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black mb-3">이런 고민, 하고 계시지 않나요?</h2>
            <p className="text-slate-500 text-sm md:text-base">
              예비 원장님들이 상담에서 가장 많이 하시는 이야기입니다.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {painPoints.map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-black mb-2.5">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 해결: 4대 지원 ── */}
      <section className="py-16 md:py-24 px-5 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 bg-white/10 rounded-full border border-white/20 mb-4">
              <span className="text-med-cyan font-black text-xs tracking-widest uppercase">Total Care Consulting</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black mb-3">
              지정심사부터 개소 후 운영까지,
              <br className="md:hidden" /> 끝까지 함께합니다
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
              클라우드나인 메디케어의 플랫폼 기술과 현장 노하우를 그대로 전수합니다.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {solutions.map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-3xl p-7 group hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-med-cyan/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-base md:text-lg font-bold mb-2.5 group-hover:text-med-cyan transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 프로세스 ── */}
      <section className="py-16 md:py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-black mb-3">창업 컨설팅 진행 과정</h2>
            <p className="text-slate-500 text-sm md:text-base">상담부터 개소 후 안정화까지, 4단계로 진행됩니다.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((item, i) => (
              <div key={i} className="relative bg-slate-50 rounded-3xl p-7 border border-slate-100">
                <span className="text-med-cyan font-black text-3xl md:text-4xl opacity-40">{item.step}</span>
                <h3 className="text-base md:text-lg font-black mt-3 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 리드마그넷 + 폼 ── */}
      <section id="startup-form" className="py-16 md:py-24 px-5 bg-slate-900 relative overflow-hidden scroll-mt-16">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-med-cyan/10 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="text-white lg:pt-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-med-cyan/15 rounded-full border border-med-cyan/30 mb-5">
                <Gift className="w-3.5 h-3.5 text-med-cyan" />
                <span className="text-med-cyan font-black text-xs tracking-wide">상담 신청 혜택</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black leading-snug mb-5">
                무료 상담 신청하시면
                <br />
                <span className="text-med-cyan">지정심사 준비 체크리스트</span>를
                <br />
                무료로 드립니다
              </h2>
              <ul className="space-y-3 mb-8">
                {[
                  '인력·시설·서류 요건을 한눈에 확인하는 자가 점검표',
                  '지자체 심사에서 자주 반려되는 사례 정리',
                  '내 지역·준비 단계에 맞춘 1:1 맞춤 진단',
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-300 text-sm md:text-base">
                    <CheckCircle2 className="w-5 h-5 text-med-cyan flex-shrink-0 mt-0.5" />
                    {text}
                  </li>
                ))}
              </ul>
              <div className="hidden lg:flex items-center gap-3 text-slate-400 text-sm">
                <ClipboardCheck className="w-5 h-5 text-med-cyan" />
                상담은 무료이며, 가입·계약 강요가 없습니다.
              </div>
            </div>
            <StartupForm />
          </div>
        </div>
      </section>

      {/* ── 푸터 ── */}
      <footer className="bg-slate-950 text-slate-500 text-center py-10 px-5 pb-28 md:pb-10">
        <p className="font-black text-slate-300 mb-2">CloudNine Medicare</p>
        <p className="text-xs leading-relaxed">
          부산광역시 수영구 수영로 665, 201호 | {PHONE}
          <br />© 2026 CLOUDNINE MEDICARE. ALL RIGHTS RESERVED.
        </p>
        <a href="/#privacy" className="text-xs underline hover:text-slate-300 mt-2 inline-block">
          개인정보처리방침
        </a>
      </footer>

      {/* ── 모바일 하단 고정 바 ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-3 gap-2 p-3">
          <a
            href={`tel:${PHONE}`}
            className="h-12 rounded-xl bg-slate-100 text-slate-800 font-black text-xs flex items-center justify-center gap-1.5"
          >
            <Phone className="w-4 h-4" /> 전화 상담
          </a>
          <a
            href={KAKAO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="h-12 rounded-xl bg-[#FAE100] text-[#3C1E1E] font-black text-xs flex items-center justify-center gap-1.5"
          >
            <span className="bg-[#3C1E1E] text-[#FAE100] rounded-full w-5 h-5 flex items-center justify-center text-[7px]">
              TALK
            </span>
            카톡 상담
          </a>
          <button
            onClick={scrollToForm}
            className="h-12 rounded-xl text-white font-black text-xs flex items-center justify-center gap-1"
            style={{ backgroundColor: BRAND_BLUE }}
          >
            무료 상담 신청
          </button>
        </div>
      </div>
    </div>
  );
}
