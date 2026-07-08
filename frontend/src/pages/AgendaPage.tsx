import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Clock, Plus, UserCheck, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointments as initialAppointments, doctors, patients } from '../data/mockData';
import { Appointment, AppointmentStatus } from '../types/healthcare';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { cn } from '../components/ui/cn';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge, statusTone } from '../components/ui/StatusBadge';
import { useHospitalWorkspace } from '../hooks/useHospitalWorkspace';
import { appointmentMatchesFilters, doctorMatchesFilters } from '../utils/hospitalFilters';
import { displayLabel, formatDate, formatDateTime } from '../utils/healthcareFormat';

const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const statusColors: Record<Appointment['status'], string> = {
  AGENDADA: 'border-amber-200 bg-amber-50 text-amber-900',
  CONFIRMADA: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  EM_ANDAMENTO: 'border-blue-200 bg-blue-50 text-blue-900',
  CONCLUIDA: 'border-slate-200 bg-slate-50 text-slate-700',
  CANCELADA: 'border-red-200 bg-red-50 text-red-900',
  FALTOU: 'border-red-200 bg-red-50 text-red-900'
};

const transitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  AGENDADA: ['CONFIRMADA', 'EM_ANDAMENTO', 'CANCELADA', 'FALTOU'],
  CONFIRMADA: ['EM_ANDAMENTO', 'CANCELADA', 'FALTOU'],
  EM_ANDAMENTO: ['CONCLUIDA', 'CANCELADA'],
  CONCLUIDA: [],
  CANCELADA: [],
  FALTOU: []
};

export function AgendaPage() {
  const [view, setView] = useState<'dia' | 'semana' | 'mes'>('dia');
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [schedule, setSchedule] = useState<Appointment[]>(initialAppointments);
  const { selectedDate, setSelectedDate, changeDateByDays, filters } = useHospitalWorkspace();
  const [form, setForm] = useState({
    patientId: patients[0].id,
    doctorId: doctors[0].id,
    date: selectedDate,
    time: '16:30',
    durationMinutes: '30',
    observations: 'Consulta de retorno para avaliação clínica.'
  });

  const formattedDate = formatDate(selectedDate, { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  const visibleDoctors = useMemo(() => doctors.filter((doctor) => doctorMatchesFilters(doctor, filters)), [filters]);
  const filteredAppointments = useMemo(
    () => schedule.filter((appointment) => appointmentMatchesFilters(appointment, filters, selectedDate)),
    [filters, schedule, selectedDate]
  );

  function openCreateModal(slot?: { doctorId?: string; time?: string }) {
    setForm((current) => ({
      ...current,
      doctorId: slot?.doctorId ?? current.doctorId,
      date: selectedDate,
      time: slot?.time ?? current.time
    }));
    setOpenCreate(true);
  }

  function handleCreate() {
    const patient = patients.find((item) => item.id === form.patientId);
    const doctor = doctors.find((item) => item.id === form.doctorId);
    const duration = Number(form.durationMinutes);

    if (!patient) {
      toast.error('Selecione um paciente válido antes de agendar.');
      return;
    }

    if (!doctor || !doctor.specialty) {
      toast.error('Selecione um médico com especialidade definida.');
      return;
    }

    if (!form.date || !form.time || Number.isNaN(duration) || duration < 15) {
      toast.error('Informe data, horário e duração válida para a consulta.');
      return;
    }

    const startAt = `${form.date}T${form.time}:00`;
    const hasConflict = schedule.some(
      (appointment) =>
        appointment.doctorId === doctor.id &&
        appointment.startAt.slice(0, 16) === startAt.slice(0, 16) &&
        !['CANCELADA', 'FALTOU'].includes(appointment.status)
    );

    if (hasConflict) {
      toast.error('Este médico já possui atendimento no horário selecionado.');
      return;
    }

    const created: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.fullName,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      startAt,
      durationMinutes: duration,
      status: 'AGENDADA',
      observations: form.observations.trim() || 'Consulta agendada pela recepção.'
    };

    setSchedule((current) => [created, ...current]);
    setSelectedDate(form.date);
    setOpenCreate(false);
    toast.success('Consulta agendada com sucesso.');
  }

  function canTransition(current: AppointmentStatus, next: AppointmentStatus) {
    return transitions[current].includes(next);
  }

  function updateAppointmentStatus(nextStatus: AppointmentStatus) {
    if (!selectedAppointment) return;

    if (!canTransition(selectedAppointment.status, nextStatus)) {
      toast.error('Transição de status não permitida para esta consulta.');
      return;
    }

    if (nextStatus === 'CANCELADA' && cancelReason.trim().length < 8) {
      toast.error('Informe um motivo de cancelamento com pelo menos 8 caracteres.');
      return;
    }

    const updated = {
      ...selectedAppointment,
      status: nextStatus,
      observations:
        nextStatus === 'CANCELADA'
          ? `${selectedAppointment.observations} Motivo do cancelamento: ${cancelReason.trim()}`
          : selectedAppointment.observations
    };

    setSchedule((current) => current.map((appointment) => (appointment.id === updated.id ? updated : appointment)));
    setSelectedAppointment(updated);
    setCancelReason('');
    toast.success(`Consulta atualizada para ${displayLabel(nextStatus)}.`);
  }

  const statusSummary = [
    ['Confirmadas', filteredAppointments.filter((appointment) => appointment.status === 'CONFIRMADA').length, 'success'],
    ['Em atendimento', filteredAppointments.filter((appointment) => appointment.status === 'EM_ANDAMENTO').length, 'info'],
    ['Pendentes', filteredAppointments.filter((appointment) => appointment.status === 'AGENDADA').length, 'warning']
  ] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agenda de Consultas"
        subtitle="Visualização por médico, horário e status do atendimento"
        actions={<Button icon={Plus} onClick={() => openCreateModal()}>Nova consulta</Button>}
      />

      <section className="rounded-[1.4rem] border border-white/80 bg-white p-5 shadow-card">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-blue-50 hover:text-primary"
              title="Dia anterior"
              aria-label="Dia anterior"
              onClick={() => changeDateByDays(-1)}
            >
              <ChevronLeft size={18} />
            </button>
            <div className="rounded-2xl bg-blue-50 px-4 py-2">
              <p className="text-xs font-bold uppercase text-primary">{formatDate(selectedDate)}</p>
              <p className="text-sm font-extrabold text-slate-950">{formattedDate}</p>
            </div>
            <button
              className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-blue-50 hover:text-primary"
              title="Próximo dia"
              aria-label="Próximo dia"
              onClick={() => changeDateByDays(1)}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="inline-flex rounded-2xl bg-slate-100 p-1">
            {(['dia', 'semana', 'mes'] as const).map((item) => (
              <button
                key={item}
                onClick={() => setView(item)}
                className={cn('h-10 rounded-xl px-4 text-sm font-extrabold transition', view === item ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-900')}
              >
                {item === 'mes' ? 'Mês' : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="min-w-[760px]">
            <div className="grid gap-3" style={{ gridTemplateColumns: `92px repeat(${Math.max(visibleDoctors.length, 1)}, minmax(200px, 1fr))` }}>
              <div />
              {visibleDoctors.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 px-4 py-5 text-center text-sm font-bold text-muted">Nenhum médico encontrado para os filtros.</div>
              ) : (
                visibleDoctors.map((doctor) => (
                  <div key={doctor.id} className="rounded-2xl bg-navy px-4 py-3 text-white">
                    <div className="flex items-center gap-3">
                      <Avatar name={doctor.name} src={doctor.avatarUrl} size="sm" />
                      <div>
                        <p className="text-sm font-extrabold">{doctor.name}</p>
                        <p className="text-xs font-semibold text-blue-200">{doctor.specialty}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {visibleDoctors.length > 0
                ? hours.map((hour) => (
                    <AgendaRow
                      key={hour}
                      hour={hour}
                      doctors={visibleDoctors}
                      appointments={filteredAppointments}
                      onSelectAppointment={(appointment) => {
                        setSelectedAppointment(appointment);
                        setCancelReason('');
                      }}
                      onEmptySlotClick={(doctorId) => openCreateModal({ doctorId, time: hour })}
                    />
                  ))
                : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {statusSummary.map(([label, value, tone]) => (
          <div key={label} className="rounded-[1.3rem] bg-white p-5 shadow-card">
            <p className="text-sm font-bold text-muted">{label}</p>
            <strong className="mt-2 block text-3xl font-extrabold text-slate-950">{value}</strong>
            <div className="mt-4">
              <StatusBadge status={label === 'Em atendimento' ? 'EM_ANDAMENTO' : label === 'Confirmadas' ? 'CONFIRMADA' : 'AGENDADA'} tone={tone as never} />
            </div>
          </div>
        ))}
      </section>

      <Modal open={openCreate} title="Nova consulta" onClose={() => setOpenCreate(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <Select label="Paciente" value={form.patientId} onChange={(value) => setForm((current) => ({ ...current, patientId: value }))}>
            {patients.map((patient) => <option key={patient.id} value={patient.id}>{patient.fullName} • {patient.cpf}</option>)}
          </Select>
          <Select label="Médico" value={form.doctorId} onChange={(value) => setForm((current) => ({ ...current, doctorId: value }))}>
            {doctors.map((doctor) => <option key={doctor.id} value={doctor.id}>{doctor.name} • {doctor.specialty}</option>)}
          </Select>
          <Input label="Data" type="date" value={form.date} onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))} onInput={(event) => setForm((current) => ({ ...current, date: event.currentTarget.value }))} />
          <Input label="Horário" type="time" value={form.time} onChange={(event) => setForm((current) => ({ ...current, time: event.target.value }))} />
          <Select label="Duração" value={form.durationMinutes} onChange={(value) => setForm((current) => ({ ...current, durationMinutes: value }))}>
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
          </Select>
          <div className="rounded-2xl bg-blue-50 p-4 text-sm font-semibold leading-6 text-blue-800">
            A consulta sempre inicia como Agendada. Confirmação, atendimento e conclusão são controlados no detalhe da agenda.
          </div>
          <label className="md:col-span-2">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">Observações</span>
            <textarea
              className="min-h-28 w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
              value={form.observations}
              onChange={(event) => setForm((current) => ({ ...current, observations: event.target.value }))}
            />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setOpenCreate(false)}>Cancelar</Button>
          <Button onClick={handleCreate}>Agendar consulta</Button>
        </div>
      </Modal>

      <Modal open={Boolean(selectedAppointment)} title="Detalhes da consulta" onClose={() => setSelectedAppointment(null)}>
        {selectedAppointment ? (
          <div className="space-y-5">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-extrabold text-slate-950">{selectedAppointment.patientName}</p>
                  <p className="mt-1 text-sm font-semibold text-muted">{selectedAppointment.doctorName} • {selectedAppointment.specialty}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">{formatDateTime(selectedAppointment.startAt)} • {selectedAppointment.durationMinutes} min</p>
                </div>
                <StatusBadge status={selectedAppointment.status} />
              </div>
              <p className="mt-4 text-sm font-medium leading-6 text-slate-600">{selectedAppointment.observations}</p>
            </div>

            {transitions[selectedAppointment.status].includes('CANCELADA') ? (
              <label>
                <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">Motivo do cancelamento</span>
                <textarea
                  value={cancelReason}
                  onChange={(event) => setCancelReason(event.target.value)}
                  placeholder="Obrigatório para cancelar uma consulta."
                  className="min-h-24 w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
                />
              </label>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <ActionButton
                icon={CheckCircle2}
                label="Confirmar"
                disabled={!canTransition(selectedAppointment.status, 'CONFIRMADA')}
                onClick={() => updateAppointmentStatus('CONFIRMADA')}
              />
              <ActionButton
                icon={UserCheck}
                label="Iniciar atendimento"
                disabled={!canTransition(selectedAppointment.status, 'EM_ANDAMENTO')}
                onClick={() => updateAppointmentStatus('EM_ANDAMENTO')}
              />
              <ActionButton
                icon={CheckCircle2}
                label="Concluir atendimento"
                disabled={!canTransition(selectedAppointment.status, 'CONCLUIDA')}
                onClick={() => updateAppointmentStatus('CONCLUIDA')}
              />
              <ActionButton
                icon={XCircle}
                label="Não compareceu"
                disabled={!canTransition(selectedAppointment.status, 'FALTOU')}
                onClick={() => updateAppointmentStatus('FALTOU')}
              />
              <ActionButton
                icon={AlertTriangle}
                label="Cancelar consulta"
                danger
                disabled={!canTransition(selectedAppointment.status, 'CANCELADA')}
                onClick={() => updateAppointmentStatus('CANCELADA')}
              />
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function AgendaRow({
  hour,
  doctors: visibleDoctors,
  appointments: items,
  onSelectAppointment,
  onEmptySlotClick
}: {
  hour: string;
  doctors: typeof doctors;
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
  onEmptySlotClick: (doctorId: string) => void;
}) {
  return (
    <>
      <div className="flex h-24 items-start gap-2 pt-3 text-sm font-extrabold text-slate-500">
        <Clock size={16} />
        {hour}
      </div>
      {visibleDoctors.map((doctor) => {
        const appointment = items.find((item) => item.doctorId === doctor.id && item.startAt.slice(11, 13) === hour.slice(0, 2));
        return (
          <div key={`${doctor.id}-${hour}`} className="h-24 rounded-2xl border border-slate-100 bg-slate-50/70 p-2">
            {appointment ? (
              <button className={cn('h-full w-full rounded-xl border p-3 text-left shadow-sm transition hover:scale-[1.01]', statusColors[appointment.status])} onClick={() => onSelectAppointment(appointment)}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-extrabold">{appointment.patientName}</p>
                  <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-extrabold">{appointment.durationMinutes}m</span>
                </div>
                <p className="mt-1 text-xs font-semibold opacity-75">{appointment.startAt.slice(11, 16)} • {appointment.specialty}</p>
                <div className="mt-2">
                  <StatusBadge status={appointment.status} tone={statusTone(appointment.status)} />
                </div>
              </button>
            ) : (
              <button
                className="grid h-full w-full place-items-center rounded-xl border border-dashed border-slate-200 text-xs font-bold text-slate-400 transition hover:border-primary hover:bg-blue-50 hover:text-primary"
                onClick={() => onEmptySlotClick(doctor.id)}
              >
                Agendar
              </button>
            )}
          </div>
        );
      })}
    </>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">{label}</span>
      <input {...props} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100" />
    </label>
  );
}

function Select({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100">
        {children}
      </select>
    </label>
  );
}

function ActionButton({ icon: Icon, label, onClick, disabled, danger }: { icon: typeof CheckCircle2; label: string; onClick: () => void; disabled?: boolean; danger?: boolean }) {
  return (
    <button
      className={cn(
        'flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-45',
        danger ? 'bg-red-50 text-danger hover:bg-red-100' : 'bg-blue-50 text-primary hover:bg-blue-100'
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}
