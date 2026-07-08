import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  pageSize?: number;
}

export function DataTable<T>({ columns, data, emptyMessage = 'Nenhum registro encontrado.', pageSize = 8 }: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const start = (page - 1) * pageSize;
  const visibleData = useMemo(() => data.slice(start, start + pageSize), [data, pageSize, start]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const firstVisible = data.length === 0 ? 0 : start + 1;
  const lastVisible = Math.min(start + visibleData.length, data.length);

  return (
    <div className="overflow-hidden rounded-[1.4rem] border border-white/80 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td className="px-5 py-10 text-center text-sm font-medium text-muted" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              visibleData.map((row, rowIndex) => (
                <tr key={rowIndex} className="transition hover:bg-blue-50/45">
                  {columns.map((column) => (
                    <td key={column.header} className={column.className ?? 'px-5 py-4 text-sm text-slate-700'}>
                      {column.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-muted">
          Exibindo {firstVisible}-{lastVisible} de {data.length} registros
        </p>
        <div className="flex items-center gap-2">
          <button
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            title="Página anterior"
            aria-label="Página anterior"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="rounded-xl bg-primary px-3 py-2 text-sm font-bold text-white">{page}</span>
          <button
            className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
            title="Próxima página"
            aria-label="Próxima página"
            disabled={page === totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
