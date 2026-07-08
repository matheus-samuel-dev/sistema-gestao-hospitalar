import { LucideIcon } from 'lucide-react';
import { cn } from './cn';

interface StatCardProps {
  title: string;
  value: string;
  variation: string;
  icon: LucideIcon;
  tone: 'blue' | 'green' | 'purple' | 'amber';
}

const toneClasses = {
  blue: 'bg-blue-50 text-primary',
  green: 'bg-emerald-50 text-success',
  purple: 'bg-violet-50 text-violet',
  amber: 'bg-amber-50 text-warning'
};

export function StatCard({ title, value, variation, icon: Icon, tone }: StatCardProps) {
  return (
    <article className="rounded-[1.4rem] border border-white/80 bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-muted">{title}</p>
          <strong className="mt-3 block text-3xl font-extrabold text-slate-950">{value}</strong>
        </div>
        <div className={cn('grid h-12 w-12 place-items-center rounded-2xl', toneClasses[tone])}>
          <Icon size={22} />
        </div>
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm">
        <span className="rounded-full bg-emerald-50 px-2 py-1 font-bold text-success">{variation}</span>
        <span className="font-medium text-muted">vs. periodo anterior</span>
      </div>
    </article>
  );
}
