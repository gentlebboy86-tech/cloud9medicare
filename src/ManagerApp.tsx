import {type FormEvent, type ReactNode, useMemo, useState} from 'react';
import {
  ArrowLeft,
  BriefcaseMedical,
  CheckCircle2,
  Download,
  FileCheck2,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

type ManagerForm = {
  name: string;
  phone: string;
  birthYear: string;
  area: string;
  referrer: string;
  experience: string;
  specialties: string[];
  carSupport: boolean;
  wheelchairSupport: boolean;
  memo: string;
};

const specialtyOptions = ['초진 안내', '검사 동행', '재활 동행', '휠체어 이동 보조', '입퇴원 지원', '약국 동행', '보호자 보고'];

const initialForm: ManagerForm = {
  name: '',
  phone: '',
  birthYear: '',
  area: '',
  referrer: '',
  experience: '1년 미만',
  specialties: ['초진 안내', '검사 동행'],
  carSupport: false,
  wheelchairSupport: false,
  memo: '',
};

const csvCell = (value: string | number | boolean) => `"${String(value).replace(/"/g, '""')}"`;

const downloadManagerTemplate = () => {
  const headers = [
    '이름',
    '연락처',
    '출생연도',
    '주요 활동 지역',
    '추천인',
    '관련 경력',
    '가능 서비스',
    '자차 이동 지원',
    '휠체어 이동 보조',
    '심사 상태',
    '담당자 메모',
  ];
  const sample = [
    '김은실',
    '010-1234-5678',
    '1978',
    '부산 동래구, 연제구',
    '박민수 매니저',
    '3년',
    '초진 안내, 검사 동행, 보호자 보고',
    '가능',
    '가능',
    '검토 대기',
    '',
  ];
  const csv = [headers, sample].map((row) => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `병원동행_매니저_지원자_관리양식_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

export default function ManagerApp() {
  const [form, setForm] = useState<ManagerForm>(initialForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  const selectedServices = useMemo(() => form.specialties.join(', '), [form.specialties]);

  const update = <K extends keyof ManagerForm>(key: K, value: ManagerForm[K]) => {
    setForm((current) => ({...current, [key]: value}));
  };

  const toggleSpecialty = (specialty: string) => {
    setForm((current) => ({
      ...current,
      specialties: current.specialties.includes(specialty)
        ? current.specialties.filter((item) => item !== specialty)
        : [...current.specialties, specialty],
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.area.trim()) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    try {
      const response = await fetch('https://formsubmit.co/ajax/medicare@cloud9sol.co.kr', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Accept: 'application/json'},
        body: JSON.stringify({
          _subject: '[병원동행 매니저 지원] 신규 지원서',
          _template: 'table',
          _captcha: 'false',
          이름: form.name,
          연락처: form.phone,
          출생연도: form.birthYear || '미입력',
          주요활동지역: form.area,
          추천인: form.referrer || '미입력',
          관련경력: form.experience,
          가능서비스: selectedServices,
          자차이동지원: form.carSupport ? '가능' : '불가/미입력',
          휠체어이동보조: form.wheelchairSupport ? '가능' : '불가/미입력',
          소개및메모: form.memo || '미입력',
        }),
      });
      if (!response.ok) throw new Error('submit_failed');
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-[#f2f8fa] text-[#162832]">
      <header className="border-b border-[#d9e6eb] bg-white">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5">
          <a href="/" className="flex items-center gap-2 text-sm font-black text-[#075f8f]">
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </a>
          <div className="text-center">
            <strong className="block text-sm">클라우드나인 메디케어</strong>
            <span className="mt-1 block text-xs font-bold text-slate-500">매니저 지원센터</span>
          </div>
          <button className="flex items-center gap-2 rounded-md border border-[#b9ddec] bg-[#e6f5fb] px-3 py-2 text-xs font-black text-[#075f8f]">
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-9">
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-xs font-black tracking-[0.18em] text-[#078dcc]">MANAGER PROFILE</p>
            <h1 className="text-3xl font-black">매니저 지원 정보</h1>
            <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-slate-600">
              고객과의 안전한 매칭을 위해 정확한 정보를 입력해주세요. 운영센터 확인 후 심사 상태를 안내드립니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadManagerTemplate}
              className="flex h-11 items-center gap-2 rounded-md bg-[#078dcc] px-4 text-sm font-black text-white transition hover:bg-[#075f8f]"
            >
              <Download className="h-4 w-4" />
              엑셀 양식
            </button>
            <div className="min-w-[116px] rounded-md border border-[#d9e6eb] border-t-4 border-t-[#d99a2b] bg-white px-4 py-3">
              <span className="block text-[10px] font-bold text-slate-500">지원 상태</span>
              <strong className="mt-1 block text-sm">작성 중</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-hidden rounded-lg border border-[#d9e6eb] bg-white shadow-sm">
          <section className="border-b border-[#d9e6eb] p-6">
            <div className="mb-5 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#078dcc]" />
              <h2 className="text-lg font-black">기본 정보</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ManagerField label="이름 *">
                <input value={form.name} onChange={(event) => update('name', event.target.value)} className="app-input" />
              </ManagerField>
              <ManagerField label="연락처 *">
                <input
                  value={form.phone}
                  onChange={(event) => update('phone', formatPhone(event.target.value))}
                  inputMode="tel"
                  className="app-input"
                />
              </ManagerField>
              <ManagerField label="출생연도">
                <input value={form.birthYear} onChange={(event) => update('birthYear', event.target.value)} className="app-input" />
              </ManagerField>
              <ManagerField label="주요 활동 지역 *">
                <input value={form.area} onChange={(event) => update('area', event.target.value)} className="app-input" />
              </ManagerField>
              <ManagerField label="추천인">
                <input
                  value={form.referrer}
                  onChange={(event) => update('referrer', event.target.value)}
                  placeholder="추천인 이름 또는 연락처"
                  className="app-input border-[#86c9e6] ring-4 ring-[#078dcc]/10"
                />
              </ManagerField>
              <ManagerField label="관련 경력">
                <select value={form.experience} onChange={(event) => update('experience', event.target.value)} className="app-input">
                  <option>1년 미만</option>
                  <option>1년</option>
                  <option>2년</option>
                  <option>3년</option>
                  <option>5년 이상</option>
                </select>
              </ManagerField>
            </div>
          </section>

          <section className="border-b border-[#d9e6eb] p-6">
            <div className="mb-5 flex items-center gap-2">
              <BriefcaseMedical className="h-5 w-5 text-[#078dcc]" />
              <h2 className="text-lg font-black">가능한 동행 서비스</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {specialtyOptions.map((specialty) => {
                const selected = form.specialties.includes(specialty);
                return (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => toggleSpecialty(specialty)}
                    className={`min-h-10 rounded-md border px-3 text-sm font-black transition ${
                      selected
                        ? 'border-[#86c9e6] bg-[#e6f5fb] text-[#075f8f]'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {specialty}
                  </button>
                );
              })}
            </div>
            <div className="mt-5 flex flex-col gap-3 text-sm font-bold text-slate-700 sm:flex-row sm:gap-7">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={form.carSupport} onChange={(event) => update('carSupport', event.target.checked)} />
                자차 이동 지원 가능
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.wheelchairSupport}
                  onChange={(event) => update('wheelchairSupport', event.target.checked)}
                />
                휠체어 이동 보조 가능
              </label>
            </div>
          </section>

          <section className="p-6">
            <div className="mb-5 flex items-center gap-2">
              <FileCheck2 className="h-5 w-5 text-[#078dcc]" />
              <h2 className="text-lg font-black">소개 및 참고사항</h2>
            </div>
            <textarea
              value={form.memo}
              onChange={(event) => update('memo', event.target.value)}
              className="min-h-28 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#078dcc] focus:ring-4 focus:ring-[#078dcc]/10"
              placeholder="병원동행 경험, 응대 강점, 기록/보고 방식 등을 적어주세요."
            />
          </section>

          {status === 'error' && (
            <p className="mx-6 mb-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              필수 항목을 확인하거나 잠시 후 다시 제출해주세요.
            </p>
          )}
          {status === 'done' && (
            <p className="mx-6 mb-4 flex items-center gap-2 rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              지원서가 접수되었습니다.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'submitting' || status === 'done'}
            className="mx-6 mb-6 flex h-12 w-[calc(100%-48px)] items-center justify-center rounded-md bg-[#078dcc] text-base font-black text-white transition hover:bg-[#075f8f] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {status === 'submitting' ? '제출 중...' : status === 'done' ? '지원서 제출 완료' : '지원서 제출하기'}
          </button>
        </form>
      </div>
    </main>
  );
}

function ManagerField({label, children}: {label: string; children: ReactNode}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black text-slate-600">{label}</span>
      {children}
    </label>
  );
}
