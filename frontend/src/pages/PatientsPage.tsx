import { useMemo, useState } from 'react';
import { Edit3, Eye, Plus, Trash2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { patients as initialPatients } from '../data/mockData';
import { Patient } from '../types/healthcare';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Column, DataTable } from '../components/ui/DataTable';
import { FormSection } from '../components/ui/FormSection';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useHospitalWorkspace } from '../hooks/useHospitalWorkspace';
import { patientMatchesFilters } from '../utils/hospitalFilters';
import { displayLabel, normalizeText } from '../utils/healthcareFormat';

type PatientForm = Pick<
  Patient,
  'fullName' | 'cpf' | 'rg' | 'birthDate' | 'gender' | 'phone' | 'email' | 'address' | 'insuranceProvider' | 'insuranceNumber' | 'allergies' | 'familyHistory'
>;

const emptyForm: PatientForm = {
  fullName: 'Novo Paciente Demo',
  cpf: '111.222.333-44',
  rg: 'MG-111.222',
  birthDate: '1990-01-10',
  gender: 'FEMININO',
  phone: '(11) 99999-0000',
  email: 'novo.paciente@email.com',
  address: 'Rua das Flores, 100',
  insuranceProvider: 'Unimed',
  insuranceNumber: 'UNI-9001',
  allergies: 'Sem alergias conhecidas',
  familyHistory: 'Histórico revisado'
};

export function PatientsPage() {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [patients, setPatients] = useState(initialPatients);
  const [form, setForm] = useState<PatientForm>(emptyForm);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToInactivate, setPatientToInactivate] = useState<Patient | null>(null);
  const [statusFilter, setStatusFilter] = useState<'TODOS' | Patient['status']>('TODOS');
  const { filters } = useHospitalWorkspace();

  const filteredPatients = useMemo(() => {
    const term = normalizeText(search);
    return patients.filter((patient) => {
      const matchesSearch = [patient.fullName, patient.cpf, patient.phone, patient.email, patient.insuranceProvider].some((value) => normalizeText(value).includes(term));
      const matchesStatus = statusFilter === 'TODOS' || patient.status === statusFilter;
      return matchesSearch && matchesStatus && patientMatchesFilters(patient, filters);
    });
  }, [filters, patients, search, statusFilter]);

  function openCreateModal() {
    setMode('create');
    setForm(emptyForm);
    setOpen(true);
  }

  function openEditModal(patient: Patient) {
    setMode('edit');
    setSelectedPatient(patient);
    setForm({
      fullName: patient.fullName,
      cpf: patient.cpf,
      rg: patient.rg,
      birthDate: patient.birthDate,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      insuranceProvider: patient.insuranceProvider,
      insuranceNumber: patient.insuranceNumber,
      allergies: patient.allergies,
      familyHistory: patient.familyHistory
    });
    setOpen(true);
  }

  function closeForm() {
    setOpen(false);
    if (mode === 'edit') {
      setSelectedPatient(null);
    }
  }

  function calculateAge(birthDate: string) {
    const birth = new Date(`${birthDate}T12:00:00`);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age -= 1;
    }
    return Math.max(age, 0);
  }

  function handleSave() {
    if (form.fullName.trim().length < 3) {
      toast.error('Paciente sem nome completo não pode ser salvo.');
      return;
    }

    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(form.cpf)) {
      toast.error('Informe o CPF no formato 000.000.000-00.');
      return;
    }

    if (form.phone.trim().length < 10) {
      toast.error('Informe um telefone válido para contato.');
      return;
    }

    if (mode === 'edit' && selectedPatient) {
      setPatients((current) =>
        current.map((patient) =>
          patient.id === selectedPatient.id
            ? {
                ...patient,
                ...form,
                age: calculateAge(form.birthDate),
                observations: patient.observations
              }
            : patient
        )
      );
      toast.success('Paciente atualizado com sucesso.');
    } else {
      const created: Patient = {
        id: `patient-${Date.now()}`,
        ...form,
        age: calculateAge(form.birthDate),
        observations: 'Paciente cadastrado pela recepção HealthCare.',
        status: 'ATIVO'
      };
      setPatients((current) => [created, ...current]);
      toast.success('Paciente cadastrado com sucesso.');
    }

    setOpen(false);
    setSelectedPatient(null);
  }

  function confirmInactivation() {
    if (!patientToInactivate) return;
    setPatients((current) => current.map((patient) => (patient.id === patientToInactivate.id ? { ...patient, status: 'INATIVO' } : patient)));
    toast.success('Paciente inativado com registro preservado.');
    setPatientToInactivate(null);
  }

  const columns: Column<Patient>[] = [
    {
      header: 'Paciente',
      accessor: (patient) => (
        <div className="flex items-center gap-3">
          <Avatar name={patient.fullName} size="sm" />
          <div>
            <p className="font-bold text-slate-900">{patient.fullName}</p>
            <p className="text-xs font-semibold text-muted">{patient.email}</p>
          </div>
        </div>
      )
    },
    { header: 'CPF', accessor: (patient) => <span className="font-semibold">{patient.cpf}</span> },
    { header: 'Telefone', accessor: (patient) => patient.phone },
    { header: 'Convênio', accessor: (patient) => patient.insuranceProvider },
    { header: 'Idade', accessor: (patient) => `${patient.age} anos` },
    { header: 'Status', accessor: (patient) => <StatusBadge status={patient.status} /> },
    {
      header: 'Ações',
      accessor: (patient) => (
        <div className="flex items-center gap-2">
          <button className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-primary" title="Visualizar" aria-label={`Visualizar ${patient.fullName}`} onClick={() => setSelectedPatient(patient)}>
            <Eye size={16} />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500" title="Editar" aria-label={`Editar ${patient.fullName}`} onClick={() => openEditModal(patient)}>
            <Edit3 size={16} />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-danger disabled:opacity-40" title="Inativar" aria-label={`Inativar ${patient.fullName}`} disabled={patient.status === 'INATIVO'} onClick={() => setPatientToInactivate(patient)}>
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pacientes"
        subtitle="Cadastro completo, busca, filtros e status de pacientes"
        actions={<Button icon={UserPlus} onClick={openCreateModal}>Novo paciente</Button>}
      />

      <section className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, CPF, telefone ou convênio..." label="Buscar pacientes" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="h-12 rounded-2xl border border-white bg-white px-4 text-sm font-bold text-slate-600 shadow-sm outline-none">
            <option value="TODOS">Status: todos</option>
            <option value="ATIVO">{displayLabel('ATIVO')}</option>
            <option value="INATIVO">{displayLabel('INATIVO')}</option>
          </select>
          <Button icon={Plus} variant="secondary" onClick={openCreateModal}>
            Adicionar
          </Button>
        </div>
      </section>

      <DataTable columns={columns} data={filteredPatients} emptyMessage="Nenhum paciente encontrado para os filtros atuais." />

      <Modal open={open} title={mode === 'edit' ? 'Editar paciente' : 'Cadastrar paciente'} onClose={closeForm}>
        <div className="space-y-5">
          <FormSection title="Dados pessoais">
            <Input label="Nome completo" value={form.fullName} onChange={(value) => setForm((current) => ({ ...current, fullName: value }))} />
            <Input label="CPF" value={form.cpf} onChange={(value) => setForm((current) => ({ ...current, cpf: value }))} />
            <Input label="RG" value={form.rg} onChange={(value) => setForm((current) => ({ ...current, rg: value }))} />
            <Input label="Data de nascimento" type="date" value={form.birthDate} onChange={(value) => setForm((current) => ({ ...current, birthDate: value }))} />
            <label className="block">
              <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">Gênero</span>
              <select value={form.gender} onChange={(event) => setForm((current) => ({ ...current, gender: event.target.value as Patient['gender'] }))} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100">
                <option value="FEMININO">Feminino</option>
                <option value="MASCULINO">Masculino</option>
                <option value="OUTRO">Outro</option>
                <option value="NAO_INFORMADO">Não informado</option>
              </select>
            </label>
            <Input label="Telefone" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
          </FormSection>
          <FormSection title="Contato e convênio">
            <Input label="E-mail" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
            <Input label="Endereço" value={form.address} onChange={(value) => setForm((current) => ({ ...current, address: value }))} />
            <Input label="Convênio" value={form.insuranceProvider} onChange={(value) => setForm((current) => ({ ...current, insuranceProvider: value }))} />
            <Input label="Número do convênio" value={form.insuranceNumber} onChange={(value) => setForm((current) => ({ ...current, insuranceNumber: value }))} />
          </FormSection>
          <FormSection title="Informações clínicas">
            <Input label="Alergias" value={form.allergies} onChange={(value) => setForm((current) => ({ ...current, allergies: value }))} />
            <Input label="Histórico familiar" value={form.familyHistory} onChange={(value) => setForm((current) => ({ ...current, familyHistory: value }))} />
          </FormSection>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={closeForm}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar paciente</Button>
          </div>
        </div>
      </Modal>

      <Modal open={Boolean(selectedPatient && !open)} title="Detalhes do paciente" onClose={() => setSelectedPatient(null)}>
        {selectedPatient ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
              <Avatar name={selectedPatient.fullName} size="lg" />
              <div>
                <h2 className="text-lg font-extrabold text-slate-950">{selectedPatient.fullName}</h2>
                <p className="text-sm font-semibold text-muted">{selectedPatient.cpf} • {selectedPatient.phone}</p>
                <StatusBadge status={selectedPatient.status} />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Info label="Convênio" value={`${selectedPatient.insuranceProvider} • ${selectedPatient.insuranceNumber}`} />
              <Info label="E-mail" value={selectedPatient.email} />
              <Info label="Endereço" value={selectedPatient.address} />
              <Info label="Alergias" value={selectedPatient.allergies} />
              <Info label="Histórico familiar" value={selectedPatient.familyHistory} />
              <Info label="Observações" value={selectedPatient.observations} />
            </div>
          </div>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(patientToInactivate)}
        title="Inativar paciente"
        description={`O paciente ${patientToInactivate?.fullName ?? ''} será inativado, mas o histórico clínico será preservado para auditoria.`}
        onCancel={() => setPatientToInactivate(null)}
        onConfirm={confirmInactivation}
      />
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">{label}</span>
      <input value={value} type={type} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100" />
    </label>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{value}</p>
    </div>
  );
}
