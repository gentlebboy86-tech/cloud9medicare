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
  Plus
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
    { name: '간병인등록', index: 1 },
    { name: '가족간병신청', index: 2 },
    { name: '노인장기요양', index: 3 },
    { name: '후기', index: 4 },
    { name: '상담 신청', index: 5 },
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
    <section className="relative w-full aspect-video min-h-[400px] max-h-screen flex items-center overflow-hidden">
      {/* 반응형 영상 배경: 모든 화면 크기에서 비율 유지하며 꽉 채움 */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-black">
        {/* 1. 배경: 검은 여백 대신 영상을 채우고 블러 처리 */}
        <video 
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-50 scale-110"
        />
        {/* 2. 전경: 영상 원본 비율 유지 (잘림 없음) */}
        <video 
          src="/hero-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        />
        {/* 영상 위 어두운 오버레이로 텍스트 가독성 확보 */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.3] tracking-tight" style={{ textShadow: '0 2px 15px rgba(0,0,0,0.5)' }}>
              병원동행부터 간병, 요양까지<br />
              빠르고 편리하게
            </h1>
          </motion.div>
        </div>
      </div>
      
      {/* 카카오톡 버튼 — 모바일에서 크기 축소 */}
      <div className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[100]">
        <motion.a 
          href="http://pf.kakao.com/_bvZtG"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#FAE100] w-16 h-16 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex flex-col items-center justify-center gap-1 sm:gap-1.5 cursor-pointer"
        >
          <div className="bg-[#3C1E1E] w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center">
            <span className="text-[#FAE100] font-black text-[8px] sm:text-xs tracking-tighter">TALK</span>
          </div>
          <span className="text-[#3C1E1E] text-[8px] sm:text-xs font-black">상담하기</span>
        </motion.a>
      </div>
    </section>
  );
};

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    residentId: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // FormSubmit API를 통해 간병인 등록 신청을 이메일로 전송
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    fetch("https://formsubmit.co/ajax/steave5873@naver.com", {
      method: "POST",
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: "[간병인 등록] 새로운 간병인 등록 신청",
        _template: "table",
        _captcha: "false",
        "이름": formData.name,
        "주민등록번호": formData.residentId,
        "주소": formData.address,
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitSuccess(true);
        setFormData({ name: '', residentId: '', address: '' });
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        setErrorMsg(data.message || '전송에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      }
    })
    .catch(() => setErrorMsg('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해 주세요.'))
    .finally(() => setIsSubmitting(false));
  };

  return (
    <section id="registration" className="h-full flex flex-col justify-center bg-slate-900 text-white px-6">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1 bg-white/10 rounded-full border border-white/20 mb-4">
            <span className="text-med-cyan font-black text-xs tracking-widest uppercase">Registration</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">간병인 등록 신청</h2>
          <p className="text-slate-400 text-base">
            클라우드나인 메디케어와 함께할 전문 간병인을 모집합니다.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">이름</label>
                <input 
                  type="text" 
                  required
                  placeholder="성함을 입력하세요"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-med-cyan transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">주민등록번호</label>
                <input 
                  type="text" 
                  required
                  placeholder="000000-0000000"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-med-cyan transition-colors"
                  value={formData.residentId}
                  onChange={(e) => setFormData({...formData, residentId: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">주소</label>
              <input 
                type="text" 
                required
                placeholder="상세 주소를 입력하세요"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-med-cyan transition-colors"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
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
                  <><CheckCircle2 className="w-5 h-5" /> 등록 신청이 완료되었습니다</>
                ) : isSubmitting ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> 접수 중...</>
                ) : (
                  '등록 신청하기'
                )}
              </button>
            </div>
          </form>
          
          <p className="mt-6 text-center text-slate-500 text-xs">
            * 수집된 개인정보는 간병인 등록 및 관리 목적으로만 사용되며, 관련 법령에 따라 안전하게 보호됩니다.
          </p>
        </motion.div>
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
          <p className="text-slate-400 text-base">
            가족이 직접 간병하시는 경우 필요한 행정 지원 및 교육 신청을 위한 양식입니다.
          </p>
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
      action: () => onNavigate(5)
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



const Footer = () => {
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
            <a href="#" className="hover:text-med-cyan transition-colors">개인정보처리방침</a>
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
        <h3 className="text-2xl font-black text-white mb-2" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.2)' }}>빠른 상담 신청</h3>
        <p className="text-white/70 text-sm">연락처를 남겨주시면 전문 상담사가 즉시 안내해 드립니다.</p>
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
            className={`w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all ${
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
                무료 상담 신청하기 <ArrowRight className="w-4 h-4" />
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

const ConsultationSection = () => {
  return (
    <section className="h-full overflow-y-auto bg-slate-50 text-slate-800 scroll-smooth">
      {/* Hero Section with Form (Lead Generation Layout) */}
      <div className="relative min-h-[90vh] lg:h-[85vh] flex items-center justify-center overflow-hidden pt-20 pb-10">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000"
            alt="Medical Consultation"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
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
                요양보호사 매칭부터 전문적인 병원 동행까지, 우리 가족을 위한 믿을 수 있는 선택. 지금 바로 전문가와 상담하세요.
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


      <Footer />
    </section>
  );
};

export default function App() {
  // 섹션별 고유 해시 — URL로 직접 접근 가능
  const sectionHashes = ['home', 'registration', 'family', 'longterm', 'reviews', 'consultation'];

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
    <RegistrationForm />,
    <FamilyCareForm />,
    <LongTermCare onNavigate={handleSetSection} />,
    <Testimonials />,
    <ConsultationSection />,
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
