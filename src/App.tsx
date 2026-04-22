import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  ShieldCheck, 
  Users, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Menu, 
  X,
  Star,
  Activity,
  Home,
  Coffee,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  UserPlus,
  ShoppingBag,
  Plus,
  Quote,
  Award,
  Briefcase
} from 'lucide-react';

const Navbar = ({ currentSection, setCurrentSection }: { currentSection: number, setCurrentSection: (idx: number) => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 상담 신청을 첫 번째 섹션으로 배치하여 전환율 극대화
  const navLinks = [
    { name: '홈', index: 0 },
    { name: '소개', index: 1 },
    { name: '간병인등록', index: 2 },
    { name: '가족간병신청', index: 3 },
    { name: '노인장기요양', index: 4 },
    { name: '후기', index: 5 },
    { name: '상담 신청', index: 6 },
  ];

  const handleNavClick = (e: any, index: number) => {
    e.preventDefault();
    setCurrentSection(index);
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || currentSection !== 0 ? 'bg-white/95 backdrop-blur-md shadow-sm py-2' : 'bg-white py-3'}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentSection(0)}>
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="클라우드나인 메디케어 로고" className="h-32 -my-8 object-contain" />
              <span className="text-base font-black tracking-tight text-[#0072BC]">클라우드나인 메디케어</span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button 
                key={link.name} 
                onClick={(e) => handleNavClick(e, link.index)}
                className={`text-[18px] font-bold transition-colors tracking-tight ${currentSection === link.index ? 'text-[#0072BC]' : 'text-[#1a1a1a] hover:text-[#0072BC]'}`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <button 
            className="lg:hidden p-2 text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <button 
                  key={link.name} 
                  onClick={(e) => handleNavClick(e, link.index)}
                  className={`block w-full text-left text-xl font-bold ${currentSection === link.index ? 'text-[#0072BC]' : 'text-slate-900'}`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative w-full h-[80svh] min-h-[500px] md:h-screen flex items-center overflow-hidden">
      {/* 반응형 영상 배경: 모바일과 PC 모두 화면에 꽉 차도록 object-cover 적용 */}
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          /* 모바일: object-contain으로 인물이 잘리지 않게 전체 표시 / 데스크톱: object-cover로 화면 가득 채움 */
          className="absolute inset-0 w-full h-full object-contain md:object-cover md:object-center opacity-80"
        />
        {/* 영상 가독성을 높이기 위한 그라디언트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full mb-10 md:mb-0 text-center md:text-left">
        <div className="max-w-3xl mx-auto md:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-[1.3] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              병원동행부터 간병, 요양까지<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>빠르고 편리하게
            </h1>
            <p className="mt-4 md:mt-6 text-base sm:text-xl text-slate-200 font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              내 가족을 돌보는 마음으로, 안전하고 믿을 수 있는 서비스를 제공합니다.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* 카카오톡 버튼 — 모바일에서 크기 축소 및 위치 조정 */}
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[100]">
        <motion.a 
          href="http://pf.kakao.com/_bvZtG"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#FAE100] w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl sm:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
        >
          <div className="bg-[#3C1E1E] w-7 h-7 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center">
            <span className="text-[#FAE100] font-black text-[7px] sm:text-[10px] md:text-xs tracking-tighter">TALK</span>
          </div>
          <span className="text-[#3C1E1E] text-[7px] sm:text-[10px] md:text-xs font-black">상담하기</span>
        </motion.a>
      </div>
    </section>
  );
};

// 소개 섹션 — 다크 네이비 + 골드 액센트, 원페이지 레이아웃
const CeoIntroduction = () => {
  const gold = '#C9A96E';

  return (
    <section className="h-full overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0f2035 40%, #132a42 100%)' }}
    >
      <div className="h-full flex items-center px-6 md:px-10 relative">

        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, ${gold} 0%, transparent 70%)` }}
        />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-14 items-center">

            {/* 왼쪽: 프로필 영역 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="lg:col-span-2 flex flex-col items-center"
            >
              {/* 프로필 사진 */}
              <div className="relative w-full max-w-[220px] lg:max-w-[240px] mx-auto">
                {/* 투명 배경(누끼) 사진 뒤에서 은은하게 뿜어져 나오는 후광 효과 */}
                <div className="absolute -inset-4 rounded-[2rem] opacity-60 blur-2xl z-0"
                  style={{ background: `radial-gradient(circle, rgba(201,169,110,0.3) 0%, transparent 60%)` }}
                />
                <div className="relative rounded-[1.5rem] w-full max-w-[240px] aspect-[3/4] overflow-visible flex items-end justify-center z-10 group">
                  <img
                    src="/ceo-profile.png"
                    alt="클라우드나인메디케어 대표 이운희"
                    className="w-full h-full object-cover object-top drop-shadow-2xl transition-all duration-700"
                    style={{ 
                      filter: 'contrast(102%) brightness(95%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)',
                      maskImage: 'linear-gradient(to bottom, black 75%, transparent 100%)'
                    }}
                  />
                </div>

                {/* 이름 텍스트 (박스 제거) */}
                <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 z-20 w-full">
                  <p className="text-base font-black text-white whitespace-nowrap tracking-widest text-center drop-shadow-lg">이 운 희</p>
                  <p className="text-[10px] font-bold text-center tracking-[0.2em] mt-1 drop-shadow-lg"
                    style={{ color: gold }}
                  >CLOUD9 MEDICARE CEO</p>
                </div>
              </div>

              {/* 지표 카드 */}
              <div className="grid grid-cols-3 gap-2.5 mt-10 w-full max-w-[260px]">
                {[
                  { value: '2만+', label: '전문 인력' },
                  { value: '24h', label: '연중무휴' },
                  { value: '98%', label: '만족도' },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center py-3 px-1.5 rounded-lg"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <p className="text-base font-black tracking-tight" style={{ color: gold }}>{stat.value}</p>
                    <p className="text-[9px] font-bold text-slate-400 mt-0.5 tracking-wider uppercase">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* 오른쪽: 인사말 영역 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.12 }}
              className="lg:col-span-3"
            >
              {/* 따옴표 아이콘 */}
              <Quote className="w-9 h-9 opacity-25 mb-3" style={{ color: gold }} />

              {/* 헤드라인 */}
              <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-[1.35] mb-5 tracking-tight">
                시니어 케어의 새로운 기준,<br />
                <span style={{ color: gold }}>클라우드나인메디케어</span>가 만듭니다
              </h2>

              {/* 인사말 본문 */}
              <div className="space-y-3 text-slate-300 text-[13px] md:text-sm leading-[1.85] font-medium mb-5">
                <p>
                  <strong className="text-white">클라우드나인메디케어 대표 이운희</strong>입니다.
                </p>
                <p>
                  우리는 전문화된 인력 관리와 차별화된 프로세스를 통해 <strong className="text-white">시니어 라이프의 질을 높이는 데</strong> 전념하고 있습니다.
                </p>
              </div>

              {/* 핵심 서비스 카드 */}
              <div className="space-y-2.5 mb-5">
                {[
                  { title: '전문 간병 및 방문요양', desc: '엄격한 기준으로 선발된 요양보호사와 간병인 매칭', icon: <Heart className="w-4 h-4" /> },
                  { title: '등급 신청 토탈 케어', desc: '복잡한 노인장기요양등급 신청의 처음부터 끝까지 밀착 지원', icon: <FileText className="w-4 h-4" /> },
                  { title: '치매 예방 솔루션', desc: '지역 주민을 위한 치매 무료 검사 실시 및 사후 관리 연계', icon: <Activity className="w-4 h-4" /> },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `rgba(201,169,110,0.15)`, color: gold }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-white mb-0.5">{item.title}</p>
                      <p className="text-[11.5px] text-slate-400 leading-[1.6]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 마무리 인사말 */}
              <p className="text-slate-300 text-[13px] md:text-sm leading-[1.85] font-medium mb-5">
                전문성은 기본이며, <strong style={{ color: gold }}>정직과 신뢰</strong>는 저희의 가장 큰 자산입니다. 클라우드나인메디케어는 어르신들의 건강한 미소와 가족의 행복을 위해 <strong className="text-white">항상 현장에서 발로 뛰겠습니다.</strong>
              </p>

              {/* 서명 + 대표번호 */}
              <div className="pt-4" style={{ borderTop: '1px solid rgba(201,169,110,0.15)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${gold}, #a88a55)`, boxShadow: '0 4px 16px rgba(201,169,110,0.2)' }}
                    >
                      <Briefcase className="w-4 h-4 text-[#0a1628]" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white tracking-wide">이운희</p>
                      <p className="text-[10px] font-bold" style={{ color: gold }}>클라우드나인메디케어 대표</p>
                    </div>
                  </div>

                  {/* 대표번호 */}
                  <a href="tel:1688-9739" className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors group"
                    style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)' }}
                  >
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: gold }}>
                      <svg className="w-3 h-3 text-[#0a1628]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-500 tracking-wider uppercase">대표번호</p>
                      <p className="text-sm font-black tracking-wide group-hover:underline" style={{ color: gold }}>1688-9739</p>
                    </div>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const RegistrationForm = () => {
  const [activeTab, setActiveTab] = useState<'find' | 'register'>('find');

  // 간병인 등록 폼 상태
  const [regData, setRegData] = useState({
    name: '',
    residentId: '',
    address: ''
  });
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [regError, setRegError] = useState('');

  // 간병인 찾기 폼 상태
  const [findData, setFindData] = useState({
    patientName: '',
    phone: '',
    hospital: '',
    expectedPeriod: ''
  });
  const [isFindSubmitting, setIsFindSubmitting] = useState(false);
  const [findSuccess, setFindSuccess] = useState(false);
  const [findError, setFindError] = useState('');

  // 간병인 등록 제출
  const handleRegSubmit = (e: any) => {
    e.preventDefault();
    setRegError('');
    setIsRegSubmitting(true);

    fetch("https://formsubmit.co/ajax/steave5873@naver.com", {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: "[간병인 등록] 새로운 간병인 등록 신청",
        _template: "table",
        _captcha: "false",
        "이름": regData.name,
        "주민등록번호": regData.residentId,
        "주소": regData.address,
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) {
        setRegSuccess(true);
        setRegData({ name: '', residentId: '', address: '' });
        setTimeout(() => setRegSuccess(false), 5000);
      } else {
        setRegError(data.message || '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    })
    .catch(() => setRegError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.'))
    .finally(() => setIsRegSubmitting(false));
  };

  // 간병인 찾기 제출
  const handleFindSubmit = (e: any) => {
    e.preventDefault();
    setFindError('');
    setIsFindSubmitting(true);

    fetch("https://formsubmit.co/ajax/steave5873@naver.com", {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: "[간병인 찾기] 새로운 간병인 매칭 요청",
        _template: "table",
        _captcha: "false",
        "환자이름": findData.patientName,
        "전화번호": findData.phone,
        "병원": findData.hospital,
        "입원예상기간": findData.expectedPeriod,
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) {
        setFindSuccess(true);
        setFindData({ patientName: '', phone: '', hospital: '', expectedPeriod: '' });
        setTimeout(() => setFindSuccess(false), 5000);
      } else {
        setFindError(data.message || '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    })
    .catch(() => setFindError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.'))
    .finally(() => setIsFindSubmitting(false));
  };

  return (
    <section id="registration" className="relative min-h-[100svh] py-24 md:h-full flex flex-col justify-center overflow-y-auto bg-slate-900 text-white px-6 align-middle">
      <div className="max-w-4xl mx-auto w-full my-auto">
        <div className="text-center mb-6 md:mb-8 mt-12 md:mt-0">
          <div className="inline-block px-4 py-1 bg-white/10 rounded-full border border-white/20 mb-3 md:mb-4">
            <span className="text-med-cyan font-black text-[10px] md:text-xs tracking-widest uppercase">Caregiver Service</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">간병인 매칭 및 등록</h2>
          <p className="text-slate-400 text-sm md:text-base">
            원하시는 서비스를 선택해 주세요.
          </p>
        </div>

        {/* 탭 버튼 */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 mb-6 md:mb-8 max-w-lg mx-auto backdrop-blur-sm">
          <button 
            type="button"
            onClick={() => setActiveTab('find')}
            className={`flex-1 py-3 md:py-3.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'find' 
                ? 'bg-med-cyan text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            간병인 찾기 <span className="block mt-0.5 md:mt-0 md:inline md:ml-1 text-[10px] md:text-xs opacity-75 font-normal md:font-bold">(환자/보호자용)</span>
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 md:py-3.5 rounded-xl text-xs md:text-sm font-bold transition-all ${
              activeTab === 'register' 
                ? 'bg-med-cyan text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            간병인 등록 <span className="block mt-0.5 md:mt-0 md:inline md:ml-1 text-[10px] md:text-xs opacity-75 font-normal md:font-bold">(구직자용)</span>
          </button>
        </div>

        <div className="relative">
          <AnimatePresence mode="popLayout">
            {activeTab === 'find' && (
              <motion.div 
                key="find"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 md:p-10 backdrop-blur-sm"
              >
                <div className="mb-6 flex items-start gap-4 p-4 rounded-2xl bg-[#0072BC]/10 border border-[#0072BC]/20">
                  <Heart className="w-5 h-5 md:w-6 md:h-6 text-[#0072BC] shrink-0 mt-0.5 md:mt-1" />
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white mb-1">최적의 간병인을 찾아드립니다</h3>
                    <p className="text-xs md:text-sm text-slate-300">내 가족을 돌보는 마음으로, 전문가를 매칭해 드립니다. 아래 정보를 남겨주시면 신속하게 안내해 드리겠습니다.</p>
                  </div>
                </div>

                <form onSubmit={handleFindSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">환자 이름</label>
                      <input 
                        type="text" 
                        required
                        placeholder="환자 성함을 입력하세요"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-med-cyan transition-colors"
                        value={findData.patientName}
                        onChange={(e) => setFindData({...findData, patientName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">전화번호</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="연락 가능하신 번호 (예: 010-0000-0000)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-med-cyan transition-colors"
                        value={findData.phone}
                        onChange={(e) => setFindData({...findData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">병원</label>
                      <input 
                        type="text" 
                        required
                        placeholder="입원 중이거나 예정인 병원명"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-med-cyan transition-colors"
                        value={findData.hospital}
                        onChange={(e) => setFindData({...findData, hospital: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">입원예상기간</label>
                      <input 
                        type="text" 
                        required
                        placeholder="예: 2주, 1개월 등"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-med-cyan transition-colors"
                        value={findData.expectedPeriod}
                        onChange={(e) => setFindData({...findData, expectedPeriod: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="pt-2 md:pt-4">
                    {findError && (
                      <div className="mb-3 text-red-300 text-xs md:text-sm font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
                        {findError}
                      </div>
                    )}
                    <button 
                      type="submit"
                      disabled={isFindSubmitting || findSuccess}
                      className={`w-full text-white py-3 md:py-4 rounded-xl font-black text-base md:text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                        findSuccess
                          ? 'bg-emerald-500/80'
                          : isFindSubmitting
                            ? 'med-btn-gradient opacity-70 cursor-not-allowed'
                            : 'med-btn-gradient hover:scale-[1.02]'
                      }`}
                    >
                      {findSuccess ? (
                        <><CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> 간병인 찾기 신청 완료</>
                      ) : isFindSubmitting ? (
                        <><div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 접수 중...</>
                      ) : (
                        '간병인 매칭 신청하기'
                      )}
                    </button>
                  </div>
                </form>
                
                <p className="mt-4 md:mt-6 text-center text-slate-500 text-[10px] md:text-xs">
                  * 수집된 개인정보는 간병인 매칭 목적으로만 사용되며, 법령에 따라 안전하게 보호됩니다.
                </p>
              </motion.div>
            )}

            {activeTab === 'register' && (
              <motion.div 
                key="register"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-6 md:p-10 backdrop-blur-sm"
              >
                <div className="mb-6 flex items-start gap-4 p-4 rounded-2xl bg-[#C9A96E]/10 border border-[#C9A96E]/20">
                  <UserPlus className="w-5 h-5 md:w-6 md:h-6 text-[#C9A96E] shrink-0 mt-0.5 md:mt-1" />
                  <div>
                    <h3 className="text-base md:text-lg font-bold text-white mb-1">클라우드나인 메디케어와 함께하세요</h3>
                    <p className="text-xs md:text-sm text-slate-300">최고의 대우와 체계적인 관리로 간병인 여러분의 프로페셔널한 커리어를 지원합니다.</p>
                  </div>
                </div>

                <form onSubmit={handleRegSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">이름</label>
                      <input 
                        type="text" 
                        required
                        placeholder="성함을 입력하세요"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-med-cyan transition-colors"
                        value={regData.name}
                        onChange={(e) => setRegData({...regData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5 md:space-y-2">
                      <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">주민등록번호</label>
                      <input 
                        type="text" 
                        required
                        placeholder="000000-0000000"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-med-cyan transition-colors"
                        value={regData.residentId}
                        onChange={(e) => setRegData({...regData, residentId: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">주소</label>
                    <input 
                      type="text" 
                      required
                      placeholder="상세 주소를 입력하세요"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-med-cyan transition-colors"
                      value={regData.address}
                      onChange={(e) => setRegData({...regData, address: e.target.value})}
                    />
                  </div>

                  <div className="pt-2 md:pt-4">
                    {regError && (
                      <div className="mb-3 text-red-300 text-xs md:text-sm font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
                        {regError}
                      </div>
                    )}
                    <button 
                      type="submit"
                      disabled={isRegSubmitting || regSuccess}
                      className={`w-full text-white py-3 md:py-4 rounded-xl font-black text-base md:text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                        regSuccess
                          ? 'bg-emerald-500/80'
                          : isRegSubmitting
                            ? 'med-btn-gradient opacity-70 cursor-not-allowed'
                            : 'med-btn-gradient hover:scale-[1.02]'
                      }`}
                    >
                      {regSuccess ? (
                        <><CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" /> 등록 신청 완료</>
                      ) : isRegSubmitting ? (
                        <><div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 접수 중...</>
                      ) : (
                        '간병인 등록 신청하기'
                      )}
                    </button>
                  </div>
                </form>
                
                <p className="mt-4 md:mt-6 text-center text-slate-500 text-[10px] md:text-xs">
                  * 수집된 개인정보는 간병인 등록 관리 목적으로만 사용되며, 법령에 따라 안전하게 보호됩니다.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const FamilyCareForm = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientBirth: '',
    guardianName: '',
    guardianResidentId: '',
    guardianPhone: '',
    hospitalName: '',
    stayPeriod: '',
    careFee: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // FormSubmit API를 통해 가족간병 신청을 이메일로 전송
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    fetch("https://formsubmit.co/ajax/steave5873@naver.com", {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: "[가족간병] 새로운 가족간병 신청",
        _template: "table",
        _captcha: "false",
        "환자 이름": formData.patientName,
        "환자 생년월일": formData.patientBirth,
        "보호자 이름": formData.guardianName,
        "보호자 주민번호": formData.guardianResidentId,
        "보호자 전화번호": formData.guardianPhone,
        "병원명": formData.hospitalName,
        "간병 기간": formData.stayPeriod,
        "간병비 금액": formData.careFee,
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setFormData({ patientName: '', patientBirth: '', guardianName: '', guardianResidentId: '', guardianPhone: '', hospitalName: '', stayPeriod: '', careFee: '' });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setErrorMsg(data.message || '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    })
    .catch(() => setErrorMsg('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.'))
    .finally(() => setIsSubmitting(false));
  };

  return (
    <section id="family" className="h-full flex flex-col justify-center bg-slate-900 text-white px-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-white/10 rounded-full border border-white/20 mb-4">
            <span className="text-med-cyan font-black text-xs tracking-widest uppercase">Family Care</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">가족간병 신청</h2>
          <p className="text-slate-400 text-base mb-6">
            가족이 직접 간병하시는 경우 필요한 행정 지원 및 교육 신청을 위한 양식입니다.
          </p>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-left inline-block max-w-xl mx-auto backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500/20 p-2 rounded-full hidden sm:block">
                <Info className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-amber-400 font-bold text-base mb-2 flex items-center gap-2">
                  <span className="sm:hidden"><Info className="w-4 h-4" /></span>
                  신청 전 반드시 확인해 주세요!
                </h4>
                <p className="text-amber-100/80 text-sm leading-relaxed">
                  가족간병 신청은 <strong className="text-amber-300">입원 전 1회</strong>, <strong className="text-amber-300">퇴원 후 1회</strong> 총 <span className="underline decoration-amber-500/50 underline-offset-4 font-bold text-white">두 번 필수적으로 신청</span>하셔야 정상 처리가 가능합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">환자 이름</label>
                <input 
                  type="text" 
                  required
                  placeholder="환자 성함"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-med-cyan transition-colors"
                  value={formData.patientName}
                  onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">환자 생년월일</label>
                <input 
                  type="text" 
                  required
                  placeholder="YYYY-MM-DD"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-med-cyan transition-colors"
                  value={formData.patientBirth}
                  onChange={(e) => setFormData({...formData, patientBirth: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">보호자(간병인) 이름</label>
                <input 
                  type="text" 
                  required
                  placeholder="보호자 성함"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-med-cyan transition-colors"
                  value={formData.guardianName}
                  onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">보호자 주민번호</label>
                <input 
                  type="text" 
                  required
                  placeholder="000000-0******"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-med-cyan transition-colors"
                  value={formData.guardianResidentId}
                  onChange={(e) => setFormData({...formData, guardianResidentId: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">보호자 전화번호</label>
                <input 
                  type="tel" 
                  required
                  placeholder="010-0000-0000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-med-cyan transition-colors"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">병원명</label>
                <input 
                  type="text" 
                  required
                  placeholder="입원 중인 병원 이름"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-med-cyan transition-colors"
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">간병 기간</label>
                <input 
                  type="text" 
                  required
                  placeholder="예: 2024-01-01"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-med-cyan transition-colors"
                  value={formData.stayPeriod}
                  onChange={(e) => setFormData({...formData, stayPeriod: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">간병비 금액</label>
                <input 
                  type="text" 
                  required
                  placeholder="금액을 입력하세요"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-med-cyan transition-colors"
                  value={formData.careFee}
                  onChange={(e) => setFormData({...formData, careFee: e.target.value})}
                />
              </div>
            </div>

            <div className="pt-4">
              {errorMsg && (
                <div className="mb-3 text-red-300 text-sm font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
                  {errorMsg}
                </div>
              )}
              <button 
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className={`w-full text-white py-4 rounded-xl font-black text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                  submitSuccess
                    ? 'bg-emerald-500/80'
                    : isSubmitting
                      ? 'med-btn-gradient opacity-70 cursor-not-allowed'
                      : 'med-btn-gradient hover:scale-[1.02]'
                }`}
              >
                {submitSuccess ? (
                  <><CheckCircle2 className="w-5 h-5" /> 가족간병 신청이 완료되었습니다</>
                ) : isSubmitting ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 접수 중...</>
                ) : (
                  '가족간병 신청하기'
                )}
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-slate-500 text-xs">
            * 수집된 개인정보는 가족간병 신청 및 행정 지원 목적으로만 사용되며, 관련 법령에 따라 안전하게 보호됩니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
};



const LongTermCare = ({ onNavigate }: { onNavigate: (idx: number) => void }) => {
  // 각 카드 클릭 시 상담신청 섹션(index 0)으로 이동
  const options = [
    {
      title: "노인장기요양등급신청",
      desc: "복잡한 등급 신청 절차를 전문가가 무료로 도와드립니다.",
      icon: <FileText className="w-8 h-8 text-med-cyan" />,
      action: () => onNavigate(6)
    },
    {
      title: "노인장기요양등급안내",
      desc: "등급별 혜택과 판정 기준을 상세히 안내해 드립니다.",
      icon: <Info className="w-8 h-8 text-med-cyan" />,
      action: () => onNavigate(5)
    },
    {
      title: "요양보호사 신청",
      desc: "어르신께 꼭 맞는 전문 요양보호사를 매칭해 드립니다.",
      icon: <UserPlus className="w-8 h-8 text-med-cyan" />,
      action: () => onNavigate(5)
    },
    {
      title: "복지용구 신청",
      desc: "어르신의 생활 편의를 돕는 다양한 복지용구를 안내해 드립니다.",
      icon: <ShoppingBag className="w-8 h-8 text-med-cyan" />,
      action: () => onNavigate(5)
    }
  ];

  return (
    <section id="longterm" className="h-full flex flex-col justify-center bg-slate-900 text-white px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-white/10 rounded-full border border-white/20 mb-4">
            <span className="text-med-cyan font-black text-xs tracking-widest uppercase">Long-term Care</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">노인장기요양 서비스</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            어르신의 건강한 노후를 위해 국가에서 지원하는 장기요양보험 제도를 쉽고 편리하게 이용하세요.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((option, i) => (
            <motion.button
              key={i}
              whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.08)' }}
              onClick={option.action}
              className="text-left p-8 rounded-[2rem] bg-white/5 border border-white/10 transition-all group"
            >
              <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-med-cyan/20 transition-colors">
                {option.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-med-cyan transition-colors">{option.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {option.desc}
              </p>
              <div className="flex items-center gap-2 text-med-cyan font-bold text-sm">
                <span>자세히 보기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};



const Testimonials = () => {
  const [reviews, setReviews] = useState([
    { name: "이정은 님", content: "어머니께서 요양보호사님을 너무 좋아하세요. 가족처럼 따뜻하게 대해주셔서 정말 감사합니다." },
    { name: "박준호 님", content: "행정 지원 서비스 덕분에 복잡한 등급 신청을 수월하게 마쳤습니다. 전문가의 도움이 왜 필요한지 알겠더라고요." },
    { name: "최미경 님", content: "병원 간병 서비스를 이용했는데, 꼼꼼한 리포트 덕분에 멀리서도 안심할 수 있었습니다. 강력 추천합니다." },
    { name: "김태영 님", content: "갑작스러운 입원으로 당황했는데, 빠른 매칭 덕분에 한시름 놓았습니다. 간병인 분이 너무 성실하셔서 감동받았어요." },
    { name: "정소희 님", content: "가족간병 신청 절차가 막막했는데 친절하게 가이드해주셔서 큰 도움이 되었습니다. 지원금 혜택도 잘 챙길 수 있었네요." },
    { name: "한승우 님", content: "부모님 요양 등급 판정 결과가 생각보다 잘 나와서 다행입니다. 클라우드나인의 전문적인 조언이 결정적이었던 것 같아요." },
    { name: "윤지민 님", content: "24시간 간병 서비스가 정말 체계적입니다. 교대 시간도 정확하고 인수인계도 꼼꼼해서 믿음이 가요." },
    { name: "강현우 님", content: "지방에 계신 아버님을 위해 신청했는데, 매일 사진과 함께 활동 내용을 보내주셔서 마음이 놓입니다." },
    { name: "오세훈 님", content: "요양보호사님의 전문적인 지식 덕분에 욕창 예방 등 집에서 하기 힘든 케어를 잘 받을 수 있었습니다." },
    { name: "임서연 님", content: "여러 업체 상담받아봤지만 클라우드나인이 가장 친절하고 전문적이었습니다. 가격도 합리적이라 만족해요." },
    { name: "조민기 님", content: "치매 어르신 케어가 쉽지 않은데, 인내심 있게 잘 응대해주시는 모습에 큰 감동을 받았습니다." },
    { name: "백지현 님", content: "재활 운동까지 도와주시는 요양보호사님 덕분에 어머니 회복 속도가 매우 빨라졌습니다. 감사합니다." }
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % Math.ceil(reviews.length / 3));
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newName || !newContent) return;
    
    const newReview = {
      name: newName.endsWith("님") ? newName : `${newName} 님`,
      content: newContent
    };
    
    setReviews([newReview, ...reviews]);
    setNewName("");
    setNewContent("");
    setIsModalOpen(false);
    setActiveIndex(0);
  };

  return (
    <section id="testimonials" className="h-full flex flex-col justify-center bg-med-dark text-white relative overflow-hidden px-6">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="text-left">
            <h2 className="text-med-cyan font-black text-xs tracking-[0.3em] uppercase mb-4">Testimonials</h2>
            <h3 className="text-3xl md:text-4xl font-bold">보호자님들의 진심 어린 후기</h3>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-med-cyan text-med-dark px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Plus className="w-5 h-5" />
            후기 작성하기
          </button>
        </div>

        <div className="relative h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 absolute inset-0"
            >
              {reviews.slice(activeIndex * 3, activeIndex * 3 + 3).map((review, i) => (
                <div 
                  key={`${activeIndex}-${i}`}
                  className="bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 flex flex-col justify-between h-full"
                >
                  <div>
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-med-cyan text-med-cyan" />
                      ))}
                    </div>
                    <p className="text-base md:text-lg mb-6 italic text-slate-300 leading-relaxed">"{review.content}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-med-cyan rounded-full flex items-center justify-center text-med-dark font-black text-sm">
                      {review.name[0]}
                    </div>
                    <p className="font-bold text-white text-base">{review.name}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-3 mt-12">
          {[...Array(Math.ceil(reviews.length / 3))].map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === i ? 'bg-med-cyan w-8' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-med-dark border border-white/10 p-8 rounded-[2.5rem] w-full max-w-lg relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold">후기 작성</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">성함</label>
                  <input 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="성함을 입력해주세요"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-med-cyan transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">후기 내용</label>
                  <textarea 
                    rows={4}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="소중한 후기를 남겨주세요"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-med-cyan transition-colors resize-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-med-cyan text-med-dark py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-med-cyan/20"
                >
                  후기 등록하기
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};



const Footer = ({ onNavigate }: { onNavigate?: (idx: number) => void }) => {
  return (
    <footer className="bg-med-dark text-slate-500 py-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-med-cyan rounded-full flex items-center justify-center">
              <Heart className="text-med-dark w-3.5 h-3.5 fill-med-dark" />
            </div>
            <span className="text-sm font-bold text-white">
              CloudNine <span className="text-med-cyan">Medicare</span>
            </span>
          </div>
          
          <div className="flex gap-6 text-[10px] font-bold">
            <a href="#" className="hover:text-med-cyan transition-colors">이용약관</a>
            <button onClick={() => onNavigate && onNavigate(7)} className="hover:text-med-cyan transition-colors cursor-pointer">개인정보처리방침</button>
            <a href="#" className="hover:text-med-cyan transition-colors">고객센터</a>
          </div>

          <div className="text-[9px] tracking-tight uppercase text-center md:text-right font-bold">
            <p>© 2026 CloudNine Medicare. All rights reserved.</p>
            <p className="mt-0.5">부산광역시 수영구 수영로 665, 201호 | 1688-9739</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// 폼만 별도 컴포넌트로 분리 — 상태 변경 시 폼 영역만 리렌더링되어 INP 성능 문제를 해결합니다
const ConsultationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleButtonClick = () => {
    setErrorMsg('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMsg('이름과 전화번호를 정확히 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);

    // requestAnimationFrame으로 브라우저가 로딩 UI를 먼저 그리도록 보장 (INP 해결)
    requestAnimationFrame(() => {
      fetch("https://formsubmit.co/ajax/steave5873@naver.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message || "기재하지 않음",
          _subject: "클라우드나인 메디케어: 새로운 상담 신청",
          _template: "table",
          _captcha: "false"
        })
      })
      .then(async (response) => {
        // FormSubmit 응답 본문을 파싱하여 실제 에러 메시지를 확인
        const data = await response.json();
        if (response.ok && data.success) {
          setSubmitSuccess(true);
          setFormData({ name: '', phone: '', message: '' });
          setTimeout(() => setSubmitSuccess(false), 5000);
        } else {
          // FormSubmit이 반환하는 실제 에러 메시지를 표시
          setErrorMsg(data.message || '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
        }
      })
      .catch(() => {
        setErrorMsg('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
    });
  };

  return (
    <div className="relative rounded-[2rem] p-8 md:p-10 w-full max-w-md lg:ml-auto overflow-hidden"
         style={{
           background: 'rgba(255, 255, 255, 0.12)',
           backdropFilter: 'blur(24px) saturate(180%)',
           WebkitBackdropFilter: 'blur(24px) saturate(180%)',
           border: '1px solid rgba(255, 255, 255, 0.25)',
           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
         }}
    >
      {/* 상단 빛 반사 효과 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      
      <div className="relative z-10 mb-8 text-left">
        <h3 className="text-2xl font-black text-white mb-2" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}>전문 간호사 1:1 안심 상담 신청</h3>
        <p className="text-white/70 text-sm">연락처를 남겨주시면 대표 간호사가 직접 부모님의 상태에 맞는 최적의 케어 플랜을 제안해 드립니다.</p>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white/80 uppercase">이름 <span className="text-sky-300">*</span></label>
          <input
            type="text"
            placeholder="보호자 성함"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            onKeyDown={(e) => { if (e.key === 'Enter') handleButtonClick(); }}
            className="w-full px-4 py-3.5 rounded-xl text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
            }}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white/80 uppercase">전화번호 <span className="text-sky-300">*</span></label>
          <input
            type="tel"
            placeholder="010-0000-0000"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            onKeyDown={(e) => { if (e.key === 'Enter') handleButtonClick(); }}
            className="w-full px-4 py-3.5 rounded-xl text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
            }}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-white/80 uppercase">추가 문의 사항 (선택)</label>
          <textarea
            rows={2}
            placeholder="간략한 문의사항을 적어주세요."
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="w-full px-4 py-3.5 rounded-xl text-white text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
            }}
          />
        </div>

        <div className="pt-2">
          {errorMsg && (
            <div className="mb-3 text-red-200 text-sm font-bold p-3 rounded-lg flex items-center justify-center gap-2"
                 style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
              {errorMsg}
            </div>
          )}
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isSubmitting || submitSuccess}
            className={`w-full py-4 rounded-xl font-black text-xl flex items-center justify-center gap-2 transition-all ${
              submitSuccess
                ? 'bg-emerald-500/80 text-white shadow-lg shadow-emerald-500/20'
                : isSubmitting
                  ? 'bg-white/20 text-white/70 cursor-not-allowed'
                  : 'bg-white text-[#0072BC] hover:bg-white/90 hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-white/20'
            }`}
          >
            {submitSuccess ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                상담 신청이 완료되었습니다
              </>
            ) : isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                안전하게 접수 중...
              </>
            ) : (
              <>
                무료 맞춤 케어 상담받기 <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
          <p className="text-center text-white/40 text-[10px] mt-3">
            입력 정보는 상담 목적으로만 사용되며 안전하게 보호됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

const ConsultationSection = ({ onNavigate }: { onNavigate: (idx: number) => void }) => {
  return (
    <section className="h-full overflow-y-auto bg-slate-50 text-slate-800 scroll-smooth">
      {/* Hero Section with Form (Lead Generation Layout) */}
      <div className="relative min-h-[90vh] lg:h-[85vh] flex items-center justify-center overflow-hidden pt-20 pb-10">
        <div className="absolute inset-0 z-0">
          <img
            src="/hero-consultation.png"
            alt="따뜻한 로컬 간호사와 어르신의 모습"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0072BC]/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0072BC] to-[#0072BC]/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 text-left"
            >
              <span className="inline-block px-4 py-1.5 bg-white/20 text-white rounded-full font-bold text-xs tracking-widest backdrop-blur-sm border border-white/30 uppercase">
                Premium Care Service
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                가족의 마음으로 모십니다
              </h2>
              <p className="text-base md:text-lg text-blue-50 font-medium max-w-lg">
                치매검사부터 전문적인 병원 동행까지, 우리 가족을 위한 믿을 수 있는 선택. 지금 바로 전문가와 상담하세요.
              </p>
            </motion.div>

            {/* Lead Capture Form — 별도 컴포넌트로 분리하여 INP 최적화 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <ConsultationForm />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Medicare Intro Section (Replaces Services Section) */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-[#0072BC] rounded-full font-bold text-xs tracking-widest uppercase mb-4">
              Why CloudNine Medicare
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight">
              기존의 낡은 방식을 버리다.<br/>
              <span className="text-[#0072BC]">진짜 스마트한 간병·요양의 시작</span>
            </h3>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto font-medium leading-relaxed">
              클라우드나인 메디케어는 재래식 방문요양센터나 불투명한 간병협회가 아닙니다.<br className="hidden md:block" />
              최첨단 AI 알고리즘과 국내 최대 데이터베이스를 활용하여 가장 완벽하고 빠른 서비스를 제공합니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-50 p-8 md:p-10 rounded-[2rem] border border-slate-100 transition-all hover:bg-blue-50 hover:border-blue-100 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-[#0072BC]" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#0072BC] transition-colors">
                AI 기반 초고속 매칭
              </h4>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                전화로 오랫동안 대기하는 과거의 수동 배정은 끝났습니다. AI가 어르신의 상세 조건과 성향, 지역을 실시간으로 분석하여 <strong className="text-slate-800">단 몇 분 안에 최적의 인재</strong>를 매칭합니다.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-50 p-8 md:p-10 rounded-[2rem] border border-slate-100 transition-all hover:bg-blue-50 hover:border-blue-100 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-[#0072BC]" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#0072BC] transition-colors">
                2만 명 이상의 압도적 인력풀
              </h4>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                작은 지역 센터에서는 불가능한 규모입니다. 클라우드나인은 <strong className="text-slate-800">까다로운 검증을 통과한 2만여 명의 간병인·요양보호사</strong>를 보유해 언제 어디서든 공백 없는 케어가 가능합니다.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-slate-50 p-8 md:p-10 rounded-[2rem] border border-slate-100 transition-all hover:bg-blue-50 hover:border-blue-100 group"
            >
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-[#0072BC]" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-[#0072BC] transition-colors">
                투명하고 편리한 시스템
              </h4>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                재래식 간병협회의 불투명한 수수료나 주먹구구식 운영을 벗어났습니다. 이용 비용, 보호자 리뷰 등 <strong className="text-slate-800">모든 과정을 투명하게 공개</strong>하여 더욱 믿고 맡길 수 있습니다.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mini Testimonials */}
      <div className="py-20 px-6 bg-[#0072BC] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-10 w-72 h-72 bg-white rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-blue-300 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h3 className="text-2xl md:text-3xl font-black mb-10">"마치 제 자식처럼 돌봐주셨어요"</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { text: "출근 때문에 어머니 병원 가시는게 늘 걱정이었는데, 담당 매니저님 덕분에 한시름 놨습니다.", author: "김민재 님" },
              { text: "치매 초기이신 아버지를 너무 따뜻하게 케어해주시는 요양보호사님을 만나 행운입니다.", author: "이수진 님" },
              { text: "까다로운 우리 가족 기준에도 너무 만족스럽습니다. 투명하게 알려주셔서 신뢰가 갑니다.", author: "박현석 님" }
            ].map((review, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-white/20 text-left">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-blue-50 text-sm md:text-base mb-6 leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm">{review.author[0]}</div>
                  <span className="font-bold text-sm md:text-base">{review.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      <Footer onNavigate={onNavigate} />
    </section>
  );
};

const PrivacyPolicy = () => {
  return (
    <section id="privacy" className="h-full overflow-y-auto bg-slate-50 text-slate-800 px-6 py-24 scroll-smooth">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100">
        <h2 className="text-2xl font-black mb-6 border-b pb-4 text-slate-900">개인정보 처리방침</h2>
        <div className="prose prose-sm max-w-none text-slate-600 space-y-5 text-sm leading-relaxed">
          <p><strong className="text-slate-800">제1조 (목적)</strong><br/>본 개인정보처리방침은 클라우드나인 메디케어(이하 "회사")가 제공하는 서비스 이용에 있어 관련 법령에 따른 개인정보 보호 및 처리 기준을 규정함을 목적으로 합니다.</p>
          <p><strong className="text-slate-800">제2조 (수집하는 개인정보 항목)</strong><br/>회사는 상담 및 서비스 제공을 위해 다음의 개인정보를 수집하고 있습니다.<br/>- <strong>필수항목:</strong> 이름, 연락처(전화번호)<br/>- <strong>선택항목:</strong> 기타 문의 내용, 주민등록번호 및 상세 주소 (간병인 등록 또는 가족간병 서비스 신청 시)</p>
          <p><strong className="text-slate-800">제3조 (개인정보의 처리 목적)</strong><br/>수집된 개인정보는 다음의 목적을 위해 활용됩니다.<br/>- 1:1 전화 상담 및 고객 맞춤형 응대<br/>- 요양보호사 배정 및 최적의 매칭 서비스 제공<br/>- 노인장기요양등급 신청 및 평가를 위한 행정 지원</p>
          <p><strong className="text-slate-800">제4조 (개인정보의 보유 및 이용기간)</strong><br/>원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 전자상거래 등에서의 소비자보호에 관한 법률 등 관계 법령의 규정에 의하여 보존할 필요가 있는 경우, 회사는 법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</p>
          <p><strong className="text-slate-800">제5조 (개인정보 보호책임자 및 담당 부서)</strong><br/>- 이름: 개인정보 보호 담당자<br/>- 전화번호: 1688-9739<br/>- 주소: 부산광역시 수영구 수영로 665, 201호</p>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  // 섹션별 고유 해시 — URL로 직접 접근 가능
  const sectionHashes = ['home', 'ceo', 'registration', 'family', 'longterm', 'reviews', 'consultation', 'privacy'];

  // URL 해시에서 초기 섹션 결정
  const getInitialSection = () => {
    const hash = window.location.hash.replace('#', '');
    const idx = sectionHashes.indexOf(hash);
    return idx >= 0 ? idx : 0;
  };

  const [currentSection, setCurrentSection] = useState(getInitialSection);
  const [direction, setDirection] = useState(0);

  // 섹션 변경 시 URL 해시도 함께 업데이트
  const handleSetSection = (newIndex: number) => {
    setDirection(newIndex > currentSection ? 1 : -1);
    setCurrentSection(newIndex);
    window.history.replaceState(null, '', `#${sectionHashes[newIndex]}`);
  };

  // 브라우저 뒤로가기/앞으로가기 시 해시 변경 감지
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const idx = sectionHashes.indexOf(hash);
      if (idx >= 0 && idx !== currentSection) {
        setDirection(idx > currentSection ? 1 : -1);
        setCurrentSection(idx);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentSection]);

  // 홈이 첫 화면, 상담 신청이 마지막
  const sections = [
    <Hero />,
    <CeoIntroduction />,
    <RegistrationForm />,
    <FamilyCareForm />,
    <LongTermCare onNavigate={handleSetSection} />,
    <Testimonials />,
    <ConsultationSection onNavigate={handleSetSection} />,
    <PrivacyPolicy />
  ];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0
    })
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-white selection:bg-med-cyan selection:text-med-dark relative">
      <Navbar currentSection={currentSection} setCurrentSection={handleSetSection} />
      
      <main className="relative h-full w-full">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSection}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute top-20 left-0 right-0 bottom-0 overflow-hidden"
          >
            {sections[currentSection]}
          </motion.div>
        </AnimatePresence>


      </main>
      
      {/* Section Indicator */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-4">
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => handleSetSection(i)}
            className={`w-3 h-3 rounded-full transition-all ${currentSection === i ? 'bg-med-cyan scale-150' : 'bg-slate-300 hover:bg-slate-400'}`}
          />
        ))}
      </div>
    </div>
  );
}
