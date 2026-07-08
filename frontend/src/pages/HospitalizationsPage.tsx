import { BedDouble, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { hospitalizations } from '../data/mockData';
import { Hospitalization } from '../types/healthcare';
import { Button } from '../components/ui/Button';
import { ChartCard } from '../components/ui/ChartCard';
import { Column, DataTable } from '../components/ui/DataTable';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';

export function HospitalizationsPage() {
  const columns: Column<Hospitalization>[] = [
    { header: 'Paciente', accessor: (item) => <span className="font-bold text-slate-900">{item.patientName}</span> },
    { header: 'Médico', accessor: (item) => item.doctorName },
    { header: 'Quarto', accessor: (item) => `${item.room} / ${item.bed}` },
    { header: 'Entrada', accessor: (item) => item.entryDate },
    { header: 'Previsão de alta', accessor: (item) => item.expectedDischargeDate ?? '-' },
    { header: 'Status', accessor: (item) => <StatusBadge status={item.status} /> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Internações" subtitle="Controle de quartos, leitos, altas e acompanhamento médico" actions={<Button icon={Plus} onClick={() => toast.success('Fluxo de internação preparado para esta versão demo.')}>Nova internação</Button>} />
      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <DataTable columns={columns} data={hospitalizations} />
        <ChartCard title="Ocupação atual" subtitle="Leitos por status">
          <div className="space-y-4">
            {hospitalizations.map((item) => (
              <div key={item.id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-primary">
                      <BedDouble size={19} />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-950">Quarto {item.room}</p>
                      <p className="text-xs font-semibold text-muted">Leito {item.bed}</p>
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-3 text-xs font-semibold leading-5 text-muted">{item.reason}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </section>
    </div>
  );
}
