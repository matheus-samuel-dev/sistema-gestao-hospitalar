import { AlertTriangle, PackageMinus, Pill, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { medicines } from '../data/mockData';
import { Medicine } from '../types/healthcare';
import { Button } from '../components/ui/Button';
import { ChartCard } from '../components/ui/ChartCard';
import { Column, DataTable } from '../components/ui/DataTable';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';

export function PharmacyPage() {
  const columns: Column<Medicine>[] = [
    { header: 'Medicamento', accessor: (medicine) => <span className="font-bold text-slate-900">{medicine.name}</span> },
    { header: 'Princípio ativo', accessor: (medicine) => medicine.activeIngredient },
    { header: 'Fabricante', accessor: (medicine) => medicine.manufacturer },
    { header: 'Lote', accessor: (medicine) => medicine.batch },
    { header: 'Validade', accessor: (medicine) => medicine.expirationDate },
    { header: 'Estoque', accessor: (medicine) => `${medicine.quantityInStock} un.` },
    { header: 'Status', accessor: (medicine) => <StatusBadge status={medicine.status} /> }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Farmácia"
        subtitle="Medicamentos, baixa de estoque, validade e alertas"
        actions={
          <>
            <Button icon={PackageMinus} variant="secondary" onClick={() => toast.success('Baixa de estoque registrada na trilha de auditoria demo.')}>Baixa</Button>
            <Button icon={Plus} onClick={() => toast.success('Cadastro de medicamento preparado para esta versão demo.')}>Novo medicamento</Button>
          </>
        }
      />
      <section className="grid gap-5 lg:grid-cols-[1fr_340px]">
        <DataTable columns={columns} data={medicines} />
        <ChartCard title="Alertas de estoque" subtitle="Itens que exigem atenção">
          <div className="space-y-4">
            {medicines.filter((item) => item.lowStock || item.expiringSoon).map((medicine) => (
              <div key={medicine.id} className="rounded-2xl bg-amber-50 p-4 text-amber-900">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-warning">
                    <AlertTriangle size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold">{medicine.name}</p>
                    <p className="text-xs font-semibold opacity-75">{medicine.lowStock ? 'Estoque baixo' : 'Validade próxima'}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-2xl bg-blue-50 p-4 text-primary">
              <Pill size={22} />
              <p className="mt-3 text-sm font-extrabold">Controle integrado com prescrições</p>
              <p className="mt-1 text-xs font-semibold text-blue-700">Baixas de estoque geram auditoria automática no backend.</p>
            </div>
          </div>
        </ChartCard>
      </section>
    </div>
  );
}
