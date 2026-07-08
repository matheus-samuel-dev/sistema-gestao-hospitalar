import { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-primary">
        <Icon size={24} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm font-medium text-muted">{description}</p>
    </div>
  );
}
