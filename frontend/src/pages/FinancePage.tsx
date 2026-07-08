import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download, FileSpreadsheet, Plus, WalletCards } from 'lucide-react';
import toast from 'react-hot-toast';
import { payments, revenueLast6Months } from '../data/mockData';
import { Payment } from '../types/healthcare';
import { Button } from '../components/ui/Button';
import { ChartCard } from '../components/ui/ChartCard';
import { Column, DataTable } from '../components/ui/DataTable';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useHospitalWorkspace } from '../hooks/useHospitalWorkspace';
import { paymentMatchesFilters } from '../utils/hospitalFilters';
import { displayLabel } from '../utils/healthcareFormat';

export function FinancePage() {
  const { filters } = useHospitalWorkspace();
  const filteredPayments = payments.filter((payment) => paymentMatchesFilters(payment, filters));
  const columns: Column<Payment>[] = [
    { header: 'Paciente', accessor: (payment) => <span className="font-bold text-slate-900">{payment.patientName}</span> },
    { header: 'Serviço', accessor: (payment) => displayLabel(payment.serviceType) },
    { header: 'Valor', accessor: (payment) => `R$ ${payment.amount.toLocaleString('pt-BR')}` },
    { header: 'Forma', accessor: (payment) => displayLabel(payment.method) },
    { header: 'Vencimento', accessor: (payment) => payment.dueDate },
    { header: 'Status', accessor: (payment) => <StatusBadge status={payment.status} /> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financeiro"
        subtitle="Receita, pagamentos, convênios e exportações"
        actions={
          <>
            <Button icon={Download} variant="secondary" onClick={() => toast.success('Relatório financeiro em PDF preparado para exportação.')}>PDF</Button>
            <Button icon={FileSpreadsheet} variant="secondary" onClick={() => toast.success('Planilha financeira preparada para exportação.')}>Excel</Button>
            <Button icon={Plus} onClick={() => toast.success('Fluxo de novo pagamento preparado para esta versão demo.')}>Novo pagamento</Button>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard title="Receita mensal" value="R$ 186.420" variation="+18%" tone="green" icon={WalletCards} />
        <StatCard title="Pagamentos pendentes" value="14" variation="-6%" tone="amber" icon={WalletCards} />
        <StatCard title="Atrasados" value="3" variation="-2%" tone="purple" icon={WalletCards} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <ChartCard title="Receita dos últimos 6 meses" subtitle="Faturamento hospitalar">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueLast6Months}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString('pt-BR')}`} />
                <Bar dataKey="value" fill="#10B981" radius={[12, 12, 4, 4]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
        <DataTable columns={columns} data={filteredPayments} emptyMessage="Nenhum pagamento encontrado para os filtros atuais." />
      </section>
    </div>
  );
}
