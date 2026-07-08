import { zodResolver } from '@hookform/resolvers/zod';
import { Activity, Eye, HeartPulse, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  password: z.string().min(6, 'A senha precisa ter pelo menos 6 caracteres.')
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { signIn, loading, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'admin@healthcare.com',
      password: '123456'
    }
  });

  if (user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(data: FormData) {
    await signIn(data.email, data.password);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-navy text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-16">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(37,99,235,0.28),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.26),transparent_20rem)]" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary shadow-lg shadow-blue-500/30">
              <HeartPulse size={28} />
            </div>
            <div>
              <strong className="block text-2xl font-extrabold">HealthCare</strong>
              <span className="text-sm font-semibold text-blue-200">Sistema Hospitalar</span>
            </div>
          </div>

          <div className="relative z-10 my-16 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-blue-100">
              <ShieldCheck size={17} />
              Plataforma segura com JWT e controle por perfil
            </div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Gestão hospitalar com a clareza de um produto SaaS real.
            </h1>
            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-blue-100">
              Dashboard analítico, agenda médica, prontuário eletrônico, financeiro, farmácia e relatórios em uma experiência visual premium.
            </p>
          </div>

          <div className="relative z-10 grid gap-4 sm:grid-cols-3">
            {[
              ['24', 'consultas hoje'],
              ['1.284', 'pacientes ativos'],
              ['R$ 186k', 'receita mensal']
            ].map(([value, label]) => (
              <div key={label} className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <strong className="text-2xl font-extrabold">{value}</strong>
                <p className="mt-1 text-sm font-semibold text-blue-200">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center bg-surface px-5 py-10 text-slate-950">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md rounded-[2rem] border border-white bg-white p-7 shadow-2xl shadow-blue-950/10">
            <div className="mb-8">
              <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-primary">
                <Activity size={28} />
              </div>
              <h2 className="text-3xl font-extrabold">Acesse sua conta</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-muted">Use o usuário demo para abrir o dashboard com dados fictícios realistas.</p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">E-mail</span>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    {...register('email')}
                    className="h-12 w-full rounded-2xl border border-slate-200 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
                    placeholder="admin@healthcare.com"
                  />
                </div>
                {errors.email ? <span className="mt-2 block text-xs font-bold text-danger">{errors.email.message}</span> : null}
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Senha</span>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="h-12 w-full rounded-2xl border border-slate-200 pl-11 pr-12 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100"
                    placeholder="123456"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-primary"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <Eye size={18} />
                  </button>
                </div>
                {errors.password ? <span className="mt-2 block text-xs font-bold text-danger">{errors.password.message}</span> : null}
              </label>
            </div>

            <button
              disabled={loading}
              className="mt-6 h-12 w-full rounded-2xl bg-primary text-sm font-extrabold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? 'Entrando...' : 'Entrar no HealthCare'}
            </button>

            <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm">
              <p className="font-extrabold text-primary">Usuario demo</p>
              <p className="mt-1 font-semibold text-slate-600">admin@healthcare.com / 123456</p>
              <p className="mt-1 font-semibold text-slate-500">medico@healthcare.com / 123456</p>
              <p className="mt-1 font-semibold text-slate-500">recepcao@healthcare.com / 123456</p>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
