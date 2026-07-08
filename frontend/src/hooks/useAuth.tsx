import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { demoUsers } from '../data/mockData';
import { login as apiLogin } from '../services/api';
import { UserProfile } from '../types/healthcare';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(() => {
    const raw = localStorage.getItem('healthcare.user');
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  });

  async function signIn(email: string, password: string) {
    setLoading(true);
    try {
      try {
        const response = await apiLogin(email, password);
        localStorage.setItem('healthcare.accessToken', response.accessToken);
        localStorage.setItem('healthcare.refreshToken', response.refreshToken);
        localStorage.setItem('healthcare.user', JSON.stringify(response.user));
        setUser(response.user);
      } catch {
        const demoProfile = demoUsers[email.toLowerCase()];
        if (!demoProfile || password !== '123456') {
            throw new Error('Credenciais inválidas. Use admin@healthcare.com / 123456.');
        }
        localStorage.setItem('healthcare.accessToken', 'demo-token');
        localStorage.setItem('healthcare.refreshToken', 'demo-refresh');
        localStorage.setItem('healthcare.user', JSON.stringify(demoProfile));
        setUser(demoProfile);
      }
      toast.success('Login realizado com sucesso.');
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    localStorage.removeItem('healthcare.accessToken');
    localStorage.removeItem('healthcare.refreshToken');
    localStorage.removeItem('healthcare.user');
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, signIn, signOut }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
