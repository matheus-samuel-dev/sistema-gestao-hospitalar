export type Role = 'ADMIN' | 'MEDICO' | 'RECEPCAO' | 'FINANCEIRO';

export type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'violet';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  position: string;
  avatarUrl?: string;
  roles: Role[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: UserProfile;
}

export interface StatCardData {
  title: string;
  value: string;
  variation: string;
  tone: 'blue' | 'green' | 'purple' | 'amber';
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface SpecialtyPoint {
  specialty: string;
  total: number;
}

export interface Patient {
  id: string;
  fullName: string;
  cpf: string;
  rg: string;
  birthDate: string;
  age: number;
  gender: 'FEMININO' | 'MASCULINO' | 'OUTRO' | 'NAO_INFORMADO';
  phone: string;
  email: string;
  address: string;
  insuranceProvider: string;
  insuranceNumber: string;
  allergies: string;
  familyHistory: string;
  observations: string;
  status: 'ATIVO' | 'INATIVO';
}

export interface Doctor {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  phone: string;
  email: string;
  officeHours: string;
  avatarUrl?: string;
  status: 'ATIVO' | 'INATIVO';
}

export type AppointmentStatus = 'AGENDADA' | 'CONFIRMADA' | 'EM_ANDAMENTO' | 'CONCLUIDA' | 'CANCELADA' | 'FALTOU';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  startAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  observations: string;
}

export type ExamStatus = 'SOLICITADO' | 'AGENDADO' | 'EM_ANALISE' | 'CONCLUIDO' | 'CANCELADO';

export interface Exam {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName: string;
  examType: string;
  requestedAt: string;
  performedAt?: string;
  result?: string;
  status: ExamStatus;
  observations: string;
}

export type HospitalizationStatus = 'ATIVA' | 'ALTA_MEDICA' | 'TRANSFERIDA' | 'CANCELADA';

export interface Hospitalization {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName: string;
  room: string;
  bed: string;
  entryDate: string;
  expectedDischargeDate?: string;
  dischargeDate?: string;
  reason: string;
  status: HospitalizationStatus;
  observations: string;
}

export type PaymentStatus = 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
export type PaymentMethod = 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX' | 'CONVENIO';
export type ServiceType = 'CONSULTA' | 'EXAME' | 'INTERNACAO' | 'PROCEDIMENTO' | 'FARMACIA';

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  serviceType: ServiceType;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  dueDate: string;
  paymentDate?: string;
}

export type MedicineStatus = 'DISPONIVEL' | 'ESTOQUE_BAIXO' | 'VENCIMENTO_PROXIMO' | 'ESGOTADO' | 'INATIVO';

export interface Medicine {
  id: string;
  name: string;
  activeIngredient: string;
  manufacturer: string;
  batch: string;
  expirationDate: string;
  quantityInStock: number;
  minimumStock: number;
  status: MedicineStatus;
  lowStock: boolean;
  expiringSoon: boolean;
}

export interface MedicalRecordEntry {
  id: string;
  doctorId?: string;
  doctorName: string;
  occurredAt: string;
  title: string;
  description: string;
}

export interface Prescription {
  id: string;
  doctorId?: string;
  doctorName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  observations: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  patientName: string;
  birthDate: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  allergies: string;
  familyHistory: string;
  summary: string;
  currentMedications: string;
  medicalNotes: string;
  entries: MedicalRecordEntry[];
  prescriptions: Prescription[];
}

export interface DashboardData {
  stats: StatCardData[];
  appointmentsLast7Days: ChartPoint[];
  revenueLast6Months: ChartPoint[];
  appointmentsBySpecialty: SpecialtyPoint[];
  upcomingAppointments: Appointment[];
  latestPatients: Patient[];
  pendingExams: Exam[];
  recentHospitalizations: Hospitalization[];
  monthRevenue: number;
}
