import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { HospitalWorkspaceProvider } from '../../hooks/useHospitalWorkspace';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <HospitalWorkspaceProvider>
      <div className="min-h-screen bg-surface">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="lg:pl-[292px]">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </HospitalWorkspaceProvider>
  );
}
