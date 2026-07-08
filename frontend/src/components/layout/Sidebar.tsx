import {
  BarChart3,
  BedDouble,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileBarChart,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  Pill,
  Settings,
  Stethoscope,
  TestTube2,
  UserRound,
  UsersRound,
  X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Avatar } from '../ui/Avatar';
import { cn } from '../ui/cn';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menu = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Agenda', icon: CalendarDays, path: '/agenda' },
  { label: 'Pacientes', icon: UsersRound, path: '/pacientes' },
  { label: 'Médicos', icon: Stethoscope, path: '/medicos' },
  { label: 'Consultas', icon: ClipboardList, path: '/consultas' },
  { label: 'Prontuários', icon: HeartPulse, path: '/prontuarios' },
  { label: 'Exames', icon: TestTube2, path: '/exames' },
  { label: 'Internações', icon: BedDouble, path: '/internacoes' },
  { label: 'Financeiro', icon: CreditCard, path: '/financeiro' },
  { label: 'Farmácia', icon: Pill, path: '/farmacia' },
  { label: 'Relatórios', icon: FileBarChart, path: '/relatorios' },
  { label: 'Configurações', icon: Settings, path: '/configuracoes' }
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, signOut } = useAuth();

  return (
    <>
      <div className={cn('fixed inset-0 z-40 bg-navy/50 backdrop-blur-sm lg:hidden', open ? 'block' : 'hidden')} onClick={onClose} />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[292px] flex-col bg-navy px-5 py-5 text-white shadow-2xl transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-primary shadow-lg shadow-blue-500/30">
              <HeartPulse size={26} />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-success ring-4 ring-navy" />
            </div>
            <div>
              <strong className="block text-xl font-extrabold">HealthCare</strong>
              <span className="text-xs font-semibold text-blue-200">Sistema Hospitalar</span>
            </div>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 lg:hidden" onClick={onClose} title="Fechar menu" aria-label="Fechar menu lateral">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-blue-100 transition',
                  isActive ? 'bg-primary text-white shadow-lg shadow-blue-900/20' : 'hover:bg-white/10 hover:text-white'
                )
              }
            >
              <item.icon size={19} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-5 rounded-[1.35rem] border border-white/10 bg-white/[0.08] p-4">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name ?? 'Usuário'} src={user?.avatarUrl} />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{user?.name ?? 'Dr. João Silva'}</p>
              <p className="truncate text-xs font-medium text-blue-200">{user?.position ?? 'Administrador'}</p>
            </div>
          </div>
          <button
            onClick={signOut}
            className="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white/10 text-sm font-bold text-blue-100 transition hover:bg-white/15 hover:text-white"
            aria-label="Sair do sistema"
          >
            <LogOut size={17} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
