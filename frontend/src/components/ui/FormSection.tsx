import { ReactNode } from 'react';

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.2rem] border border-slate-100 bg-slate-50/70 p-4">
      <h3 className="mb-4 text-sm font-extrabold uppercase tracking-wide text-slate-500">{title}</h3>
      <div className="grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}
