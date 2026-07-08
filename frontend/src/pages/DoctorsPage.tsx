import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, Edit3, Plus, Stethoscope, UserRoundCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { doctors as initialDoctors } from '../data/mockData';
import { Doctor } from '../types/healthcare';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { ChartCard } from '../components/ui/ChartCard';
import { Column, DataTable } from '../components/ui/DataTable';
import { FormSection } from '../components/ui/FormSection';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { SearchInput } from '../components/ui/SearchInput';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useHospitalWorkspace } from '../hooks/useHospitalWorkspace';
import { doctorMatchesFilters } from '../utils/hospitalFilters';
import { normalizeText } from '../utils/healthcareFormat';

const specialties = ['Clínico Geral', 'Cardiologia', 'Dermatologia', 'Ortopedia', 'Pediatria', 'Neurologia', 'Ginecologia', 'Oftalmologia'];

type DoctorForm = Pick<Doctor, 'name' | 'crm' | 'specialty' | 'officeHours' | 'phone' | 'email' | 'status'>;

const emptyForm: DoctorForm = {
  name: 'Dra. Beatriz Almeida',
  crm: 'CRM-SP 607080',
  specialty: 'Dermatologia',
  officeHours: '13:00 - 20:00',
  phone: '(11) 99777-0808',
  email: 'beatriz.almeida@healthcare.com',
  status: 'ATIVO'
};

export function DoctorsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [doctors, setDoctors] = useState(initialDoctors);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<DoctorForm>(emptyForm);
  const { filters, updateFilter } = useHospitalWorkspace();

  const filteredDoctors = useMemo(() => {
    const term = normalizeText(search);
    return doctors.filter((doctor) => {
      const matchesSearch = [doctor.name, doctor.crm, doctor.specialty, doctor.email].some((value) => normalizeText(value).includes(term));
      return matchesSearch && doctorMatchesFilters(doctor, filters);
    });
  }, [doctors, filters, search]);

  function openCreateModal() {
    setMode('create');
    setSelectedDoctor(null);
    setForm(emptyForm);
    setOpen(true);
  }

  function openEditModal(doctor: Doctor) {
    setMode('edit');
    setSelectedDoctor(doctor);
    setForm({
      name: doctor.name,
      crm: doctor.crm,
      specialty: doctor.specialty,
      officeHours: doctor.officeHours,
      phone: doctor.phone,
      email: doctor.email,
      status: doctor.status
    });
    setOpen(true);
  }

  function handleSave() {
    if (form.name.trim().length < 3) {
      toast.error('Informe o nome completo do médico.');
      return;
    }

    if (!form.crm.trim().startsWith('CRM-')) {
      toast.error('Informe um CRM válido no formato CRM-UF 000000.');
      return;
    }

    if (!form.specialty.trim()) {
      toast.error('Médico deve ter especialidade definida.');
      return;
    }

    if (mode === 'edit' && selectedDoctor) {
      setDoctors((current) => current.map((doctor) => (doctor.id === selectedDoctor.id ? { ...doctor, ...form } : doctor)));
      toast.success('Médico atualizado com sucesso.');
    } else {
      const created: Doctor = {
        id: `doctor-${Date.now()}`,
        ...form,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=2563EB&color=fff`
      };
      setDoctors((current) => [created, ...current]);
      toast.success('Médico cadastrado com sucesso.');
    }

    setOpen(false);
    setSelectedDoctor(null);
  }

  const columns: Column<Doctor>[] = [
    {
      header: 'Médico',
      accessor: (doctor) => (
        <div className="flex items-center gap-3">
          <Avatar name={doctor.name} src={doctor.avatarUrl} size="sm" />
          <div>
            <p className="font-bold text-slate-900">{doctor.name}</p>
            <p className="text-xs font-semibold text-muted">{doctor.email}</p>
          </div>
        </div>
      )
    },
    { header: 'CRM', accessor: (doctor) => <span className="font-semibold">{doctor.crm}</span> },
    { header: 'Especialidade', accessor: (doctor) => doctor.specialty },
    { header: 'Horário', accessor: (doctor) => doctor.officeHours },
    { header: 'Status', accessor: (doctor) => <StatusBadge status={doctor.status} /> },
    {
      header: 'Ações',
      accessor: (doctor) => (
        <div className="flex items-center gap-2">
          <button
            className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-primary"
            title="Agenda"
            aria-label={`Abrir agenda de ${doctor.name}`}
            onClick={() => {
              updateFilter('doctorId', doctor.id);
              navigate('/agenda');
            }}
          >
            <CalendarClock size={16} />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-500" title="Editar" aria-label={`Editar ${doctor.name}`} onClick={() => openEditModal(doctor)}>
            <Edit3 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Médicos"
        subtitle="Equipe médica, especialidades, CRM e disponibilidade"
        actions={<Button icon={UserRoundCheck} onClick={openCreateModal}>Novo médico</Button>}
      />

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <SearchInput value={search} onChange={setSearch} placeholder="Buscar por nome, CRM ou especialidade..." label="Buscar médicos" />
          <DataTable columns={columns} data={filteredDoctors} emptyMessage="Nenhum médico encontrado para os filtros atuais." />
        </div>

        <ChartCard title="Especialidades clínicas" subtitle="Catálogo ativo da equipe">
          <div className="grid gap-3">
            {specialties.map((specialty, index) => (
              <button
                key={specialty}
                className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-left transition hover:bg-blue-50"
                onClick={() => updateFilter('specialty', specialty)}
              >
                <span className="flex items-center gap-3 text-sm font-bold text-slate-700">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-primary shadow-sm">
                    <Stethoscope size={17} />
                  </span>
                  {specialty}
                </span>
                <strong className="text-sm text-muted">{index < 4 ? 'Ativo' : 'Banco'}</strong>
              </button>
            ))}
          </div>
        </ChartCard>
      </section>

      <Modal open={open} title={mode === 'edit' ? 'Editar médico' : 'Cadastrar médico'} onClose={() => setOpen(false)}>
        <div className="space-y-5">
          <FormSection title="Dados profissionais">
            <Input label="Nome" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} />
            <Input label="CRM" value={form.crm} onChange={(value) => setForm((current) => ({ ...current, crm: value }))} />
            <Input label="Especialidade" value={form.specialty} onChange={(value) => setForm((current) => ({ ...current, specialty: value }))} />
            <Input label="Horário de atendimento" value={form.officeHours} onChange={(value) => setForm((current) => ({ ...current, officeHours: value }))} />
            <Input label="Telefone" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} />
            <Input label="E-mail" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
          </FormSection>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar médico</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100" />
    </label>
  );
}
