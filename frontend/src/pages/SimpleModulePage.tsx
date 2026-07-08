import { Settings } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';

export function SimpleModulePage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle="Preferências, perfis de acesso, notificações e parâmetros do sistema" />
      <EmptyState icon={Settings} title="Módulo administrativo" description="Área preparada para configurações de perfis, unidades, notificações e parâmetros globais do HealthCare." />
    </div>
  );
}
