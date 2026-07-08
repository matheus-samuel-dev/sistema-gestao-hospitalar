import { useState } from 'react';
import { Edit3, FileText, MoreHorizontal, Pill, Plus, ShieldAlert, Stethoscope, TestTube2, UserRound } from 'lucide-react';
import toast from 'react-hot-toast';
import { appointments, exams, patients, record } from '../data/mockData';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { ChartCard } from '../components/ui/ChartCard';
import { cn } from '../components/ui/cn';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MedicalRecordEntry } from '../types/healthcare';
import { formatDateTime } from '../utils/healthcareFormat';

const tabs = ['Resumo', 'Histórico', 'Consultas', 'Exames', 'Prescrições', 'Documentos'];

export function MedicalRecordsPage() {
  const [activeTab, setActiveTab] = useState('Resumo');
  const [entries, setEntries] = useState(record.entries);
  const [openEvolution, setOpenEvolution] = useState(false);
  const [evolution, setEvolution] = useState({ title: 'Evolução clínica', description: 'Paciente avaliado, sinais vitais estáveis e conduta registrada.' });
  const selectedPatient = patients[0];

  function saveEvolution() {
    if (evolution.title.trim().length < 3 || evolution.description.trim().length < 12) {
      toast.error('Informe título e descrição clínica completos.');
      return;
    }

    const created: MedicalRecordEntry = {
      id: `entry-${Date.now()}`,
      doctorId: record.entries[0]?.doctorId,
      doctorName: record.entries[0]?.doctorName ?? 'Equipe clínica',
      occurredAt: new Date().toISOString(),
      title: evolution.title.trim(),
      description: evolution.description.trim()
    };

    setEntries((current) => [created, ...current]);
    setActiveTab('Histórico');
    setOpenEvolution(false);
    toast.success('Evolução registrada no prontuário.');
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Prontuário Eletrônico"
        subtitle="Visão integrada do paciente, histórico clínico e prescrições"
        actions={<Button icon={Plus} onClick={() => setOpenEvolution(true)}>Nova evolução</Button>}
      />

      <section className="overflow-hidden rounded-[1.6rem] border border-white/80 bg-white shadow-card">
        <div className="bg-navy p-6 text-white">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <Avatar name={selectedPatient.fullName} size="xl" className="ring-4 ring-white/20" />
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-bold text-blue-100">ID {selectedPatient.id.toUpperCase()}</span>
                  <StatusBadge status={selectedPatient.status} />
                </div>
                <h2 className="text-3xl font-extrabold">{selectedPatient.fullName}</h2>
                <p className="mt-2 text-sm font-semibold text-blue-100">
                  {selectedPatient.age} anos - {selectedPatient.gender.replace('_', ' ')} - nascimento {selectedPatient.birthDate}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                icon={Edit3}
                variant="secondary"
                className="border-white/20 bg-white/10 text-white hover:bg-white hover:text-primary"
                onClick={() => toast.success('Dados cadastrais do paciente prontos para edição no módulo Pacientes.')}
              >
                Editar
              </Button>
              <button
                className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white"
                title="Mais opções"
                aria-label="Mais opções do prontuário"
                onClick={() => toast.success('Menu de documentos, auditoria e impressão preparado para integração.')}
              >
                <MoreHorizontal size={20} />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <InfoTile label="Telefone" value={selectedPatient.phone} />
            <InfoTile label="E-mail" value={selectedPatient.email} />
            <InfoTile label="Convênio" value={`${selectedPatient.insuranceProvider} - ${selectedPatient.insuranceNumber}`} />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-b border-slate-100 px-5 py-3">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn('h-10 rounded-xl px-4 text-sm font-extrabold transition', activeTab === tab ? 'bg-primary text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900')}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'Resumo' && <SummaryTab />}
          {activeTab === 'Histórico' && <HistoryTab entries={entries} />}
          {activeTab === 'Consultas' && <ConsultationsTab />}
          {activeTab === 'Exames' && <ExamsTab />}
          {activeTab === 'Prescrições' && <PrescriptionsTab />}
          {activeTab === 'Documentos' && <DocumentsTab />}
        </div>
      </section>

      <Modal open={openEvolution} title="Nova evolução clínica" onClose={() => setOpenEvolution(false)}>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">Título</span>
            <input value={evolution.title} onChange={(event) => setEvolution((current) => ({ ...current, title: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">Descrição clínica</span>
            <textarea value={evolution.description} onChange={(event) => setEvolution((current) => ({ ...current, description: event.target.value }))} className="min-h-32 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-4 focus:ring-blue-100" />
          </label>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpenEvolution(false)}>Cancelar</Button>
            <Button onClick={saveEvolution}>Registrar evolução</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-blue-200">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-white">{value}</p>
    </div>
  );
}

function SummaryTab() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <ChartCard title="Resumo clínico">
          <p className="text-sm font-medium leading-7 text-slate-600">{record.summary}</p>
        </ChartCard>
        <div className="grid gap-5 md:grid-cols-2">
          <AlertCard icon={ShieldAlert} title="Alergias" text={record.allergies} tone="red" />
          <AlertCard icon={UserRound} title="Histórico familiar" text={record.familyHistory} tone="blue" />
        </div>
        <ChartCard title="Observações médicas">
          <p className="text-sm font-medium leading-7 text-slate-600">{record.medicalNotes}</p>
        </ChartCard>
      </div>

      <div className="space-y-5">
        <ChartCard title="Medicamentos em uso">
          <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-800">{record.currentMedications}</div>
        </ChartCard>
        <ChartCard title="Últimas consultas">
          <div className="space-y-3">
            {appointments.slice(0, 3).map((appointment) => (
              <div key={appointment.id} className="rounded-2xl bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-900">{appointment.doctorName}</p>
                <p className="text-xs font-semibold text-muted">{appointment.specialty} - {appointment.startAt.slice(0, 10)}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function AlertCard({ icon: Icon, title, text, tone }: { icon: typeof ShieldAlert; title: string; text: string; tone: 'red' | 'blue' }) {
  return (
    <div className={cn('rounded-[1.3rem] p-5', tone === 'red' ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800')}>
      <div className="mb-3 flex items-center gap-3">
        <Icon size={20} />
        <h3 className="text-sm font-extrabold">{title}</h3>
      </div>
      <p className="text-sm font-semibold leading-6">{text}</p>
    </div>
  );
}

function HistoryTab({ entries }: { entries: MedicalRecordEntry[] }) {
  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div key={entry.id} className="relative flex gap-4 rounded-[1.3rem] bg-slate-50 p-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary text-white">
            <Stethoscope size={20} />
          </div>
          {index < entries.length - 1 ? <span className="absolute left-[37px] top-16 h-10 w-px bg-blue-100" /> : null}
          <div>
            <p className="text-sm font-extrabold text-slate-950">{entry.title}</p>
            <p className="mt-1 text-xs font-bold text-primary">{entry.doctorName} • {formatDateTime(entry.occurredAt)}</p>
            <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{entry.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ConsultationsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {appointments.slice(0, 4).map((appointment) => (
        <div key={appointment.id} className="rounded-[1.3rem] border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-extrabold text-slate-950">{appointment.specialty}</h3>
            <StatusBadge status={appointment.status} />
          </div>
          <p className="mt-2 text-sm font-semibold text-muted">{appointment.doctorName}</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">{new Date(appointment.startAt).toLocaleString('pt-BR')}</p>
        </div>
      ))}
    </div>
  );
}

function ExamsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {exams.slice(0, 4).map((exam) => (
        <div key={exam.id} className="rounded-[1.3rem] border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-primary">
              <TestTube2 size={19} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-950">{exam.examType}</h3>
              <p className="text-xs font-semibold text-muted">Solicitado por {exam.doctorName}</p>
            </div>
          </div>
          <div className="mt-4">
            <StatusBadge status={exam.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PrescriptionsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {record.prescriptions.map((prescription) => (
        <div key={prescription.id} className="rounded-[1.3rem] border border-slate-100 bg-slate-50 p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-success">
              <Pill size={19} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-950">{prescription.medication}</h3>
              <p className="text-xs font-semibold text-muted">{prescription.doctorName}</p>
            </div>
          </div>
          <div className="grid gap-2 text-sm font-semibold text-slate-700">
            <p>Dosagem: {prescription.dosage}</p>
            <p>Frequência: {prescription.frequency}</p>
            <p>Duração: {prescription.duration}</p>
            <p className="text-muted">{prescription.observations}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentsTab() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {['Termo de consentimento', 'Atestado médico', 'Relatório de alta'].map((document) => (
        <div key={document} className="rounded-[1.3rem] border border-slate-100 bg-slate-50 p-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-primary">
            <FileText size={22} />
          </div>
          <h3 className="mt-4 text-sm font-extrabold text-slate-950">{document}</h3>
          <p className="mt-1 text-xs font-semibold text-muted">PDF anexado ao prontuário</p>
        </div>
      ))}
    </div>
  );
}
