import { Area, AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { appointmentsBySpecialty, appointmentsLast7Days, revenueLast6Months } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { ChartCard } from '../components/ui/ChartCard';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { CalendarDays, CreditCard, TrendingUp, UsersRound } from 'lucide-react';

const colors = ['#2563EB', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'];

export function ReportsPage() {
  const [period, setPeriod] = useState('30');
  const periodLabel = period === '30' ? 'últimos 30 dias' : period === '180' ? 'últimos 6 meses' : 'este ano';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios"
        subtitle={`Indicadores executivos, filtros e exportações • ${periodLabel}`}
        actions={
          <>
            <select value={period} onChange={(event) => setPeriod(event.target.value)} className="h-11 rounded-xl border border-white bg-white px-4 text-sm font-bold text-slate-600 shadow-sm outline-none">
              <option value="30">Últimos 30 dias</option>
              <option value="180">Últimos 6 meses</option>
              <option value="year">Este ano</option>
            </select>
            <Button icon={Download} variant="secondary" onClick={() => toast.success('Relatório executivo em PDF preparado para exportação.')}>PDF</Button>
            <Button icon={FileSpreadsheet} variant="secondary" onClick={() => toast.success('Relatório executivo em Excel preparado para exportação.')}>Excel</Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total de consultas" value="842" variation="+12%" tone="blue" icon={CalendarDays} />
        <StatCard title="Receita total" value="R$ 918k" variation="+18%" tone="green" icon={CreditCard} />
        <StatCard title="Pacientes novos" value="128" variation="+9%" tone="purple" icon={UsersRound} />
        <StatCard title="Taxa de ocupação" value="78%" variation="+4%" tone="amber" icon={TrendingUp} />
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <ChartCard title="Consultas por especialidade" subtitle="Distribuição por área clínica">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={appointmentsBySpecialty} dataKey="total" nameKey="specialty" innerRadius={70} outerRadius={110} paddingAngle={4}>
                  {appointmentsBySpecialty.map((item, index) => <Cell key={item.specialty} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Receita dos últimos 6 meses" subtitle="Performance financeira">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueLast6Months}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#2563EB" radius={[12, 12, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Evolução de pacientes" subtitle="Novos cadastros por período">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={appointmentsLast7Days}>
                <defs>
                  <linearGradient id="patients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={4} fill="url(#patients)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Taxa de ocupação" subtitle="Leitos ativos">
          <div className="grid h-80 place-items-center">
            <div className="relative grid h-56 w-56 place-items-center rounded-full bg-blue-50">
              <div className="absolute inset-4 rounded-full border-[18px] border-primary border-r-blue-100 border-t-emerald-400" />
              <div className="relative text-center">
                <strong className="text-5xl font-extrabold text-slate-950">78%</strong>
                <p className="mt-1 text-sm font-bold text-muted">ocupação</p>
              </div>
            </div>
          </div>
        </ChartCard>
      </section>
    </div>
  );
}
