import {
  Appointment,
  ChartPoint,
  DashboardData,
  Doctor,
  Exam,
  Hospitalization,
  MedicalRecord,
  Medicine,
  Patient,
  Payment,
  SpecialtyPoint,
  StatCardData,
  UserProfile
} from '../types/healthcare';

export const demoUser: UserProfile = {
  id: 'user-admin',
  name: 'Dr. João Silva',
  email: 'admin@healthcare.com',
  position: 'Administrador',
  avatarUrl: 'https://ui-avatars.com/api/?name=Dr+Joao+Silva&background=2563EB&color=fff',
  roles: ['ADMIN']
};

export const demoUsers: Record<string, UserProfile> = {
  'admin@healthcare.com': demoUser,
  'medico@healthcare.com': {
    ...demoUser,
    id: 'user-medico',
    name: 'Dra. Ana Costa',
    email: 'medico@healthcare.com',
    position: 'Médica cardiologista',
    avatarUrl: 'https://ui-avatars.com/api/?name=Dra+Ana+Costa&background=2563EB&color=fff',
    roles: ['MEDICO']
  },
  'recepcao@healthcare.com': {
    ...demoUser,
    id: 'user-recepcao',
    name: 'Camila Rocha',
    email: 'recepcao@healthcare.com',
    position: 'Recepção',
    avatarUrl: 'https://ui-avatars.com/api/?name=Camila+Rocha&background=10B981&color=fff',
    roles: ['RECEPCAO']
  },
  'financeiro@healthcare.com': {
    ...demoUser,
    id: 'user-financeiro',
    name: 'Bruno Martins',
    email: 'financeiro@healthcare.com',
    position: 'Analista Financeiro',
    avatarUrl: 'https://ui-avatars.com/api/?name=Bruno+Martins&background=8B5CF6&color=fff',
    roles: ['FINANCEIRO']
  }
};

const today = new Date();
const todayIso = toIsoDate(today);
const tomorrowIso = toIsoDate(addDays(today, 1));

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export const doctors: Doctor[] = [
  {
    id: 'doctor-1',
    name: 'Dr. João Silva',
    crm: 'CRM-SP 102030',
    specialty: 'Clínico Geral',
    phone: '(11) 99812-0000',
    email: 'joao.silva@healthcare.com',
    officeHours: '08:00 - 17:00',
    avatarUrl: 'https://ui-avatars.com/api/?name=Joao+Silva&background=071B3A&color=fff',
    status: 'ATIVO'
  },
  {
    id: 'doctor-2',
    name: 'Dra. Ana Costa',
    crm: 'CRM-SP 203040',
    specialty: 'Cardiologia',
    phone: '(11) 99122-2200',
    email: 'ana.costa@healthcare.com',
    officeHours: '09:00 - 18:00',
    avatarUrl: 'https://ui-avatars.com/api/?name=Ana+Costa&background=2563EB&color=fff',
    status: 'ATIVO'
  },
  {
    id: 'doctor-3',
    name: 'Dr. Pedro Santos',
    crm: 'CRM-SP 304050',
    specialty: 'Ortopedia',
    phone: '(11) 99333-4400',
    email: 'pedro.santos@healthcare.com',
    officeHours: '07:00 - 16:00',
    avatarUrl: 'https://ui-avatars.com/api/?name=Pedro+Santos&background=10B981&color=fff',
    status: 'ATIVO'
  },
  {
    id: 'doctor-4',
    name: 'Dra. Marina Lima',
    crm: 'CRM-SP 405060',
    specialty: 'Pediatria',
    phone: '(11) 99444-5500',
    email: 'marina.lima@healthcare.com',
    officeHours: '10:00 - 19:00',
    avatarUrl: 'https://ui-avatars.com/api/?name=Marina+Lima&background=8B5CF6&color=fff',
    status: 'ATIVO'
  }
];

export const patients: Patient[] = [
  patient('patient-1', 'Maria Oliveira Santos', '123.456.789-01', '1986-04-12', 40, 'FEMININO', 'Unimed', 'Alergia a dipirona'),
  patient('patient-2', 'José Santos Silva', '234.567.890-12', '1978-08-23', 47, 'MASCULINO', 'Bradesco Saúde', 'Hipertensão familiar'),
  patient('patient-3', 'Ana Pereira Lima', '345.678.901-23', '1992-01-05', 34, 'FEMININO', 'SulAmérica', 'Sem alergias conhecidas'),
  patient('patient-4', 'Carlos Lima Costa', '456.789.012-34', '1969-11-18', 56, 'MASCULINO', 'Amil', 'Diabetes tipo 2 na família'),
  patient('patient-5', 'Juliana Costa Silva', '567.890.123-45', '2001-07-29', 24, 'FEMININO', 'NotreDame', 'Alergia a penicilina'),
  patient('patient-6', 'Roberto Almeida', '678.901.234-56', '1959-03-08', 67, 'MASCULINO', 'Particular', 'Cardiopatia familiar'),
  patient('patient-7', 'Fernanda Souza', '789.012.345-67', '1988-09-14', 37, 'FEMININO', 'Porto Seguro', 'Rinite alérgica'),
  patient('patient-8', 'Gustavo Silva', '890.123.456-78', '1995-12-03', 30, 'MASCULINO', 'Unimed', 'Sem observações'),
  patient('patient-9', 'Amanda Santos', '901.234.567-89', '2010-02-21', 16, 'FEMININO', 'Amil', 'Alergia alimentar'),
  patient('patient-10', 'Enzo Gabriel', '012.345.678-90', '2018-05-30', 8, 'MASCULINO', 'SulAmerica', 'Asma leve')
];

function patient(
  id: string,
  fullName: string,
  cpf: string,
  birthDate: string,
  age: number,
  gender: Patient['gender'],
  insuranceProvider: string,
  allergies: string
): Patient {
  return {
    id,
    fullName,
    cpf,
    rg: `MG-${cpf.slice(0, 3)}.${cpf.slice(4, 7)}`,
    birthDate,
    age,
    gender,
    phone: `(11) 9${cpf.replace(/\D/g, '').slice(0, 4)}-1122`,
    email: `${fullName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replaceAll(' ', '.')}@email.com`,
    address: `Rua das Flores, ${cpf.replace(/\D/g, '').slice(0, 3)} - São Paulo/SP`,
    insuranceProvider,
    insuranceNumber: `HC-${cpf.replace(/\D/g, '').slice(0, 6)}`,
    allergies,
    familyHistory: 'Histórico familiar revisado em triagem.',
    observations: 'Paciente acompanhado pela equipe multidisciplinar HealthCare.',
    status: 'ATIVO'
  };
}

export const appointments: Appointment[] = [
  appointment('apt-1', patients[0], doctors[0], `${todayIso}T08:00:00`, 'CONFIRMADA', 30),
  appointment('apt-2', patients[1], doctors[1], `${todayIso}T09:00:00`, 'AGENDADA', 45),
  appointment('apt-3', patients[2], doctors[2], `${todayIso}T10:30:00`, 'EM_ANDAMENTO', 30),
  appointment('apt-4', patients[3], doctors[3], `${todayIso}T11:00:00`, 'CONFIRMADA', 30),
  appointment('apt-5', patients[4], doctors[0], `${todayIso}T14:00:00`, 'AGENDADA', 30),
  appointment('apt-6', patients[5], doctors[1], `${todayIso}T15:30:00`, 'AGENDADA', 45),
  appointment('apt-7', patients[6], doctors[2], `${tomorrowIso}T09:30:00`, 'CONFIRMADA', 30),
  appointment('apt-8', patients[7], doctors[3], `${tomorrowIso}T13:00:00`, 'AGENDADA', 30)
];

function appointment(id: string, selectedPatient: Patient, doctor: Doctor, startAt: string, status: Appointment['status'], durationMinutes: number): Appointment {
  return {
    id,
    patientId: selectedPatient.id,
    patientName: selectedPatient.fullName,
    doctorId: doctor.id,
    doctorName: doctor.name,
    specialty: doctor.specialty,
    startAt,
    durationMinutes,
    status,
    observations: 'Consulta de acompanhamento com foco em cuidado preventivo.'
  };
}

export const exams: Exam[] = [
  exam('exam-1', patients[0], doctors[1], 'Hemograma Completo', 'SOLICITADO'),
  exam('exam-2', patients[1], doctors[1], 'Eletrocardiograma', 'EM_ANALISE'),
  exam('exam-3', patients[2], doctors[2], 'Raio-X Tórax', 'AGENDADO'),
  exam('exam-4', patients[3], doctors[0], 'Glicemia', 'CONCLUIDO'),
  exam('exam-5', patients[4], doctors[3], 'Ultrassonografia', 'SOLICITADO')
];

function exam(id: string, selectedPatient: Patient, doctor: Doctor, examType: string, status: Exam['status']): Exam {
  return {
    id,
    patientId: selectedPatient.id,
    patientName: selectedPatient.fullName,
    doctorId: doctor.id,
    doctorName: doctor.name,
    examType,
    requestedAt: '2026-07-03',
    performedAt: status === 'CONCLUIDO' ? todayIso : undefined,
    result: status === 'CONCLUIDO' ? 'Resultado dentro dos parâmetros esperados.' : undefined,
    status,
    observations: 'Prioridade clínica padrão.'
  };
}

export const hospitalizations: Hospitalization[] = [
  hospitalization('hosp-1', patients[3], doctors[1], '301', 'L1', 'ATIVA', 'Monitoramento cardiológico'),
  hospitalization('hosp-2', patients[5], doctors[0], '302', 'L2', 'ATIVA', 'Observação pós-procedimento'),
  hospitalization('hosp-3', patients[7], doctors[2], '303', 'L3', 'ALTA_MEDICA', 'Recuperação ortopédica')
];

function hospitalization(id: string, selectedPatient: Patient, doctor: Doctor, room: string, bed: string, status: Hospitalization['status'], reason: string): Hospitalization {
  return {
    id,
    patientId: selectedPatient.id,
    patientName: selectedPatient.fullName,
    doctorId: doctor.id,
    doctorName: doctor.name,
    room,
    bed,
    entryDate: '2026-07-01',
    expectedDischargeDate: '2026-07-08',
    reason,
    status,
    observations: 'Paciente em acompanhamento de enfermagem.'
  };
}

export const payments: Payment[] = [
  payment('pay-1', patients[0], 'CONSULTA', 320, 'PAGO', 'PIX', '2026-07-02', '2026-07-02'),
  payment('pay-2', patients[1], 'EXAME', 480, 'PENDENTE', 'CONVENIO', '2026-07-10'),
  payment('pay-3', patients[3], 'INTERNACAO', 3200, 'PAGO', 'CONVENIO', todayIso, todayIso),
  payment('pay-4', patients[4], 'CONSULTA', 260, 'ATRASADO', 'CARTAO_CREDITO', '2026-06-20'),
  payment('pay-5', patients[5], 'PROCEDIMENTO', 1400, 'PAGO', 'CARTAO_DEBITO', '2026-07-01', '2026-07-01')
];

function payment(id: string, selectedPatient: Patient, serviceType: Payment['serviceType'], amount: number, status: Payment['status'], method: Payment['method'], dueDate: string, paymentDate?: string): Payment {
  return {
    id,
    patientId: selectedPatient.id,
    patientName: selectedPatient.fullName,
    serviceType,
    amount,
    status,
    method,
    dueDate,
    paymentDate
  };
}

export const medicines: Medicine[] = [
  medicine('med-1', 'Dipirona Sódica', 'Dipirona', 'Medley', 'DIP-2026-A', '2027-06-01', 180, 40, 'DISPONIVEL'),
  medicine('med-2', 'Amoxicilina', 'Amoxicilina', 'EMS', 'AMX-2026-B', '2027-02-01', 75, 30, 'DISPONIVEL'),
  medicine('med-3', 'Omeprazol', 'Omeprazol', 'Eurofarma', 'OME-2026-D', '2026-08-05', 48, 50, 'ESTOQUE_BAIXO'),
  medicine('med-4', 'Soro Fisiológico', 'Cloreto de sódio', 'Halex', 'SOR-2026-E', '2027-04-10', 220, 80, 'DISPONIVEL')
];

function medicine(id: string, name: string, activeIngredient: string, manufacturer: string, batch: string, expirationDate: string, quantityInStock: number, minimumStock: number, status: Medicine['status']): Medicine {
  return {
    id,
    name,
    activeIngredient,
    manufacturer,
    batch,
    expirationDate,
    quantityInStock,
    minimumStock,
    status,
    lowStock: quantityInStock <= minimumStock,
    expiringSoon: expirationDate < '2026-09-01'
  };
}

export const record: MedicalRecord = {
  id: 'record-1',
  patientId: patients[0].id,
  patientName: patients[0].fullName,
  birthDate: patients[0].birthDate,
  age: patients[0].age,
  gender: patients[0].gender,
  phone: patients[0].phone,
  email: patients[0].email,
  allergies: patients[0].allergies,
  familyHistory: patients[0].familyHistory,
  summary: 'Paciente em acompanhamento regular, sinais vitais estáveis e plano terapêutico ativo.',
  currentMedications: 'Losartana 50mg, 1x ao dia. Vitamina D 2000UI, 1x ao dia.',
  medicalNotes: 'Manter acompanhamento trimestral, estimular atividade física leve e revisar exames recentes no próximo retorno.',
  entries: [
    {
      id: 'entry-1',
      doctorId: doctors[0].id,
      doctorName: doctors[0].name,
      occurredAt: '2026-07-03T10:00:00',
      title: 'Evolução clínica',
      description: 'Paciente relata melhora dos sintomas e boa adesão ao tratamento. Pressão arterial controlada.'
    },
    {
      id: 'entry-2',
      doctorId: doctors[1].id,
      doctorName: doctors[1].name,
      occurredAt: '2026-06-22T14:20:00',
      title: 'Avaliação cardiológica',
      description: 'Eletrocardiograma sem alterações agudas. Mantida conduta e solicitado retorno em 90 dias.'
    }
  ],
  prescriptions: [
    {
      id: 'presc-1',
      doctorId: doctors[0].id,
      doctorName: doctors[0].name,
      medication: 'Losartana',
      dosage: '50mg',
      frequency: '1 vez ao dia',
      duration: '90 dias',
      observations: 'Tomar pela manhã e monitorar pressão arterial.'
    },
    {
      id: 'presc-2',
      doctorId: doctors[1].id,
      doctorName: doctors[1].name,
      medication: 'Sinvastatina',
      dosage: '20mg',
      frequency: '1 vez ao dia',
      duration: '60 dias',
      observations: 'Tomar à noite.'
    }
  ]
};

export const stats: StatCardData[] = [
  { title: 'Consultas hoje', value: '24', variation: '+12%', tone: 'blue' },
  { title: 'Pacientes ativos', value: '1.284', variation: '+8%', tone: 'green' },
  { title: 'Internações', value: '36', variation: '+3%', tone: 'purple' },
  { title: 'Receita do mês', value: 'R$ 186.420', variation: '+18%', tone: 'amber' }
];

export const appointmentsLast7Days: ChartPoint[] = [
  { label: 'Seg', value: 18 },
  { label: 'Ter', value: 24 },
  { label: 'Qua', value: 21 },
  { label: 'Qui', value: 28 },
  { label: 'Sex', value: 32 },
  { label: 'Sab', value: 24 },
  { label: 'Dom', value: 14 }
];

export const revenueLast6Months: ChartPoint[] = [
  { label: 'Fev', value: 92000 },
  { label: 'Mar', value: 118000 },
  { label: 'Abr', value: 126000 },
  { label: 'Mai', value: 148000 },
  { label: 'Jun', value: 162000 },
  { label: 'Jul', value: 186000 }
];

export const appointmentsBySpecialty: SpecialtyPoint[] = [
  { specialty: 'Clínico Geral', total: 38 },
  { specialty: 'Cardiologia', total: 24 },
  { specialty: 'Ortopedia', total: 18 },
  { specialty: 'Pediatria', total: 15 },
  { specialty: 'Neurologia', total: 10 }
];

export const dashboardData: DashboardData = {
  stats,
  appointmentsLast7Days,
  revenueLast6Months,
  appointmentsBySpecialty,
  upcomingAppointments: appointments.slice(0, 6),
  latestPatients: patients.slice(0, 6),
  pendingExams: exams.filter((item) => item.status !== 'CONCLUIDO'),
  recentHospitalizations: hospitalizations,
  monthRevenue: 186420
};
