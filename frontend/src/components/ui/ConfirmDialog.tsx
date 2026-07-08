import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ open, title, description, onCancel, onConfirm }: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel}>
      <div className="flex gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-red-50 text-danger">
          <AlertTriangle size={22} />
        </div>
        <p className="text-sm font-medium leading-6 text-slate-600">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300">
          Cancelar
        </button>
        <button onClick={onConfirm} className="rounded-xl bg-danger px-4 py-2 text-sm font-bold text-white transition hover:bg-red-600">
          Confirmar
        </button>
      </div>
    </Modal>
  );
}
