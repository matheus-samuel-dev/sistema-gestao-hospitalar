import { Search } from 'lucide-react';

interface SearchInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function SearchInput({ value, onChange, placeholder = 'Buscar...', label = 'Buscar' }: SearchInputProps) {
  return (
    <label className="relative block w-full">
      <span className="sr-only">{label}</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
      />
    </label>
  );
}
