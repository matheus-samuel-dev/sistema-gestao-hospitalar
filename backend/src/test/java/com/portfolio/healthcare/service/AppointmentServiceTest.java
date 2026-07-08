package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.AppointmentDtos.AppointmentRequest;
import com.portfolio.healthcare.entity.Appointment;
import com.portfolio.healthcare.entity.Doctor;
import com.portfolio.healthcare.entity.Patient;
import com.portfolio.healthcare.entity.enums.AppointmentStatus;
import com.portfolio.healthcare.entity.enums.Gender;
import com.portfolio.healthcare.exception.BusinessException;
import com.portfolio.healthcare.mapper.AppointmentMapper;
import com.portfolio.healthcare.repository.AppointmentRepository;
import com.portfolio.healthcare.repository.DoctorRepository;
import com.portfolio.healthcare.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    AppointmentRepository appointmentRepository;

    @Mock
    PatientRepository patientRepository;

    @Mock
    DoctorRepository doctorRepository;

    @Spy
    AppointmentMapper appointmentMapper;

    @Mock
    AuditService auditService;

    @InjectMocks
    AppointmentService appointmentService;

    UUID patientId;
    UUID doctorId;
    Patient patient;
    Doctor doctor;

    @BeforeEach
    void setUp() {
        patientId = UUID.randomUUID();
        doctorId = UUID.randomUUID();

        patient = new Patient();
        patient.setId(patientId);
        patient.setFullName("Maria Oliveira Santos");
        patient.setBirthDate(LocalDate.of(1986, 4, 12));
        patient.setGender(Gender.FEMININO);
        patient.setPhone("(11) 99999-0000");

        doctor = new Doctor();
        doctor.setId(doctorId);
        doctor.setName("Dr. Joao Silva");
        doctor.setSpecialty("Clinico Geral");
    }

    @Test
    void shouldCreateAppointment() {
        LocalDateTime startAt = LocalDateTime.now().plusDays(1).withHour(10).withMinute(0);
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(doctorRepository.findById(doctorId)).thenReturn(Optional.of(doctor));
        when(appointmentRepository.findByDoctor_IdAndStatusNotAndStartAtBetween(
                org.mockito.ArgumentMatchers.eq(doctorId),
                org.mockito.ArgumentMatchers.eq(AppointmentStatus.CANCELADA),
                any(LocalDateTime.class),
                any(LocalDateTime.class)
        )).thenReturn(List.of());
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = appointmentService.create(new AppointmentRequest(patientId, doctorId, startAt, 30, "Retorno"));

        assertThat(response.patientName()).isEqualTo("Maria Oliveira Santos");
        assertThat(response.doctorName()).isEqualTo("Dr. Joao Silva");
        assertThat(response.status()).isEqualTo(AppointmentStatus.AGENDADA);
    }

    @Test
    void shouldRejectDoctorScheduleConflict() {
        LocalDateTime startAt = LocalDateTime.now().plusDays(1).withHour(10).withMinute(0);
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(doctorRepository.findById(doctorId)).thenReturn(Optional.of(doctor));
        Appointment existing = new Appointment();
        existing.setId(UUID.randomUUID());
        existing.setDoctor(doctor);
        existing.setPatient(patient);
        existing.setStartAt(startAt.plusMinutes(15));
        existing.setDurationMinutes(30);
        existing.setStatus(AppointmentStatus.AGENDADA);
        when(appointmentRepository.findByDoctor_IdAndStatusNotAndStartAtBetween(
                org.mockito.ArgumentMatchers.eq(doctorId),
                org.mockito.ArgumentMatchers.eq(AppointmentStatus.CANCELADA),
                any(LocalDateTime.class),
                any(LocalDateTime.class)
        )).thenReturn(List.of(existing));

        assertThatThrownBy(() -> appointmentService.create(new AppointmentRequest(patientId, doctorId, startAt, 30, null)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("horario");
    }

    @Test
    void shouldRejectPastAppointment() {
        LocalDateTime startAt = LocalDateTime.now().minusDays(1);

        assertThatThrownBy(() -> appointmentService.create(new AppointmentRequest(patientId, doctorId, startAt, 30, null)))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("passado");
    }
}
