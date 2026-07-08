import { ButtonHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from './cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
}

const variants = {
  primary: 'bg-primary text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:border-primary hover:text-primary',
  ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900',
  danger: 'bg-danger text-white hover:bg-red-600'
};

export function Button({ icon: Icon, children, className, variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      className={cn('inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60', variants[variant], className)}
      type={type}
      {...props}
    >
      {Icon ? <Icon size={18} /> : null}
      {children}
    </button>
  );
}
