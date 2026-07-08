import { Plus, TestTube2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { exams } from '../data/mockData';
import { Exam } from '../types/healthcare';
import { Button } from '../components/ui/Button';
import { ChartCard } from '../components/ui/ChartCard';
import { Column, DataTable } from '../components/ui/DataTable';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';

export function ExamsPage() {
  const columns: Column<Exam>[] = [
    { header: 'Exame', accessor: (exam) => <span className="font-bold text-slate-900">{exam.examType}</span> },
    { header: 'Paciente', accessor: (exam) => exam.patientName },
    { header: 'Médico solicitante', accessor: (exam) => exam.doctorName },
    { header: 'Solicitação', accessor: (exam) => exam.requestedAt },
    { header: 'Realização', accessor: (exam) => exam.performedAt ?? 'Aguardando' },
    { header: 'Status', accessor: (exam) => <StatusBadge status={exam.status} /> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Exames" subtitle="Solicitações, agendas, resultados e status laboratoriais" actions={<Button icon={Plus} onClick={() => toast.success('Fluxo de solicitação de exame preparado para esta versão demo.')}>Novo exame</Button>} />
      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <DataTable columns={columns} data={exams} />
        <ChartCard title="Fila de exames" subtitle="Acompanhamento operacional">
          <div className="space-y-4">
            {exams.map((exam) => (
              <div key={exam.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-primary">
                    <TestTube2 size={19} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-950">{exam.examType}</p>
                    <p className="text-xs font-semibold text-muted">{exam.patientName}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <StatusBadge status={exam.status} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>
    </div>
  );
}
