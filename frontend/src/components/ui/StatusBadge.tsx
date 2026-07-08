import { cn } from './cn';
import { StatusTone } from '../../types/healthcare';
import { displayLabel } from '../../utils/healthcareFormat';

const toneClasses: Record<StatusTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  info: 'bg-blue-50 text-blue-700 ring-blue-200',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200'
};

export function statusTone(status: string): StatusTone {
  if (['ATIVO', 'CONFIRMADA', 'CONCLUIDA', 'PAGO', 'DISPONIVEL', 'ALTA_MEDICA'].includes(status)) return 'success';
  if (['AGENDADA', 'PENDENTE', 'SOLICITADO', 'AGENDADO', 'VENCIMENTO_PROXIMO'].includes(status)) return 'warning';
  if (['CANCELADA', 'CANCELADO', 'ATRASADO', 'FALTOU', 'ESGOTADO', 'INATIVO'].includes(status)) return 'danger';
  if (['EM_ANDAMENTO', 'EM_ANALISE', 'ATIVA'].includes(status)) return 'info';
  if (['ESTOQUE_BAIXO', 'TRANSFERIDA'].includes(status)) return 'violet';
  return 'neutral';
}

export function StatusBadge({ status, tone }: { status: string; tone?: StatusTone }) {
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1', toneClasses[tone ?? statusTone(status)])}>
      {displayLabel(status)}
    </span>
  );
}
