package com.portfolio.healthcare.config;

import com.portfolio.healthcare.entity.Appointment;
import com.portfolio.healthcare.entity.Doctor;
import com.portfolio.healthcare.entity.Exam;
import com.portfolio.healthcare.entity.Hospitalization;
import com.portfolio.healthcare.entity.MedicalRecord;
import com.portfolio.healthcare.entity.MedicalRecordEntry;
import com.portfolio.healthcare.entity.Medicine;
import com.portfolio.healthcare.entity.Notification;
import com.portfolio.healthcare.entity.Patient;
import com.portfolio.healthcare.entity.Payment;
import com.portfolio.healthcare.entity.Prescription;
import com.portfolio.healthcare.entity.Role;
import com.portfolio.healthcare.entity.User;
import com.portfolio.healthcare.entity.enums.AppointmentStatus;
import com.portfolio.healthcare.entity.enums.EntityStatus;
import com.portfolio.healthcare.entity.enums.ExamStatus;
import com.portfolio.healthcare.entity.enums.Gender;
import com.portfolio.healthcare.entity.enums.HospitalizationStatus;
import com.portfolio.healthcare.entity.enums.MedicineStatus;
import com.portfolio.healthcare.entity.enums.PaymentMethod;
import com.portfolio.healthcare.entity.enums.PaymentStatus;
import com.portfolio.healthcare.entity.enums.RoleName;
import com.portfolio.healthcare.entity.enums.ServiceType;
import com.portfolio.healthcare.repository.AppointmentRepository;
import com.portfolio.healthcare.repository.DoctorRepository;
import com.portfolio.healthcare.repository.ExamRepository;
import com.portfolio.healthcare.repository.HospitalizationRepository;
import com.portfolio.healthcare.repository.MedicalRecordRepository;
import com.portfolio.healthcare.repository.MedicineRepository;
import com.portfolio.healthcare.repository.NotificationRepository;
import com.portfolio.healthcare.repository.PatientRepository;
import com.portfolio.healthcare.repository.PaymentRepository;
import com.portfolio.healthcare.repository.RoleRepository;
import com.portfolio.healthcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@Profile("!test")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final ExamRepository examRepository;
    private final HospitalizationRepository hospitalizationRepository;
    private final PaymentRepository paymentRepository;
    private final MedicineRepository medicineRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        Role adminRole = roleRepository.save(new Role(RoleName.ADMIN));
        Role doctorRole = roleRepository.save(new Role(RoleName.MEDICO));
        Role receptionRole = roleRepository.save(new Role(RoleName.RECEPCAO));
        Role financeRole = roleRepository.save(new Role(RoleName.FINANCEIRO));

        User admin = createUser("Dr. Joao Silva", "admin@healthcare.com", "Administrador", Set.of(adminRole, doctorRole, receptionRole, financeRole));
        createUser("Dra. Ana Costa", "medico@healthcare.com", "Medica Cardiologista", Set.of(doctorRole));
        createUser("Camila Rocha", "recepcao@healthcare.com", "Recepcao", Set.of(receptionRole));
        createUser("Bruno Martins", "financeiro@healthcare.com", "Analista Financeiro", Set.of(financeRole));

        List<Doctor> doctors = seedDoctors();
        List<Patient> patients = seedPatients();
        seedAppointments(doctors, patients);
        seedMedicalRecords(doctors, patients);
        seedExams(doctors, patients);
        seedHospitalizations(doctors, patients);
        seedPayments(patients);
        seedMedicines();
        seedNotifications(admin);
    }

    private User createUser(String name, String email, String position, Set<Role> roles) {
        User user = new User(name, email, passwordEncoder.encode("123456"), position, "https://ui-avatars.com/api/?name=" + name.replace(" ", "+") + "&background=2563EB&color=fff");
        user.getRoles().addAll(roles);
        return userRepository.save(user);
    }

    private List<Doctor> seedDoctors() {
        List<Doctor> doctors = new ArrayList<>();
        doctors.add(doctor("Dr. Joao Silva", "CRM-SP 102030", "Clinico Geral", "08:00 - 17:00"));
        doctors.add(doctor("Dra. Ana Costa", "CRM-SP 203040", "Cardiologia", "09:00 - 18:00"));
        doctors.add(doctor("Dr. Pedro Santos", "CRM-SP 304050", "Ortopedia", "07:00 - 16:00"));
        doctors.add(doctor("Dra. Marina Lima", "CRM-SP 405060", "Pediatria", "10:00 - 19:00"));
        doctors.add(doctor("Dr. Lucas Moreira", "CRM-SP 506070", "Neurologia", "08:00 - 14:00"));
        doctors.add(doctor("Dra. Beatriz Almeida", "CRM-SP 607080", "Dermatologia", "13:00 - 20:00"));
        return doctorRepository.saveAll(doctors);
    }

    private Doctor doctor(String name, String crm, String specialty, String hours) {
        Doctor doctor = new Doctor();
        doctor.setName(name);
        doctor.setCrm(crm);
        doctor.setSpecialty(specialty);
        doctor.setOfficeHours(hours);
        doctor.setEmail(name.toLowerCase().replace("dra. ", "").replace("dr. ", "").replace(" ", ".") + "@healthcare.com");
        doctor.setPhone("(11) 9" + crm.replaceAll("\\D", "").substring(0, 4) + "-0000");
        doctor.setAvatarUrl("https://ui-avatars.com/api/?name=" + name.replace(" ", "+") + "&background=071B3A&color=fff");
        doctor.setStatus(EntityStatus.ATIVO);
        return doctor;
    }

    private List<Patient> seedPatients() {
        List<Patient> patients = List.of(
                patient("Maria Oliveira Santos", "123.456.789-01", LocalDate.of(1986, 4, 12), Gender.FEMININO, "Unimed", "Alergia a dipirona"),
                patient("Jose Santos Silva", "234.567.890-12", LocalDate.of(1978, 8, 23), Gender.MASCULINO, "Bradesco Saude", "Hipertensao familiar"),
                patient("Ana Pereira Lima", "345.678.901-23", LocalDate.of(1992, 1, 5), Gender.FEMININO, "SulAmerica", "Sem alergias conhecidas"),
                patient("Carlos Lima Costa", "456.789.012-34", LocalDate.of(1969, 11, 18), Gender.MASCULINO, "Amil", "Diabetes tipo 2 na familia"),
                patient("Juliana Costa Silva", "567.890.123-45", LocalDate.of(2001, 7, 29), Gender.FEMININO, "NotreDame", "Alergia a penicilina"),
                patient("Roberto Almeida", "678.901.234-56", LocalDate.of(1959, 3, 8), Gender.MASCULINO, "Particular", "Cardiopatia familiar"),
                patient("Fernanda Souza", "789.012.345-67", LocalDate.of(1988, 9, 14), Gender.FEMININO, "Porto Seguro", "Rinite alergica"),
                patient("Gustavo Silva", "890.123.456-78", LocalDate.of(1995, 12, 3), Gender.MASCULINO, "Unimed", "Sem observacoes"),
                patient("Amanda Santos", "901.234.567-89", LocalDate.of(2010, 2, 21), Gender.FEMININO, "Amil", "Alergia alimentar"),
                patient("Enzo Gabriel", "012.345.678-90", LocalDate.of(2018, 5, 30), Gender.MASCULINO, "SulAmerica", "Asma leve")
        );
        return patientRepository.saveAll(patients);
    }

    private Patient patient(String name, String cpf, LocalDate birthDate, Gender gender, String insurance, String note) {
        Patient patient = new Patient();
        patient.setFullName(name);
        patient.setCpf(cpf);
        patient.setRg("MG-" + cpf.substring(0, 3) + "." + cpf.substring(4, 7));
        patient.setBirthDate(birthDate);
        patient.setGender(gender);
        patient.setPhone("(11) 9" + cpf.replaceAll("\\D", "").substring(0, 4) + "-1122");
        patient.setEmail(name.toLowerCase().replace(" ", ".") + "@email.com");
        patient.setAddress("Rua das Flores, " + cpf.replaceAll("\\D", "").substring(0, 3) + " - Sao Paulo/SP");
        patient.setInsuranceProvider(insurance);
        patient.setInsuranceNumber("HC-" + cpf.replaceAll("\\D", "").substring(0, 6));
        patient.setAllergies(note);
        patient.setFamilyHistory("Historico familiar revisado em triagem.");
        patient.setObservations("Paciente acompanhado pela equipe multidisciplinar HealthCare.");
        patient.setStatus(EntityStatus.ATIVO);
        return patient;
    }

    private void seedAppointments(List<Doctor> doctors, List<Patient> patients) {
        LocalDate today = LocalDate.now();
        List<Appointment> appointments = new ArrayList<>();
        for (int i = 0; i < 16; i++) {
            Doctor doctor = doctors.get(i % doctors.size());
            Patient patient = patients.get(i % patients.size());
            Appointment appointment = new Appointment();
            appointment.setDoctor(doctor);
            appointment.setPatient(patient);
            appointment.setSpecialty(doctor.getSpecialty());
            appointment.setStartAt(LocalDateTime.of(today.plusDays(i % 5), LocalTime.of(8 + (i % 8), (i % 2) * 30)));
            appointment.setDurationMinutes(i % 3 == 0 ? 45 : 30);
            appointment.setStatus(i % 4 == 0 ? AppointmentStatus.CONFIRMADA : AppointmentStatus.AGENDADA);
            appointment.setObservations("Consulta de acompanhamento com foco em cuidado preventivo.");
            appointments.add(appointment);
        }
        for (int i = 1; i <= 7; i++) {
            Appointment done = new Appointment();
            Doctor doctor = doctors.get(i % doctors.size());
            done.setDoctor(doctor);
            done.setPatient(patients.get((i + 2) % patients.size()));
            done.setSpecialty(doctor.getSpecialty());
            done.setStartAt(LocalDateTime.of(today.minusDays(i), LocalTime.of(9 + (i % 6), 0)));
            done.setDurationMinutes(30);
            done.setStatus(AppointmentStatus.CONCLUIDA);
            done.setObservations("Consulta concluida e registrada no prontuario.");
            appointments.add(done);
        }
        appointmentRepository.saveAll(appointments);
    }

    private void seedMedicalRecords(List<Doctor> doctors, List<Patient> patients) {
        for (int i = 0; i < 5; i++) {
            MedicalRecord record = new MedicalRecord();
            record.setPatient(patients.get(i));
            record.setSummary("Paciente em acompanhamento regular, sinais vitais estaveis e plano terapeutico ativo.");
            record.setCurrentMedications(i % 2 == 0 ? "Losartana 50mg, 1x ao dia" : "Vitamina D 2000UI, 1x ao dia");
            record.setMedicalNotes("Manter acompanhamento trimestral e revisar exames recentes.");

            MedicalRecordEntry entry = new MedicalRecordEntry();
            entry.setMedicalRecord(record);
            entry.setDoctor(doctors.get(i % doctors.size()));
            entry.setOccurredAt(LocalDateTime.now().minusDays(i + 1));
            entry.setTitle("Evolucao clinica");
            entry.setDescription("Paciente relata melhora dos sintomas e boa adesao ao tratamento.");
            record.getEntries().add(entry);

            Prescription prescription = new Prescription();
            prescription.setMedicalRecord(record);
            prescription.setDoctor(doctors.get(i % doctors.size()));
            prescription.setMedication(i % 2 == 0 ? "Losartana" : "Ibuprofeno");
            prescription.setDosage(i % 2 == 0 ? "50mg" : "400mg");
            prescription.setFrequency(i % 2 == 0 ? "1 vez ao dia" : "A cada 8 horas se dor");
            prescription.setDuration(i % 2 == 0 ? "90 dias" : "5 dias");
            prescription.setObservations("Reavaliar em retorno.");
            record.getPrescriptions().add(prescription);

            medicalRecordRepository.save(record);
        }
    }

    private void seedExams(List<Doctor> doctors, List<Patient> patients) {
        String[] types = {"Hemograma Completo", "Raio-X Torax", "Eletrocardiograma", "Ultrassonografia", "Ressonancia Magnetica", "Tomografia", "Exame de Urina", "Glicemia"};
        List<Exam> exams = new ArrayList<>();
        for (int i = 0; i < types.length; i++) {
            Exam exam = new Exam();
            exam.setPatient(patients.get(i % patients.size()));
            exam.setRequestingDoctor(doctors.get(i % doctors.size()));
            exam.setExamType(types[i]);
            exam.setRequestedAt(LocalDate.now().minusDays(i));
            exam.setPerformedAt(i % 3 == 0 ? LocalDate.now().minusDays(i - 1L) : null);
            exam.setStatus(i % 4 == 0 ? ExamStatus.CONCLUIDO : (i % 3 == 0 ? ExamStatus.EM_ANALISE : ExamStatus.AGENDADO));
            exam.setResult(i % 4 == 0 ? "Resultado dentro dos parametros esperados." : null);
            exam.setObservations("Prioridade clinica padrao.");
            exams.add(exam);
        }
        examRepository.saveAll(exams);
    }

    private void seedHospitalizations(List<Doctor> doctors, List<Patient> patients) {
        List<Hospitalization> hospitalizations = new ArrayList<>();
        for (int i = 0; i < 4; i++) {
            Hospitalization hospitalization = new Hospitalization();
            hospitalization.setPatient(patients.get(i + 3));
            hospitalization.setResponsibleDoctor(doctors.get(i % doctors.size()));
            hospitalization.setRoom("30" + (i + 1));
            hospitalization.setBed("L" + (i + 1));
            hospitalization.setEntryDate(LocalDate.now().minusDays(i + 1));
            hospitalization.setExpectedDischargeDate(LocalDate.now().plusDays(3 + i));
            hospitalization.setReason(i % 2 == 0 ? "Observacao clinica pos-procedimento" : "Monitoramento cardiologico");
            hospitalization.setStatus(i == 3 ? HospitalizationStatus.ALTA_MEDICA : HospitalizationStatus.ATIVA);
            hospitalization.setObservations("Paciente em acompanhamento de enfermagem.");
            hospitalizations.add(hospitalization);
        }
        hospitalizationRepository.saveAll(hospitalizations);
    }

    private void seedPayments(List<Patient> patients) {
        YearMonth current = YearMonth.now();
        List<Payment> payments = new ArrayList<>();
        for (int monthIndex = 0; monthIndex < 6; monthIndex++) {
            YearMonth month = current.minusMonths(monthIndex);
            for (int i = 0; i < 4; i++) {
                Payment payment = new Payment();
                payment.setPatient(patients.get((i + monthIndex) % patients.size()));
                payment.setServiceType(i % 3 == 0 ? ServiceType.INTERNACAO : (i % 2 == 0 ? ServiceType.EXAME : ServiceType.CONSULTA));
                payment.setAmount(BigDecimal.valueOf(250 + (i * 180L) + (monthIndex * 90L)));
                payment.setStatus(i == 3 && monthIndex == 0 ? PaymentStatus.PENDENTE : PaymentStatus.PAGO);
                payment.setMethod(i % 2 == 0 ? PaymentMethod.CONVENIO : PaymentMethod.PIX);
                payment.setDueDate(month.atDay(Math.min(25, 5 + i * 4)));
                payment.setPaymentDate(payment.getStatus() == PaymentStatus.PAGO ? payment.getDueDate().minusDays(1) : null);
                payments.add(payment);
            }
        }
        Payment overdue = new Payment();
        overdue.setPatient(patients.get(0));
        overdue.setServiceType(ServiceType.EXAME);
        overdue.setAmount(BigDecimal.valueOf(480));
        overdue.setStatus(PaymentStatus.ATRASADO);
        overdue.setMethod(PaymentMethod.CARTAO_CREDITO);
        overdue.setDueDate(LocalDate.now().minusDays(10));
        payments.add(overdue);
        paymentRepository.saveAll(payments);
    }

    private void seedMedicines() {
        List<Medicine> medicines = new ArrayList<>();
        medicines.add(medicine("Dipirona Sodica", "Dipirona", "Medley", "DIP-2026-A", LocalDate.now().plusMonths(12), 180, 40));
        medicines.add(medicine("Amoxicilina", "Amoxicilina", "EMS", "AMX-2026-B", LocalDate.now().plusMonths(8), 75, 30));
        medicines.add(medicine("Losartana Potassica", "Losartana", "Neo Quimica", "LOS-2026-C", LocalDate.now().plusMonths(15), 120, 35));
        medicines.add(medicine("Omeprazol", "Omeprazol", "Eurofarma", "OME-2026-D", LocalDate.now().plusDays(35), 48, 50));
        medicines.add(medicine("Soro Fisiologico", "Cloreto de sodio", "Halex", "SOR-2026-E", LocalDate.now().plusMonths(10), 220, 80));
        medicineRepository.saveAll(medicines);
    }

    private Medicine medicine(String name, String ingredient, String manufacturer, String batch, LocalDate expiration, int stock, int minimum) {
        Medicine medicine = new Medicine();
        medicine.setName(name);
        medicine.setActiveIngredient(ingredient);
        medicine.setManufacturer(manufacturer);
        medicine.setBatch(batch);
        medicine.setExpirationDate(expiration);
        medicine.setQuantityInStock(stock);
        medicine.setMinimumStock(minimum);
        medicine.setStatus(stock <= minimum ? MedicineStatus.ESTOQUE_BAIXO : MedicineStatus.DISPONIVEL);
        return medicine;
    }

    private void seedNotifications(User admin) {
        Notification notification = new Notification();
        notification.setUser(admin);
        notification.setTitle("Plantao atualizado");
        notification.setMessage("Agenda medica do dia carregada com sucesso.");
        notification.setType("INFO");
        notificationRepository.save(notification);
    }
}
