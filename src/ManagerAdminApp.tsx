import {type ReactNode, useEffect, useMemo, useState} from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  XCircle,
} from 'lucide-react';

type ApplicationStatus = '검토 대기' | '승인 완료' | '보완 요청' | '반려';
type AdminView = 'applications' | 'managers';

const MANAGER_APPLICATIONS_STORAGE_KEY = 'cloud9-manager-applications';

type ManagerApplication = {
  id: string;
  submittedAt: string;
  name: string;
  phone: string;
  birthYear: string;
  area: string;
  referrer: string;
  experience: string;
  services: string[];
  carSupport: boolean;
  wheelchairSupport: boolean;
  memo: string;
  status: ApplicationStatus;
};

const initialApplications: ManagerApplication[] = [
  {
    id: 'MGR-20260713-001',
    submittedAt: '2026-07-13 10:24',
    name: '김은실',
    phone: '010-1234-5678',
    birthYear: '1978',
    area: '부산 동래구, 연제구',
    referrer: '박민수 매니저',
    experience: '3년',
    services: ['초진 안내', '검사 동행', '보호자 보고'],
    carSupport: true,
    wheelchairSupport: true,
    memo: '대학병원 검사 동행 경험이 있고 보호자 문자 보고 가능합니다.',
    status: '승인 완료',
  },
  {
    id: 'MGR-20260713-002',
    submittedAt: '2026-07-13 11:05',
    name: '이정희',
    phone: '010-8899-1200',
    birthYear: '1969',
    area: '서울 송파구, 강동구',
    referrer: '',
    experience: '5년 이상',
    services: ['재활 동행', '휠체어 이동 보조', '입퇴원 지원'],
    carSupport: false,
    wheelchairSupport: true,
    memo: '요양보호사 경력 6년, 휠체어 이동 보조 가능.',
    status: '승인 완료',
  },
];

const statusStyles: Record<ApplicationStatus, string> = {
  '검토 대기': 'bg-amber-50 text-amber-700 ring-amber-200',
  '승인 완료': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  '보완 요청': 'bg-sky-50 text-sky-700 ring-sky-200',
  반려: 'bg-red-50 text-red-700 ring-red-200',
};

const csvCell = (value: string | boolean) => `"${String(value).replace(/"/g, '""')}"`;

export default function ManagerAdminApp() {
  const [applications, setApplications] = useState<ManagerApplication[]>(() => {
    try {
      const saved = window.localStorage.getItem(MANAGER_APPLICATIONS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as ManagerApplication[]) : initialApplications;
    } catch {
      return initialApplications;
    }
  });
  const [selectedId, setSelectedId] = useState(initialApplications[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [activeView, setActiveView] = useState<AdminView>('applications');

  useEffect(() => {
    window.localStorage.setItem(MANAGER_APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  const approvedManagers = useMemo(
    () => applications.filter((application) => application.status === '승인 완료'),
    [applications],
  );

  const filteredApplications = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const source = activeView === 'managers' ? approvedManagers : applications;
    if (!keyword) return source;
    return source.filter((application) =>
      [application.name, application.phone, application.area, application.referrer, application.status]
        .join(' ')
        .toLowerCase()
        .includes(keyword),
    );
  }, [activeView, applications, approvedManagers, query]);

  const selected =
    filteredApplications.find((application) => application.id === selectedId) ?? filteredApplications[0];

  const counts = useMemo(
    () => ({
      waiting: applications.filter((item) => item.status === '검토 대기').length,
      approved: applications.filter((item) => item.status === '승인 완료').length,
      needs: applications.filter((item) => item.status === '보완 요청').length,
      rejected: applications.filter((item) => item.status === '반려').length,
    }),
    [applications],
  );

  const updateStatus = (id: string, status: ApplicationStatus) => {
    setApplications((current) => current.map((item) => (item.id === id ? {...item, status} : item)));
  };

  const downloadApplications = (items = applications, fileName = '매니저_지원_승인관리') => {
    const headers = [
      '지원ID',
      '접수일',
      '이름',
      '연락처',
      '출생연도',
      '활동지역',
      '추천인',
      '경력',
      '가능서비스',
      '자차지원',
      '휠체어보조',
      '상태',
      '메모',
    ];
    const rows = items.map((item) => [
      item.id,
      item.submittedAt,
      item.name,
      item.phone,
      item.birthYear,
      item.area,
      item.referrer || '-',
      item.experience,
      item.services.join(', '),
      item.carSupport ? '가능' : '불가',
      item.wheelchairSupport ? '가능' : '불가',
      item.status,
      item.memo,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(',')).join('\r\n');
    const blob = new Blob([`\uFEFF${csv}`], {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2 text-sm font-black text-slate-700">
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </a>
          <div className="text-center">
            <p className="text-xs font-black text-[#007c89]">MANAGER ADMIN</p>
            <h1 className="text-base font-black">매니저 지원 승인</h1>
          </div>
          <a href="/manager" className="rounded-md bg-[#007c89] px-3 py-2 text-xs font-black text-white">
            지원 화면
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <nav className="mb-5 flex gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm" aria-label="매니저 관리 메뉴">
          <AdminMenuButton
            active={activeView === 'applications'}
            icon={<ShieldCheck className="h-4 w-4" />}
            label="지원 승인"
            onClick={() => {
              setActiveView('applications');
              setQuery('');
            }}
          />
          <AdminMenuButton
            active={activeView === 'managers'}
            count={counts.approved}
            icon={<Users className="h-4 w-4" />}
            label="전체 매니저"
            onClick={() => {
              setActiveView('managers');
              setQuery('');
            }}
          />
        </nav>

        {activeView === 'applications' ? (
          <div className="mb-5 grid gap-3 md:grid-cols-4">
            <Metric label="검토 대기" value={counts.waiting} tone="amber" />
            <Metric label="승인 완료" value={counts.approved} tone="emerald" />
            <Metric label="보완 요청" value={counts.needs} tone="sky" />
            <Metric label="반려" value={counts.rejected} tone="red" />
          </div>
        ) : (
          <div className="mb-5 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <div>
              <p className="text-xs font-bold text-emerald-700">승인된 활동 매니저</p>
              <p className="mt-1 text-2xl font-black text-emerald-950">총 {counts.approved}명</p>
            </div>
            <Users className="h-9 w-9 text-emerald-600" />
          </div>
        )}

        <section className="grid gap-5 lg:grid-cols-[430px_1fr]">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black">{activeView === 'managers' ? '전체 매니저' : '지원자 목록'}</h2>
                <button
                  type="button"
                  onClick={() =>
                    activeView === 'managers'
                      ? downloadApplications(approvedManagers, '전체_매니저_명단')
                      : downloadApplications()
                  }
                  className="flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-xs font-black text-white"
                >
                  <Download className="h-4 w-4" />
                  엑셀
                </button>
              </div>
              <label className="flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="이름, 연락처, 지역 검색"
                  className="w-full bg-transparent text-sm font-semibold outline-none"
                />
              </label>
            </div>

            <div className="max-h-[620px] overflow-auto p-2">
              {filteredApplications.length === 0 ? (
                <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
                  <Users className="mb-3 h-8 w-8 text-slate-300" />
                  <p className="font-black text-slate-600">
                    {query
                      ? '검색 결과가 없습니다.'
                      : activeView === 'managers'
                        ? '아직 승인된 매니저가 없습니다.'
                        : '등록된 지원자가 없습니다.'}
                  </p>
                  {activeView === 'managers' && !query && (
                    <button
                      type="button"
                      onClick={() => setActiveView('applications')}
                      className="mt-3 text-sm font-black text-[#007c89]"
                    >
                      지원 승인으로 이동
                    </button>
                  )}
                </div>
              ) : filteredApplications.map((application) => (
                <button
                  key={application.id}
                  type="button"
                  onClick={() => setSelectedId(application.id)}
                  className={`mb-2 w-full rounded-md border p-3 text-left transition last:mb-0 ${
                    selected?.id === application.id
                      ? 'border-[#007c89] bg-[#eefaf7]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{application.name}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">{application.phone}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                  <p className="mt-3 text-xs font-bold text-slate-500">{application.area}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-500">{application.services.join(', ')}</p>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-col justify-between gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-black text-[#007c89]">{selected.id}</p>
                  <h2 className="mt-1 text-2xl font-black">{selected.name}</h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">{selected.submittedAt} 접수</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Info label="연락처" value={selected.phone} />
                <Info label="출생연도" value={selected.birthYear} />
                <Info label="활동지역" value={selected.area} />
                <Info label="추천인" value={selected.referrer || '미입력'} />
                <Info label="관련 경력" value={selected.experience} />
                <Info label="이동 지원" value={`자차 ${selected.carSupport ? '가능' : '불가'} / 휠체어 ${selected.wheelchairSupport ? '가능' : '불가'}`} />
              </div>

              <div className="mt-5 rounded-lg bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#007c89]" />
                  <h3 className="font-black">가능 서비스</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.services.map((service) => (
                    <span key={service} className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-[#fff7ed] p-4 text-sm font-semibold leading-6 text-[#9a3412]">
                {selected.memo}
              </div>

              {activeView === 'applications' && <div className="mt-5 grid gap-2 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, '승인 완료')}
                  className="flex h-12 items-center justify-center gap-2 rounded-md bg-emerald-600 text-sm font-black text-white"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  승인 완료
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, '보완 요청')}
                  className="flex h-12 items-center justify-center gap-2 rounded-md bg-sky-600 text-sm font-black text-white"
                >
                  <ShieldCheck className="h-4 w-4" />
                  보완 요청
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus(selected.id, '반려')}
                  className="flex h-12 items-center justify-center gap-2 rounded-md bg-red-600 text-sm font-black text-white"
                >
                  <XCircle className="h-4 w-4" />
                  반려
                </button>
              </div>}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function AdminMenuButton({
  active,
  count,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  count?: number;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-md px-4 text-sm font-black transition sm:flex-none ${
        active ? 'bg-[#007c89] text-white' : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      {label}
      {count !== undefined && (
        <span className={`rounded-full px-2 py-0.5 text-xs ${active ? 'bg-white/20' : 'bg-emerald-50 text-emerald-700'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function StatusBadge({status}: {status: ApplicationStatus}) {
  return <span className={`rounded-md px-2 py-1 text-xs font-black ring-1 ${statusStyles[status]}`}>{status}</span>;
}

function Metric({label, value, tone}: {label: string; value: number; tone: 'amber' | 'emerald' | 'sky' | 'red'}) {
  const colors = {
    amber: 'text-amber-700 bg-amber-50',
    emerald: 'text-emerald-700 bg-emerald-50',
    sky: 'text-sky-700 bg-sky-50',
    red: 'text-red-700 bg-red-50',
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-md ${colors[tone]}`}>
        <UserCheck className="h-5 w-5" />
      </div>
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}건</p>
    </div>
  );
}

function Info({label, value}: {label: string; value: string}) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}
