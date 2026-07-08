import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BedDouble, CalendarDays, CreditCard, Plus, Stethoscope, TestTube2, UserPlus, UsersRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointments, dashboardData, doctors, hospitalizations, patients } from '../data/mockData';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { ChartCard } from '../components/ui/ChartCard';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useHospitalWorkspace } from '../hooks/useHospitalWorkspace';
import { appointmentMatchesFilters, selectedPeriodLabel } from '../utils/hospitalFilters';

const statIcons = [CalendarDays, UsersRound, Stethoscope, BedDouble];
const pieColors = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

export function DashboardPage() {
  const navigate = useNavigate();
  const { selectedDate, filters } = useHospitalWorkspace();

  const filteredAppointments = useMemo(
    () => appointments.filter((appointment) => appointmentMatchesFilters(appointment, filters, selectedDate)),
    [filters, selectedDate]
  );

  const dashboardStats = useMemo(() => {
    const completed = filteredAppointments.filter((appointment) => appointment.status === 'CONCLUIDA').length;
    const waiting = filteredAppointments.filter((appointment) => ['AGENDADA', 'CONFIRMADA'].includes(appointment.status)).length;
    const canceled = filteredAppointments.filter((appointment) => appointment.status === 'CANCELADA' || appointment.status === 'FALTOU').length;

    return [
      { title: 'Consultas do período', value: String(filteredAppointments.length), variation: '+12%', tone: 'blue' as const },
      { title: 'Pacientes atendidos', value: String(completed), variation: '+8%', tone: 'green' as const },
      { title: 'Médicos disponíveis', value: String(doctors.filter((doctor) => doctor.status === 'ATIVO').length), variation: '+3%', tone: 'purple' as const },
      { title: 'Pacientes aguardando', value: String(waiting + canceled), variation: '-4%', tone: 'amber' as const }
    ];
  }, [filteredAppointments]);

  const specialties = filters.specialty
    ? dashboardData.appointmentsBySpecialty.filter((item) => item.specialty === filters.specialty)
    : dashboardData.appointmentsBySpecialty;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={`Visão executiva do hospital • ${selectedPeriodLabel(selectedDate, filters.period)}`}
        actions={
          <>
            <Button icon={Plus} onClick={() => navigate('/agenda')}>Nova consulta</Button>
            <Button icon={UserPlus} variant="secondary" onClick={() => navigate('/pacientes')}>
              Novo paciente
            </Button>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} icon={statIcons[index]} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        <ChartCard title="Consultas nos últimos 7 dias" subtitle="Volume diário por atendimento">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.appointmentsLast7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #E2E8F0' }} />
                <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={4} dot={{ r: 5, fill: '#fff', strokeWidth: 3 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Consultas por especialidade" subtitle="Distribuição mensal">
          <div className="grid min-h-80 items-center gap-4 md:grid-cols-[1fr_0.9fr] xl:grid-cols-1 2xl:grid-cols-[1fr_0.9fr]">
            <ResponsiveContainer width="100%" height={235}>
              <PieChart>
                <Pie data={specialties} innerRadius={65} outerRadius={96} paddingAngle={5} dataKey="total" nameKey="specialty">
                  {specialties.map((entry, index) => (
                    <Cell key={entry.specialty} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #E2E8F0' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {specialties.map((item, index) => (
                <div key={item.specialty} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                  <span className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: pieColors[index % pieColors.length] }} />
                    {item.specialty}
                  </span>
                  <strong className="text-sm text-slate-950">{item.total}</strong>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <ChartCard title="Receita dos últimos 6 meses" subtitle="Faturamento consolidado">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.revenueLast6Months}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: 16, border: '1px solid #E2E8F0' }} formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                <Bar dataKey="value" fill="#2563EB" radius={[12, 12, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Ações rápidas" subtitle="Fluxos frequentes da operação">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              [CalendarDays, 'Nova consulta', 'Agendar atendimento médico', '/agenda'],
              [UsersRound, 'Novo paciente', 'Cadastrar ficha completa', '/pacientes'],
              [TestTube2, 'Novo exame', 'Solicitar exame clínico', '/exames'],
              [BedDouble, 'Nova internação', 'Abrir leito e quarto', '/internacoes']
            ].map(([Icon, title, description, path]) => (
              <button
                key={String(title)}
                className="rounded-[1.2rem] border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-primary hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                onClick={() => {
                  navigate(String(path));
                  toast.success(`${String(title)}: fluxo aberto.`);
                }}
              >
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-primary shadow-sm">
                  <Icon size={21} />
                </div>
                <h3 className="mt-4 text-sm font-extrabold text-slate-950">{String(title)}</h3>
                <p className="mt-1 text-xs font-semibold leading-5 text-muted">{String(description)}</p>
              </button>
            ))}
          </div>
        </ChartCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-4">
        <DashboardList title="Próximas consultas" className="xl:col-span-2">
          {filteredAppointments.length === 0 ? (
            <MiniEmpty text="Nenhuma consulta encontrada para os filtros atuais." />
          ) : (
            filteredAppointments.slice(0, 6).map((appointment) => (
              <div key={appointment.id} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3">
                <Avatar name={appointment.patientName} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-800">{appointment.patientName}</p>
                  <p className="truncate text-xs font-semibold text-muted">{appointment.doctorName} • {appointment.specialty}</p>
                </div>
                <StatusBadge status={appointment.status} />
              </div>
            ))
          )}
        </DashboardList>

        <DashboardList title="Exames pendentes">
          {dashboardData.pendingExams.map((exam) => (
            <div key={exam.id} className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-800">{exam.examType}</p>
                <StatusBadge status={exam.status} />
              </div>
              <p className="mt-1 text-xs font-semibold text-muted">{exam.patientName}</p>
            </div>
          ))}
        </DashboardList>

        <DashboardList title="Internações recentes">
          {hospitalizations.map((item) => (
            <div key={item.id} className="rounded-2xl bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-800">{item.patientName}</p>
                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-primary">{item.room}/{item.bed}</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-muted">{item.reason}</p>
            </div>
          ))}
        </DashboardList>
      </section>
    </div>
  );
}

function DashboardList({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[1.4rem] border border-white/80 bg-white p-5 shadow-card ${className ?? ''}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-950">{title}</h2>
        <Stethoscope size={18} className="text-slate-400" />
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function MiniEmpty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center text-sm font-semibold text-muted">{text}</div>;
}
