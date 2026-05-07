import React, {useEffect, useMemo, useState} from 'react';
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Lock,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';

const ADMIN_PIN = '9739';
const GOOGLE_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwcrwkHP3kXhJgXapnbfmllPBf2uEwCfqCAQGaESIA7sBrPkE-qYwZ7STRV6bt744u6AA/exec';

type SendStatus = 'idle' | 'saving' | 'sending' | 'success' | 'error' | 'fallback';

const onlyDigits = (value: string) => value.replace(/\D/g, '');

const normalizePhone = (value: string) => {
  const digits = onlyDigits(value);
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value.trim();
};

const isValidMobilePhone = (value: string) => /^01[016789]\d{7,8}$/.test(onlyDigits(value));

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const extractField = (text: string, labels: string[]) => {
  const escapedLabels = labels.map(escapeRegExp);
  const pattern = new RegExp(
    `(?:^|\\n)\\s*(?:${escapedLabels.join('|')})\\s*(?:[:=：])?\\s*([^\\n\\r]*)`,
    'i',
  );
  return text.match(pattern)?.[1]?.trim() ?? '';
};

export default function MessageApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);

  const [rawText, setRawText] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientBirth, setPatientBirth] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianId, setGuardianId] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [admissionPeriod, setAdmissionPeriod] = useState('');
  const [dailyCareFee, setDailyCareFee] = useState('');
  const [carePeriod, setCarePeriod] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<SendStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const smsTarget = useMemo(() => onlyDigits(guardianPhone), [guardianPhone]);

  useEffect(() => {
    document.title = '문자발송 시스템';
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => document.head.removeChild(meta);
  }, []);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
      return;
    }

    setPinError(true);
    setPin('');
    setTimeout(() => setPinError(false), 2000);
  };

  useEffect(() => {
    if (!rawText.trim()) return;

    const nextPatientName = extractField(rawText, ['환자이름', '환자 이름', '환자명', '환자']);
    const nextPatientBirth = extractField(rawText, ['환자생년월일', '환자 생년월일', '생년월일']);
    const nextGuardianName = extractField(rawText, [
      '보호자(간병인)이름',
      '보호자(간병인) 이름',
      '보호자이름',
      '보호자 이름',
      '간병인이름',
      '간병인 이름',
    ]);
    const nextGuardianId = extractField(rawText, [
      '보호자주민번호 뒤1자리까지',
      '보호자 주민번호 뒤1자리까지',
      '보호자주민번호',
      '주민번호',
    ]);
    const nextGuardianPhone = extractField(rawText, [
      '보호자전화번호',
      '보호자 전화번호',
      '보호자연락처',
      '보호자 연락처',
      '전화번호',
    ]);
    const nextHospitalName = extractField(rawText, ['병원명', '병원']);
    const nextAdmissionPeriod = extractField(rawText, ['입원기간', '입원 기간', '입원일']);
    const nextDailyCareFee = extractField(rawText, ['일간병비', '일 간병비', '간병비']);
    const nextCarePeriod = extractField(rawText, ['간병기간', '간병 기간']);

    if (nextPatientName) setPatientName(nextPatientName);
    if (nextPatientBirth) setPatientBirth(nextPatientBirth);
    if (nextGuardianName) setGuardianName(nextGuardianName);
    if (nextGuardianId) setGuardianId(nextGuardianId);
    if (nextGuardianPhone) setGuardianPhone(normalizePhone(nextGuardianPhone));
    if (nextHospitalName) setHospitalName(nextHospitalName);
    if (nextAdmissionPeriod) setAdmissionPeriod(nextAdmissionPeriod);
    if (nextDailyCareFee) setDailyCareFee(nextDailyCareFee);
    if (nextCarePeriod) setCarePeriod(nextCarePeriod);

    const phoneMatch = rawText.match(/01[016789][-\s]?\d{3,4}[-\s]?\d{4}/);
    if (phoneMatch) setGuardianPhone(normalizePhone(phoneMatch[0]));
  }, [rawText]);

  useEffect(() => {
    const template = `안녕하세요. 클라우드나인 메디케어입니다.
요청하신 간병 서비스를 위해 아래와 같이 안내드립니다.

환자이름: ${patientName || '-'}
환자생년월일: ${patientBirth || '-'}
보호자(간병인)이름: ${guardianName || '-'}
병원명: ${hospitalName || '-'}
입원기간: ${admissionPeriod || '-'}
일간병비: ${dailyCareFee || '-'}
간병기간: ${carePeriod || '-'}

위 내용을 확인하시고 '동의'라고 답장 주시면 접수가 진행됩니다.`;

    setMessage(template);
  }, [patientName, patientBirth, guardianName, hospitalName, admissionPeriod, dailyCareFee, carePeriod]);

  // 구글 시트 저장 - 3초 타임아웃 적용 (네트워크 지연 시 SMS 발송 차단 방지)
  const saveToGoogleSheet = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          patientName,
          patientBirth,
          guardianName,
          guardianId,
          guardianPhone: normalizePhone(guardianPhone),
          hospitalName,
          admissionPeriod,
          dailyCareFee,
          carePeriod,
          message,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  // SMS URL 생성 헬퍼
  const buildSmsUrl = () => {
    const encodedMessage = encodeURIComponent(message.trim());
    const isAppleDevice = /iphone|ipad|ipod/i.test(navigator.userAgent);
    // iOS는 &, Android는 ? 구분자 사용
    return isAppleDevice
      ? `sms:${smsTarget}&body=${encodedMessage}`
      : `sms:${smsTarget}?body=${encodedMessage}`;
  };

  // 클립보드에 메시지 복사 (SMS 앱 실행 실패 시 폴백용)
  const copyMessageToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.trim());
      return true;
    } catch {
      // clipboard API 미지원 시 execCommand 폴백
      const textarea = document.createElement('textarea');
      textarea.value = message.trim();
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(textarea);
      return ok;
    }
  };

  // SMS 앱을 anchor 클릭 방식으로 실행 (브라우저 호환성 향상)
  const openSmsApp = () => {
    const smsUrl = buildSmsUrl();
    const link = document.createElement('a');
    link.setAttribute('href', smsUrl);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    // cleanup은 약간 지연 (브라우저가 URL을 처리할 시간 확보)
    setTimeout(() => document.body.removeChild(link), 100);
  };

  // SMS 앱 실행 실패 시 폴백: 메시지 복사 후 기본 SMS 앱 열기
  const handleSmsFallback = async () => {
    await copyMessageToClipboard();
    // body 없이 전화번호만으로 SMS 앱 열기 (URL 길이 문제 회피)
    const simpleSmsUrl = `sms:${smsTarget}`;
    window.location.href = simpleSmsUrl;
    setStatus('success');
    setErrorMessage('');
    setTimeout(() => setStatus('idle'), 4000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!patientName.trim()) {
      setStatus('error');
      setErrorMessage('환자이름을 입력해 주세요.');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    if (!isValidMobilePhone(guardianPhone)) {
      setStatus('error');
      setErrorMessage('보호자전화번호를 휴대폰 번호 형식으로 입력해 주세요.');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    if (!message.trim()) {
      setStatus('error');
      setErrorMessage('발송할 문자 내용을 입력해 주세요.');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    // 1단계: 구글 시트 저장 (실패해도 SMS 발송은 진행)
    setStatus('saving');
    try {
      await saveToGoogleSheet();
    } catch (err) {
      console.error('구글 시트 저장 실패 (SMS 발송은 계속 진행):', err);
    }

    // 2단계: SMS 앱 실행 (anchor click 방식)
    setStatus('sending');

    // visibilitychange 이벤트로 SMS 앱이 실제로 열렸는지 감지
    let smsAppOpened = false;
    const handleVisibility = () => {
      if (document.hidden) smsAppOpened = true;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 약간의 딜레이 후 SMS 앱 실행 (상태 업데이트 반영 대기)
    await new Promise(resolve => setTimeout(resolve, 300));
    openSmsApp();

    // 1.5초 후 SMS 앱 열렸는지 판정
    setTimeout(() => {
      document.removeEventListener('visibilitychange', handleVisibility);

      if (smsAppOpened) {
        // SMS 앱이 정상적으로 열림
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        // SMS 앱이 열리지 않음 → 폴백 모드 제공
        setStatus('fallback');
        setErrorMessage(
          '문자 앱이 열리지 않았습니다.\n아래 버튼을 눌러 메시지를 복사 후 직접 발송해 주세요.'
        );
      }
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
            <Lock className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">관리자 인증</h2>
          <p className="text-slate-400 text-sm mb-8 text-center">
            문자발송 시스템 접근을 위해
            <br />
            관리자 암호를 입력해 주세요.
          </p>

          <form onSubmit={handlePinSubmit} className="w-full">
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="비밀번호 4자리"
              className={`w-full bg-slate-900/50 border ${
                pinError
                  ? 'border-red-500/50 focus:border-red-500'
                  : 'border-slate-700/50 focus:border-blue-500'
              } text-white text-center tracking-widest text-xl rounded-2xl py-4 mb-4 focus:outline-none transition-colors`}
              autoFocus
            />
            {pinError && (
              <p className="text-red-400 text-sm text-center mb-4 animate-fade-in">
                암호가 일치하지 않습니다.
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-900/20 active:scale-95 transition-transform"
            >
              접속하기
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-slate-900 pb-24 font-sans text-slate-100 overflow-x-hidden">
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/5 px-5 py-4 flex items-center justify-center">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          문자발송 시스템
        </h2>
      </div>

      <form onSubmit={handleSend} className="px-5 py-6 space-y-6 max-w-md mx-auto">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">정보 붙여넣기</h3>
          </div>
          <textarea
            placeholder={`환자이름: 배명기
환자생년월일:610401
보호자(간병인)이름: 조금선
보호자주민번호 뒤1자리까지:590118-2
보호자전화번호:010-4885-2014
병원명:
입원기간:2026.05.07
일간병비:10만원
간병기간:`}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 text-white placeholder-slate-500 rounded-2xl p-4 text-sm focus:outline-none focus:border-amber-500/50 transition-colors resize-none min-h-[220px]"
          />
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white">자동 추출 결과</h3>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="환자이름" value={patientName} onChange={setPatientName} />
              <Field label="환자생년월일" value={patientBirth} onChange={setPatientBirth} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="보호자(간병인)이름" value={guardianName} onChange={setGuardianName} />
              <Field label="보호자주민번호 뒤1자리까지" value={guardianId} onChange={setGuardianId} />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-blue-400 ml-1">
                보호자전화번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-400/50">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(normalizePhone(e.target.value))}
                  className="w-full bg-blue-900/20 border border-blue-500/30 text-white rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none focus:border-blue-500 font-bold tracking-wide"
                />
              </div>
            </div>

            <Field label="병원명" value={hospitalName} onChange={setHospitalName} />

            <div className="grid grid-cols-2 gap-3">
              <Field label="입원기간" value={admissionPeriod} onChange={setAdmissionPeriod} />
              <Field label="일간병비" value={dailyCareFee} onChange={setDailyCareFee} />
            </div>

            <Field label="간병기간" value={carePeriod} onChange={setCarePeriod} />
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-5 shadow-lg mb-6">
          <h3 className="text-sm font-bold text-white mb-3">발송 문자 내용</h3>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700/50 text-slate-200 placeholder-slate-500 rounded-2xl p-3 text-xs leading-relaxed focus:outline-none focus:border-blue-500 transition-colors resize-none min-h-[190px]"
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pb-8">
          <div className="max-w-md mx-auto">
            {status === 'error' && (
              <StatusMessage tone="error" message={errorMessage || '입력 내용을 확인해 주세요.'} />
            )}
            {status === 'success' && (
              <StatusMessage tone="success" message="구글 시트 저장 후 문자 앱을 실행했습니다." />
            )}

            {/* SMS 앱 실행 실패 시 폴백 UI */}
            {status === 'fallback' && (
              <div className="mb-3 space-y-2">
                <div className="flex items-center justify-center text-xs p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                  <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                  문자 앱이 자동으로 열리지 않았습니다.
                </div>
                <button
                  type="button"
                  onClick={handleSmsFallback}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold py-3.5 rounded-2xl shadow-lg active:scale-95 transition-transform flex items-center justify-center text-sm"
                >
                  📋 메시지 복사 후 문자 앱 열기
                </button>
                <button
                  type="button"
                  onClick={() => { setStatus('idle'); setErrorMessage(''); }}
                  className="w-full text-slate-400 text-xs py-2 active:text-white transition-colors"
                >
                  닫기
                </button>
              </div>
            )}

            {status !== 'fallback' && (
              <button
                type="submit"
                disabled={status === 'saving' || status === 'sending'}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-900/20 active:scale-95 transition-transform flex items-center justify-center text-lg disabled:opacity-70 disabled:active:scale-100"
              >
                {status === 'saving' || status === 'sending' ? (
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {status === 'saving' ? '구글 시트 저장 중...' : '문자 앱 실행 중...'}
                  </div>
                ) : (
                  <>
                    시트 저장 후 문자 발송
                    <Send className="w-5 h-5 ml-2 drop-shadow-md" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-slate-400 ml-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900/50 border border-slate-700/50 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500"
      />
    </div>
  );
}

function StatusMessage({tone, message}: {tone: 'error' | 'success'; message: string}) {
  const isError = tone === 'error';
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      className={`flex items-center justify-center text-xs p-2.5 rounded-xl mb-3 animate-fade-in shadow-lg ${
        isError
          ? 'text-red-400 bg-red-500/10 border border-red-500/20'
          : 'text-emerald-300 bg-emerald-500/10 border border-emerald-500/20'
      }`}
    >
      <Icon className="w-4 h-4 mr-1.5 shrink-0" />
      {message}
    </div>
  );
}
