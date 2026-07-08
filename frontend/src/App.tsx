import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { AppLayout } from './components/layout/AppLayout';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const LoginPage = lazy(() => import('./pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const PatientsPage = lazy(() => import('./pages/PatientsPage').then((module) => ({ default: module.PatientsPage })));
const DoctorsPage = lazy(() => import('./pages/DoctorsPage').then((module) => ({ default: module.DoctorsPage })));
const AgendaPage = lazy(() => import('./pages/AgendaPage').then((module) => ({ default: module.AgendaPage })));
const MedicalRecordsPage = lazy(() => import('./pages/MedicalRecordsPage').then((module) => ({ default: module.MedicalRecordsPage })));
const ExamsPage = lazy(() => import('./pages/ExamsPage').then((module) => ({ default: module.ExamsPage })));
const HospitalizationsPage = lazy(() => import('./pages/HospitalizationsPage').then((module) => ({ default: module.HospitalizationsPage })));
const FinancePage = lazy(() => import('./pages/FinancePage').then((module) => ({ default: module.FinancePage })));
const PharmacyPage = lazy(() => import('./pages/PharmacyPage').then((module) => ({ default: module.PharmacyPage })));
const ReportsPage = lazy(() => import('./pages/ReportsPage').then((module) => ({ default: module.ReportsPage })));
const SimpleModulePage = lazy(() => import('./pages/SimpleModulePage').then((module) => ({ default: module.SimpleModulePage })));

function ProtectedRoute() {
  const { user } = useAuth();
  return user ? <AppLayout /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/login" element={<PublicRoute />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/agenda" element={<AgendaPage />} />
            <Route path="/pacientes" element={<PatientsPage />} />
            <Route path="/medicos" element={<DoctorsPage />} />
            <Route path="/consultas" element={<AgendaPage />} />
            <Route path="/prontuarios" element={<MedicalRecordsPage />} />
            <Route path="/exames" element={<ExamsPage />} />
            <Route path="/internacoes" element={<HospitalizationsPage />} />
            <Route path="/financeiro" element={<FinancePage />} />
            <Route path="/farmacia" element={<PharmacyPage />} />
            <Route path="/relatorios" element={<ReportsPage />} />
            <Route path="/configuracoes" element={<SimpleModulePage title="Configurações" />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
