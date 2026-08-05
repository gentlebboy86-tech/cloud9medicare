import {type ReactNode, useMemo, useState} from 'react';
import {
  Accessibility,
  ArrowLeft,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Download,
  HeartHandshake,
  Hospital,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Stethoscope,
  UserRoundCheck,
  WalletCards,
} from 'lucide-react';

type Mobility = '독립 보행' | '부축 필요' | '휠체어 이용';
type Support = '접수/수납' | '진료 동행' | '검사 동행' | '입퇴원 지원';
type GenderPreference = '상관없음' | '여성 매니저' | '남성 매니저';

type RequestState = {
  patientName: string;
  guardianPhone: string;
  hospital: string;
  appointmentDate: string;
  appointmentTime: string;
  area: string;
  mobility: Mobility;
  support: Support;
  genderPreference: GenderPreference;
  memo: string;
};

type Manager = {
  id: string;
  name: string;
  role: string;
  area: string;
  score: number;
  rating: number;
  jobs: number;
  price: number;
  tags: string[];
  available: string;
  distance: string;
  accent: string;
};

const managers: Manager[] = [
  {
    id: 'kim',
    name: '김서연',
    role: '상급 병원동행매니저',
    area: '강남 · 서초 · 송파',
    score: 96,
    rating: 4.9,
    jobs: 382,
    price: 39000,
    tags: ['대학병원 동선 숙지', '검사실 이동', '보호자 리포트'],
    available: '오늘 오후 가능',
    distance: '2.4km',
    accent: 'bg-[#007c89]',
  },
  {
    id: 'park',
    name: '박민재',
    role: '재활 · 휠체어 이동 전문',
    area: '송파 · 강동 · 하남',
    score: 91,
    rating: 4.8,
    jobs: 264,
    price: 42000,
    tags: ['휠체어 보조', '재활의학과', '차량 승하차'],
    available: '내일 오전 가능',
    distance: '4.1km',
    accent: 'bg-[#b7791f]',
  },
  {
    id: 'lee',
    name: '이하은',
    role: '어르신 정서 케어 특화',
    area: '마포 · 용산 · 중구',
    score: 88,
    rating: 4.7,
    jobs: 219,
    price: 36000,
    tags: ['초진 안내', '복약 동행', '상세 기록'],
    available: '예약 가능',
    distance: '5.8km',
    accent: 'bg-[#9f3a55]',
  },
];

const supportOptions: Support[] = ['접수/수납', '진료 동행', '검사 동행', '입퇴원 지원'];
const mobilityOptions: Mobility[] = ['독립 보행', '부축 필요', '휠체어 이용'];
const genderOptions: GenderPreference[] = ['상관없음', '여성 매니저', '남성 매니저'];
const currency = new Intl.NumberFormat('ko-KR');

const csvCell = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

const downloadManagersExcel = () => {
  const headers = [
    '매니저ID',
    '이름',
    '직무',
    '활동지역',
    '적합도',
    '평점',
    '수행건수',
    '시간당요금',
    '가능시간',
    '거리',
    '전문태그',
    '관리상태',
    '담당자메모',
    '최근연락일',
  ];
  const rows = managers.map((manager) => [
    manager.id,
    manager.name,
    manager.role,
    manager.area,
    `${manager.score}%`,
    manager.rating,
    manager.jobs,
    manager.price,
    manager.available,
    manager.distance,
    manager.tags.join(', '),
    '',
    '',
    '',
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob([`\uFEFF${csv}`], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `병원동행_매니저_관리_${new Date().toISOString().slice(0, 10)}.csv`;
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

export default function HospitalCompanionApp() {
  const [request, setRequest] = useState<RequestState>({
    patientName: '홍길동',
    guardianPhone: '010-2488-9739',
    hospital: '서울아산병원',
    appointmentDate: '2026-07-20',
    appointmentTime: '09:30',
    area: '송파구 잠실동',
    mobility: '부축 필요',
    support: '진료 동행',
    genderPreference: '상관없음',
    memo: '고혈압 약 복용 중입니다. 접수 후 진료까지 동행이 필요합니다.',
  });
  const [selectedManagerId, setSelectedManagerId] = useState(managers[0].id);

  const selected = useMemo(
    () => managers.find((manager) => manager.id === selectedManagerId) ?? managers[0],
    [selectedManagerId],
  );

  const estimatedTotal = selected.price * 3 + 8000;

  const updateRequest = <K extends keyof RequestState>(key: K, value: RequestState[K]) => {
    setRequest((current) => ({...current, [key]: value}));
  };

  return (
    <main className="min-h-screen bg-[#f6f8f5] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <a href="/" className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <ArrowLeft className="h-5 w-5" />
            </a>
            <div>
              <p className="text-sm font-black leading-tight text-[#00616b]">클라우드나인 메디케어</p>
              <h1 className="text-base font-black leading-tight sm:text-lg">병원동행매니저 매칭</h1>
            </div>
          </div>
          <a
            href="tel:1688-9739"
            className="flex h-10 items-center gap-2 rounded-lg bg-slate-950 px-3 text-sm font-bold text-white transition hover:bg-slate-800"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">1688-9739</span>
          </a>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[390px_1fr] lg:px-8">
        <aside className="space-y-5">
          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase text-[#007c89]">동행 요청</p>
                <h2 className="text-xl font-black">진료 일정 입력</h2>
              </div>
              <SlidersHorizontal className="h-5 w-5 text-slate-400" />
            </div>

            <div className="space-y-3">
              <Field label="어르신 성함">
                <input value={request.patientName} onChange={(event) => updateRequest('patientName', event.target.value)} className="app-input" />
              </Field>
              <Field label="보호자 연락처">
                <input
                  value={request.guardianPhone}
                  onChange={(event) => updateRequest('guardianPhone', formatPhone(event.target.value))}
                  inputMode="tel"
                  className="app-input"
                />
              </Field>
              <Field label="병원/진료과">
                <input value={request.hospital} onChange={(event) => updateRequest('hospital', event.target.value)} className="app-input" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="예약일">
                  <input type="date" value={request.appointmentDate} onChange={(event) => updateRequest('appointmentDate', event.target.value)} className="app-input" />
                </Field>
                <Field label="예약 시간">
                  <input type="time" value={request.appointmentTime} onChange={(event) => updateRequest('appointmentTime', event.target.value)} className="app-input" />
                </Field>
              </div>
              <Field label="출발 지역">
                <input value={request.area} onChange={(event) => updateRequest('area', event.target.value)} className="app-input" />
              </Field>

              <SegmentedControl label="필요 지원" options={supportOptions} value={request.support} onChange={(value) => updateRequest('support', value)} />
              <SegmentedControl label="이동 상태" options={mobilityOptions} value={request.mobility} onChange={(value) => updateRequest('mobility', value)} />
              <SegmentedControl label="매니저 선호" options={genderOptions} value={request.genderPreference} onChange={(value) => updateRequest('genderPreference', value)} />

              <Field label="요청 메모">
                <textarea
                  value={request.memo}
                  onChange={(event) => updateRequest('memo', event.target.value)}
                  className="min-h-24 w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#007c89] focus:ring-4 focus:ring-[#007c89]/10"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-base font-black">매칭 진행</h2>
            {['요청 접수', '조건 분석', '매니저 확정', '동행 리포트'].map((label, index) => (
              <div key={label} className="mb-3 flex items-center gap-3 last:mb-0">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${index < 2 ? 'bg-[#007c89] text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{label}</p>
                  <p className="text-xs text-slate-500">{index === 0 ? '완료' : index === 1 ? '진행중' : '대기'}</p>
                </div>
                {index === 0 && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              </div>
            ))}
          </section>
        </aside>

        <section className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Metric icon={<CalendarClock />} label="예상 매칭" value="12분" />
            <Metric icon={<ShieldCheck />} label="검증 매니저" value="128명" />
            <Metric icon={<WalletCards />} label="예상 비용" value={`${currency.format(estimatedTotal)}원`} />
          </div>

          <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase text-[#007c89]">추천 후보</p>
                <h2 className="text-2xl font-black">조건에 맞는 매니저</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={downloadManagersExcel} className="flex h-10 items-center gap-2 rounded-lg bg-[#007c89] px-3 text-sm font-black text-white transition hover:bg-[#00616b]">
                  <Download className="h-4 w-4" />
                  엑셀 다운로드
                </button>
                <div className="flex h-10 items-center gap-2 rounded-lg bg-[#edf7f4] px-3 text-sm font-bold text-[#00616b]">
                  <Hospital className="h-4 w-4" />
                  {request.hospital}
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              {managers.map((manager) => {
                const active = manager.id === selectedManagerId;
                return (
                  <button
                    key={manager.id}
                    onClick={() => setSelectedManagerId(manager.id)}
                    className={`min-h-[284px] rounded-lg border p-4 text-left transition ${
                      active ? 'border-[#007c89] bg-[#f0fbf8] shadow-md' : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${manager.accent} text-white`}>
                        <UserRoundCheck className="h-6 w-6" />
                      </div>
                      <span className="rounded-md bg-white px-2 py-1 text-xs font-black text-[#007c89] ring-1 ring-slate-200">
                        {manager.score}% 적합
                      </span>
                    </div>
                    <h3 className="text-lg font-black">{manager.name} 매니저</h3>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{manager.role}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {manager.distance}
                      </span>
                      <span className="flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {manager.rating}
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-bold text-slate-500">{manager.area}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {manager.tags.map((tag) => (
                        <span key={tag} className="rounded-md bg-white px-2 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                      <div>
                        <p className="text-xs text-slate-500">{manager.available}</p>
                        <p className="font-black">{currency.format(manager.price)}원/시간</p>
                      </div>
                      <ChevronRight className={`h-5 w-5 ${active ? 'text-[#007c89]' : 'text-slate-300'}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-black">확정 전 확인</h2>
                <BadgeCheck className="h-5 w-5 text-[#007c89]" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Info icon={<Accessibility />} label="이동 상태" value={request.mobility} />
                <Info icon={<HeartHandshake />} label="지원 범위" value={request.support} />
                <Info icon={<Clock3 />} label="일정" value={`${request.appointmentDate} ${request.appointmentTime}`} />
                <Info icon={<MapPin />} label="출발 지역" value={request.area} />
                <Info icon={<Stethoscope />} label="병원" value={request.hospital} />
                <Info icon={<ClipboardCheck />} label="선호 조건" value={request.genderPreference} />
              </div>
              <div className="mt-4 rounded-lg bg-[#fff7ed] p-4 text-sm font-semibold leading-6 text-[#9a3412]">
                {selected.name} 매니저가 병원 도착, 접수, 진료실 이동, 수납, 복약 안내까지 동행하고 보호자에게 요약 리포트를 전송합니다.
              </div>
            </div>

            <div className="rounded-lg border border-[#007c89]/30 bg-[#00616b] p-4 text-white shadow-sm sm:p-5">
              <p className="text-sm font-bold text-teal-100">선택된 매니저</p>
              <h2 className="mt-1 text-2xl font-black">{selected.name}</h2>
              <p className="mt-1 text-sm text-teal-50">{selected.role}</p>
              <div className="mt-5 space-y-3 text-sm">
                <SummaryRow label="수행 건수" value={`${selected.jobs}건`} />
                <SummaryRow label="만족도" value={`${selected.rating}/5.0`} />
                <SummaryRow label="기본 요금" value={`${currency.format(selected.price)}원/시간`} />
                <SummaryRow label="예상 합계" value={`${currency.format(estimatedTotal)}원`} />
              </div>
              <button className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-white font-black text-[#00616b] transition hover:bg-teal-50">
                <MessageCircle className="h-5 w-5" />
                보호자에게 매칭 안내
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Field({label, children}: {label: string; children: ReactNode}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black text-slate-500">{label}</span>
      {children}
    </label>
  );
}

function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-black text-slate-500">{label}</p>
      <div className="grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`min-h-9 rounded-md px-2 text-xs font-black transition ${
              option === value ? 'bg-white text-[#00616b] shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function Metric({icon, label, value}: {icon: ReactNode; label: string; value: string}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf7f4] text-[#007c89]">{icon}</div>
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}

function Info({icon, label, value}: {icon: ReactNode; label: string; value: string}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#007c89] ring-1 ring-slate-200">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="truncate text-sm font-black">{value}</p>
      </div>
    </div>
  );
}

function SummaryRow({label, value}: {label: string; value: string}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-teal-100">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
