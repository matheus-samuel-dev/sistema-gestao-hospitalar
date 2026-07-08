import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bell,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  HeartPulse,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
  TestTube2,
  UserCog,
  UserRound,
  X
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { cn } from '../ui/cn';
import { useAuth } from '../../hooks/useAuth';
import { useHospitalWorkspace } from '../../hooks/useHospitalWorkspace';
import { appointments, doctors, exams, patients, record } from '../../data/mockData';
import { AppointmentStatus, ServiceType } from '../../types/healthcare';
import { displayLabel, formatDate, normalizeText, toLocalIsoDate } from '../../utils/healthcareFormat';

type HeaderPanel = 'search' | 'date' | 'filters' | 'notifications' | 'profile' | null;

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  path: string;
  icon: LucideIcon;
  keywords: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  path: string;
  unread: boolean;
}

const appointmentStatuses: AppointmentStatus[] = ['AGENDADA', 'CONFIRMADA', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'FALTOU'];
const serviceTypes: ServiceType[] = ['CONSULTA', 'EXAME', 'INTERNACAO', 'PROCEDIMENTO', 'FARMACIA'];

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const [openPanel, setOpenPanel] = useState<HeaderPanel>(null);
  const [search, setSearch] = useState('');
  const { selectedDate, setSelectedDate, changeDateByDays, filters, updateFilter, resetFilters, activeFilterCount } = useHospitalWorkspace();
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => [
    {
      id: 'notification-1',
      title: 'Paciente aguardando atendimento',
      description: `${appointments[2].patientName} está em triagem para ${appointments[2].specialty}.`,
      time: 'Agora',
      path: '/agenda',
      unread: true
    },
    {
      id: 'notification-2',
      title: 'Nova consulta confirmada',
      description: `${appointments[1].patientName} confirmou presença para ${formatDate(appointments[1].startAt.slice(0, 10))}.`,
      time: '12 min',
      path: '/consultas',
      unread: true
    },
    {
      id: 'notification-3',
      title: 'Prontuário atualizado',
      description: `Evolução clínica registrada para ${record.patientName}.`,
      time: '35 min',
      path: '/prontuarios',
      unread: false
    },
    {
      id: 'notification-4',
      title: 'Exame pendente',
      description: `${exams[0].examType} ainda precisa de coleta.`,
      time: '1 h',
      path: '/exames',
      unread: true
    }
  ]);

  const dateLabel = formatDate(selectedDate);
  const selectedDateLong = formatDate(selectedDate, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const unreadCount = notifications.filter((notification) => notification.unread).length;
  const specialtyOptions = useMemo(() => Array.from(new Set(doctors.map((doctor) => doctor.specialty))).sort(), []);
  const insuranceOptions = useMemo(() => Array.from(new Set(patients.map((patient) => patient.insuranceProvider))).sort(), []);

  const searchIndex = useMemo<SearchResult[]>(() => {
    const patientResults = patients.map((patient) => ({
      id: `patient-${patient.id}`,
      title: patient.fullName,
      subtitle: `${patient.cpf} • ${patient.phone}`,
      meta: `Paciente • ${patient.insuranceProvider}`,
      path: `/pacientes?paciente=${patient.id}`,
      icon: UserRound,
      keywords: [patient.fullName, patient.cpf, patient.phone, patient.email, patient.insuranceProvider, patient.allergies, patient.familyHistory].join(' ')
    }));

    const doctorResults = doctors.map((doctor) => ({
      id: `doctor-${doctor.id}`,
      title: doctor.name,
      subtitle: `${doctor.specialty} • ${doctor.crm}`,
      meta: `Médico • ${doctor.officeHours}`,
      path: `/medicos?medico=${doctor.id}`,
      icon: Stethoscope,
      keywords: [doctor.name, doctor.specialty, doctor.crm, doctor.phone, doctor.email, doctor.officeHours, displayLabel(doctor.status)].join(' ')
    }));

    const appointmentResults = appointments.map((appointment) => ({
      id: `appointment-${appointment.id}`,
      title: appointment.patientName,
      subtitle: `${appointment.doctorName} • ${appointment.specialty}`,
      meta: `Consulta • ${formatDate(appointment.startAt.slice(0, 10))} • ${displayLabel(appointment.status)}`,
      path: `/agenda?consulta=${appointment.id}`,
      icon: ClipboardList,
      keywords: [
        appointment.patientName,
        appointment.doctorName,
        appointment.specialty,
        appointment.startAt,
        displayLabel(appointment.status),
        appointment.observations
      ].join(' ')
    }));

    const examResults = exams.map((exam) => ({
      id: `exam-${exam.id}`,
      title: exam.examType,
      subtitle: `${exam.patientName} • ${exam.doctorName}`,
      meta: `Exame • ${displayLabel(exam.status)}`,
      path: '/exames',
      icon: TestTube2,
      keywords: [exam.examType, exam.patientName, exam.doctorName, displayLabel(exam.status), exam.observations].join(' ')
    }));

    const recordResult = {
      id: `record-${record.id}`,
      title: `Prontuário de ${record.patientName}`,
      subtitle: `${record.age} anos • ${record.phone}`,
      meta: 'Prontuário eletrônico',
      path: `/prontuarios?paciente=${record.patientId}`,
      icon: HeartPulse,
      keywords: [record.patientName, record.summary, record.allergies, record.familyHistory, record.medicalNotes].join(' ')
    };

    const specialtyResults = specialtyOptions.map((specialty) => ({
      id: `specialty-${specialty}`,
      title: specialty,
      subtitle: `${doctors.filter((doctor) => doctor.specialty === specialty).length} médico(s) disponível(is)`,
      meta: 'Especialidade',
      path: `/medicos?especialidade=${encodeURIComponent(specialty)}`,
      icon: ShieldCheck,
      keywords: specialty
    }));

    return [...patientResults, ...doctorResults, ...appointmentResults, ...examResults, recordResult, ...specialtyResults];
  }, [insuranceOptions, specialtyOptions]);

  const results = useMemo(() => {
    const term = normalizeText(search);
    if (term.length < 2) return [];
    return searchIndex
      .filter((item) => normalizeText(`${item.title} ${item.subtitle} ${item.meta} ${item.keywords}`).includes(term))
      .slice(0, 8);
  }, [search, searchIndex]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setOpenPanel(null);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpenPanel(null);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function openSearchResult(result: SearchResult) {
    navigate(result.path);
    setSearch('');
    setOpenPanel(null);
  }

  function markNotificationAsRead(id: string) {
    setNotifications((current) => current.map((notification) => (notification.id === id ? { ...notification, unread: false } : notification)));
  }

  function clearNotifications() {
    setNotifications([]);
    toast.success('Notificações limpas.');
  }

  function handleNotificationClick(notification: NotificationItem) {
    markNotificationAsRead(notification.id);
    navigate(notification.path);
    setOpenPanel(null);
  }

  function handleSignOut() {
    signOut();
    toast.success('Sessão encerrada com segurança.');
  }

  function togglePanel(panel: HeaderPanel) {
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-30 border-b border-white/70 bg-surface/90 px-4 py-3 backdrop-blur-xl lg:px-8">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-navy shadow-sm transition hover:text-primary focus:outline-none focus:ring-4 focus:ring-blue-100 lg:hidden"
          title="Abrir menu"
          aria-label="Abrir menu lateral"
        >
          <Menu size={21} />
        </button>

        <div className="relative hidden min-w-0 flex-1 md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onFocus={() => setOpenPanel('search')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && results[0]) {
                openSearchResult(results[0]);
              }
            }}
            placeholder="Buscar pacientes, consultas, médicos, CPF..."
            aria-label="Busca global"
            className="h-12 w-full rounded-2xl border border-white bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:ring-4 focus:ring-blue-100"
          />
          {openPanel === 'search' ? <SearchPanel search={search} results={results} onOpenResult={openSearchResult} /> : null}
        </div>

        <button
          className="grid h-12 w-12 place-items-center rounded-2xl border border-white bg-white text-slate-500 shadow-sm transition hover:text-primary focus:outline-none focus:ring-4 focus:ring-blue-100 md:hidden"
          title="Buscar"
          aria-label="Abrir busca global"
          onClick={() => togglePanel('search')}
        >
          <Search size={19} />
        </button>

        <button
          className="hidden h-12 items-center gap-2 rounded-2xl border border-white bg-white px-4 text-sm font-bold text-slate-600 shadow-sm transition hover:text-primary focus:outline-none focus:ring-4 focus:ring-blue-100 md:flex"
          onClick={() => togglePanel('date')}
          aria-haspopup="dialog"
          aria-expanded={openPanel === 'date'}
        >
          <Calendar size={18} />
          {dateLabel}
        </button>

        <button
          className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white bg-white text-slate-500 shadow-sm transition hover:text-primary focus:outline-none focus:ring-4 focus:ring-blue-100"
          title="Filtros"
          aria-label="Abrir filtros"
          aria-haspopup="dialog"
          aria-expanded={openPanel === 'filters'}
          onClick={() => togglePanel('filters')}
        >
          <SlidersHorizontal size={19} />
          {activeFilterCount > 0 ? (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
              {activeFilterCount}
            </span>
          ) : null}
        </button>

        <button
          className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white bg-white text-slate-500 shadow-sm transition hover:text-primary focus:outline-none focus:ring-4 focus:ring-blue-100"
          title="Notificações"
          aria-label="Abrir notificações"
          aria-haspopup="dialog"
          aria-expanded={openPanel === 'notifications'}
          onClick={() => togglePanel('notifications')}
        >
          <Bell size={19} />
          {unreadCount > 0 ? (
            <span className="absolute right-2 top-2 grid h-5 min-w-5 place-items-center rounded-full bg-danger px-1 text-[10px] font-extrabold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          ) : null}
        </button>

        <button
          className="flex h-12 items-center gap-2 rounded-2xl border border-white bg-white px-2 pr-3 text-left shadow-sm transition hover:text-primary focus:outline-none focus:ring-4 focus:ring-blue-100"
          onClick={() => togglePanel('profile')}
          aria-haspopup="menu"
          aria-expanded={openPanel === 'profile'}
          aria-label="Abrir menu do perfil"
        >
          <Avatar name={user?.name ?? 'Dr. João Silva'} src={user?.avatarUrl} size="sm" />
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-32 truncate text-sm font-extrabold text-slate-800">{user?.name ?? 'Dr. João Silva'}</span>
            <span className="block max-w-32 truncate text-xs font-semibold text-muted">{user?.position ?? 'Administrador'}</span>
          </span>
          <ChevronDown className="hidden text-slate-400 sm:block" size={16} />
        </button>
      </div>

      {openPanel === 'search' ? (
        <div className="absolute left-4 right-4 top-[calc(100%+0.5rem)] md:hidden">
          <div className="rounded-[1.2rem] border border-slate-100 bg-white p-3 shadow-2xl shadow-blue-950/10">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                autoFocus
                aria-label="Busca global"
                placeholder="Buscar no hospital..."
                className="h-11 w-full rounded-xl border border-slate-200 pl-11 pr-4 text-sm font-semibold outline-none focus:border-primary focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <SearchResults search={search} results={results} onOpenResult={openSearchResult} />
          </div>
        </div>
      ) : null}

      {openPanel === 'date' ? (
        <HeaderPopover className="max-w-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-primary">Data operacional</p>
              <h2 className="mt-1 text-lg font-extrabold text-slate-950">{selectedDateLong}</h2>
            </div>
            <button
              className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500 transition hover:text-danger"
              onClick={() => setOpenPanel(null)}
              aria-label="Fechar calendário"
            >
              <X size={17} />
            </button>
          </div>
          <div className="mt-5 grid gap-3">
            <label>
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">Selecionar data</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                onInput={(event) => setSelectedDate(event.currentTarget.value)}
                aria-label="Selecionar data operacional"
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-bold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button className="h-10 rounded-xl bg-slate-100 text-sm font-extrabold text-slate-600 transition hover:bg-blue-50 hover:text-primary" onClick={() => changeDateByDays(-1)} aria-label="Data anterior">
                <ChevronLeft className="mx-auto" size={18} />
              </button>
              <button className="h-10 rounded-xl bg-blue-50 text-sm font-extrabold text-primary transition hover:bg-blue-100" onClick={() => setSelectedDate(toLocalIsoDate())}>
                Hoje
              </button>
              <button className="h-10 rounded-xl bg-slate-100 text-sm font-extrabold text-slate-600 transition hover:bg-blue-50 hover:text-primary" onClick={() => changeDateByDays(1)} aria-label="Próxima data">
                <ChevronRight className="mx-auto" size={18} />
              </button>
            </div>
            <Button
              className="w-full"
              icon={Calendar}
              onClick={() => {
                navigate('/agenda');
                setOpenPanel(null);
              }}
            >
              Abrir agenda do dia
            </Button>
          </div>
        </HeaderPopover>
      ) : null}

      {openPanel === 'filters' ? (
        <HeaderPopover className="max-w-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-primary">Filtros globais</p>
              <h2 className="mt-1 text-lg font-extrabold text-slate-950">Refinar dados da tela atual</h2>
            </div>
            <button className="text-sm font-extrabold text-primary transition hover:text-blue-700" onClick={resetFilters}>
              Limpar filtros
            </button>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Select label="Período" value={filters.period} onChange={(value) => updateFilter('period', value as never)}>
              <option value="today">Hoje</option>
              <option value="week">Próximos 7 dias</option>
              <option value="month">Mês atual</option>
              <option value="custom">Data selecionada</option>
            </Select>
            <Select label="Especialidade" value={filters.specialty} onChange={(value) => updateFilter('specialty', value)}>
              <option value="">Todas</option>
              {specialtyOptions.map((specialty) => <option key={specialty} value={specialty}>{specialty}</option>)}
            </Select>
            <Select label="Médico" value={filters.doctorId} onChange={(value) => updateFilter('doctorId', value)}>
              <option value="">Todos</option>
              {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name}</option>)}
            </Select>
            <Select label="Status da consulta" value={filters.status} onChange={(value) => updateFilter('status', value as '' | AppointmentStatus)}>
              <option value="">Todos</option>
              {appointmentStatuses.map((status) => <option key={status} value={status}>{displayLabel(status)}</option>)}
            </Select>
            <Select label="Tipo de atendimento" value={filters.serviceType} onChange={(value) => updateFilter('serviceType', value as '' | ServiceType)}>
              <option value="">Todos</option>
              {serviceTypes.map((serviceType) => <option key={serviceType} value={serviceType}>{displayLabel(serviceType)}</option>)}
            </Select>
            <Select label="Paciente" value={filters.patientId} onChange={(value) => updateFilter('patientId', value)}>
              <option value="">Todos</option>
              {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.fullName}</option>)}
            </Select>
            <Select label="Convênio" value={filters.insuranceProvider} onChange={(value) => updateFilter('insuranceProvider', value)}>
              <option value="">Todos</option>
              {insuranceOptions.map((insurance) => <option key={insurance} value={insurance}>{insurance}</option>)}
            </Select>
            <Select label="Prioridade" value={filters.priority} onChange={(value) => updateFilter('priority', value)}>
              <option value="">Todas</option>
              <option value="rotina">Rotina</option>
              <option value="prioritario">Prioritário</option>
              <option value="urgente">Urgente</option>
            </Select>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setOpenPanel(null)}>Fechar</Button>
            <Button
              icon={Check}
              onClick={() => {
                toast.success('Filtros aplicados à tela atual.');
                setOpenPanel(null);
              }}
            >
              Aplicar filtros
            </Button>
          </div>
        </HeaderPopover>
      ) : null}

      {openPanel === 'notifications' ? (
        <HeaderPopover className="max-w-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-primary">Central hospitalar</p>
              <h2 className="mt-1 text-lg font-extrabold text-slate-950">Notificações</h2>
            </div>
            <button className="text-sm font-extrabold text-primary transition hover:text-blue-700 disabled:text-slate-300" disabled={notifications.length === 0} onClick={clearNotifications}>
              Limpar
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-5 text-center">
                <Bell className="mx-auto text-slate-300" size={24} />
                <p className="mt-2 text-sm font-bold text-slate-700">Nenhuma notificação no momento.</p>
                <p className="mt-1 text-xs font-semibold text-muted">Alertas clínicos e operacionais aparecerão aqui.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  className="w-full rounded-2xl bg-slate-50 p-4 text-left transition hover:bg-blue-50"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <span className={cn('mt-1 h-2.5 w-2.5 rounded-full', notification.unread ? 'bg-danger' : 'bg-slate-300')} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-extrabold text-slate-950">{notification.title}</span>
                      <span className="mt-1 block text-xs font-semibold leading-5 text-muted">{notification.description}</span>
                    </span>
                    <span className="text-xs font-bold text-primary">{notification.time}</span>
                  </div>
                </button>
              ))
            )}
          </div>
          {notifications.some((notification) => notification.unread) ? (
            <Button
              variant="secondary"
              className="mt-4 w-full"
              icon={Check}
              onClick={() => setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })))}
            >
              Marcar todas como lidas
            </Button>
          ) : null}
        </HeaderPopover>
      ) : null}

      {openPanel === 'profile' ? (
        <HeaderPopover className="max-w-sm">
          <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
            <Avatar name={user?.name ?? 'Dr. João Silva'} src={user?.avatarUrl} />
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold text-slate-950">{user?.name ?? 'Dr. João Silva'}</p>
              <p className="truncate text-xs font-semibold text-muted">{user?.position ?? 'Administrador hospitalar'}</p>
              <p className="truncate text-xs font-semibold text-primary">{user?.email ?? 'admin@healthcare.com'}</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <ProfileAction icon={UserCog} label="Minha conta" onClick={() => toast.success('Dados da conta prontos para revisão nesta versão demo.')} />
            <ProfileAction
              icon={Settings}
              label="Configurações"
              active={location.pathname === '/configuracoes'}
              onClick={() => {
                navigate('/configuracoes');
                setOpenPanel(null);
              }}
            />
            <ProfileAction icon={ShieldCheck} label="Alterar senha" onClick={() => toast.success('Fluxo de alteração de senha preparado para integração com o backend.')} />
            <ProfileAction icon={LogOut} label="Sair" danger onClick={handleSignOut} />
          </div>
        </HeaderPopover>
      ) : null}
    </header>
  );
}

function HeaderPopover({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('absolute right-4 top-[calc(100%+0.5rem)] w-[calc(100vw-2rem)] rounded-[1.25rem] border border-slate-100 bg-white p-4 shadow-2xl shadow-blue-950/10 lg:right-8', className)}>
      {children}
    </div>
  );
}

function SearchPanel({ search, results, onOpenResult }: { search: string; results: SearchResult[]; onOpenResult: (result: SearchResult) => void }) {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] rounded-[1.2rem] border border-slate-100 bg-white p-3 shadow-2xl shadow-blue-950/10">
      <SearchResults search={search} results={results} onOpenResult={onOpenResult} />
    </div>
  );
}

function SearchResults({ search, results, onOpenResult }: { search: string; results: SearchResult[]; onOpenResult: (result: SearchResult) => void }) {
  if (normalizeText(search).length < 2) {
    return (
      <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold leading-6 text-muted">
        Digite ao menos 2 caracteres para buscar pacientes, consultas, médicos, CPF, telefone, especialidades, agenda e status.
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-50 p-5 text-center">
        <Search className="mx-auto text-slate-300" size={24} />
        <p className="mt-2 text-sm font-bold text-slate-700">Nenhum resultado encontrado.</p>
        <p className="mt-1 text-xs font-semibold text-muted">Tente buscar por nome, CPF, telefone, especialidade ou status.</p>
      </div>
    );
  }

  return (
    <div className="max-h-[28rem] space-y-2 overflow-y-auto">
      {results.map((result) => (
        <button key={result.id} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-blue-50" onClick={() => onOpenResult(result)}>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-primary">
            <result.icon size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-extrabold text-slate-950">{result.title}</span>
            <span className="block truncate text-xs font-semibold text-muted">{result.subtitle}</span>
          </span>
          <span className="hidden rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 sm:block">{result.meta}</span>
        </button>
      ))}
    </div>
  );
}

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
      >
        {children}
      </select>
    </label>
  );
}

function ProfileAction({ icon: Icon, label, onClick, danger, active }: { icon: LucideIcon; label: string; onClick: () => void; danger?: boolean; active?: boolean }) {
  return (
    <button
      className={cn(
        'flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-extrabold transition',
        danger ? 'text-danger hover:bg-red-50' : active ? 'bg-blue-50 text-primary' : 'text-slate-700 hover:bg-slate-100 hover:text-primary'
      )}
      onClick={onClick}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}
