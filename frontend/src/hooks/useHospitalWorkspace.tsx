import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { AppointmentStatus, ServiceType } from '../types/healthcare';
import { toLocalIsoDate } from '../utils/healthcareFormat';

export type PeriodFilter = 'today' | 'week' | 'month' | 'custom';

export interface HospitalFilters {
  period: PeriodFilter;
  specialty: string;
  doctorId: string;
  status: '' | AppointmentStatus;
  serviceType: '' | ServiceType;
  patientId: string;
  insuranceProvider: string;
  priority: string;
}

interface HospitalWorkspaceContextValue {
  selectedDate: string;
  filters: HospitalFilters;
  activeFilterCount: number;
  setSelectedDate: (date: string) => void;
  changeDateByDays: (days: number) => void;
  updateFilter: <Key extends keyof HospitalFilters>(key: Key, value: HospitalFilters[Key]) => void;
  resetFilters: () => void;
}

const defaultFilters: HospitalFilters = {
  period: 'today',
  specialty: '',
  doctorId: '',
  status: '',
  serviceType: '',
  patientId: '',
  insuranceProvider: '',
  priority: ''
};

const HospitalWorkspaceContext = createContext<HospitalWorkspaceContextValue | null>(null);

export function HospitalWorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(toLocalIsoDate());
  const [filters, setFilters] = useState<HospitalFilters>(defaultFilters);

  function changeDateByDays(days: number) {
    const next = new Date(`${selectedDate}T12:00:00`);
    next.setDate(next.getDate() + days);
    setSelectedDate(toLocalIsoDate(next));
  }

  function updateFilter<Key extends keyof HospitalFilters>(key: Key, value: HospitalFilters[Key]) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters(defaultFilters);
  }

  const activeFilterCount = useMemo(
    () => Object.entries(filters).filter(([key, value]) => key !== 'period' && Boolean(value)).length + (filters.period !== 'today' ? 1 : 0),
    [filters]
  );

  const value = useMemo(
    () => ({ selectedDate, filters, activeFilterCount, setSelectedDate, changeDateByDays, updateFilter, resetFilters }),
    [activeFilterCount, filters, selectedDate]
  );

  return <HospitalWorkspaceContext.Provider value={value}>{children}</HospitalWorkspaceContext.Provider>;
}

export function useHospitalWorkspace() {
  const context = useContext(HospitalWorkspaceContext);
  if (!context) {
    throw new Error('useHospitalWorkspace must be used within HospitalWorkspaceProvider');
  }
  return context;
}
