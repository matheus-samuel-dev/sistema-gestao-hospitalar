import { HospitalFilters } from '../hooks/useHospitalWorkspace';
import { Appointment, Doctor, Patient, Payment } from '../types/healthcare';
import { dateFromIsoDate, toLocalIsoDate } from './healthcareFormat';

export function dateMatchesPeriod(dateIso: string, selectedDate: string, period: HospitalFilters['period']) {
  if (period === 'month') {
    return dateIso.slice(0, 7) === selectedDate.slice(0, 7);
  }

  if (period === 'week') {
    const start = dateFromIsoDate(selectedDate);
    const end = dateFromIsoDate(selectedDate);
    end.setDate(end.getDate() + 7);
    const current = dateFromIsoDate(dateIso);
    return current >= start && current < end;
  }

  return dateIso === selectedDate;
}

export function appointmentMatchesFilters(appointment: Appointment, filters: HospitalFilters, selectedDate: string) {
  const dateIso = appointment.startAt.slice(0, 10);
  if (!dateMatchesPeriod(dateIso, selectedDate, filters.period)) return false;
  if (filters.specialty && appointment.specialty !== filters.specialty) return false;
  if (filters.doctorId && appointment.doctorId !== filters.doctorId) return false;
  if (filters.status && appointment.status !== filters.status) return false;
  if (filters.patientId && appointment.patientId !== filters.patientId) return false;
  return true;
}

export function patientMatchesFilters(patient: Patient, filters: HospitalFilters) {
  if (filters.patientId && patient.id !== filters.patientId) return false;
  if (filters.insuranceProvider && patient.insuranceProvider !== filters.insuranceProvider) return false;
  return true;
}

export function doctorMatchesFilters(doctor: Doctor, filters: HospitalFilters) {
  if (filters.doctorId && doctor.id !== filters.doctorId) return false;
  if (filters.specialty && doctor.specialty !== filters.specialty) return false;
  return true;
}

export function paymentMatchesFilters(payment: Payment, filters: HospitalFilters) {
  if (filters.patientId && payment.patientId !== filters.patientId) return false;
  if (filters.serviceType && payment.serviceType !== filters.serviceType) return false;
  return true;
}

export function selectedPeriodLabel(selectedDate: string, period: HospitalFilters['period']) {
  if (period === 'week') return `Próximos 7 dias a partir de ${selectedDate}`;
  if (period === 'month') return `Mês ${selectedDate.slice(5, 7)}/${selectedDate.slice(0, 4)}`;
  return toLocalIsoDate(dateFromIsoDate(selectedDate)) === toLocalIsoDate() ? 'Hoje' : selectedDate;
}
