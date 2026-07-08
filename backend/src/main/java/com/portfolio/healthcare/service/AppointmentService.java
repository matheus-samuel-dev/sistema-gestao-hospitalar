package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.AppointmentDtos.AppointmentRequest;
import com.portfolio.healthcare.dto.AppointmentDtos.AppointmentResponse;
import com.portfolio.healthcare.entity.Appointment;
import com.portfolio.healthcare.entity.enums.AppointmentStatus;
import com.portfolio.healthcare.exception.BusinessException;
import com.portfolio.healthcare.exception.ResourceNotFoundException;
import com.portfolio.healthcare.mapper.AppointmentMapper;
import com.portfolio.healthcare.repository.AppointmentRepository;
import com.portfolio.healthcare.repository.DoctorRepository;
import com.portfolio.healthcare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentMapper appointmentMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<AppointmentResponse> list(LocalDate start, LocalDate end) {
        LocalDate firstDay = start == null ? LocalDate.now() : start;
        LocalDate lastDay = end == null ? firstDay.plusDays(7) : end;
        return appointmentRepository.findByStartAtBetweenOrderByStartAtAsc(
                        firstDay.atStartOfDay(),
                        LocalDateTime.of(lastDay, LocalTime.MAX))
                .stream()
                .map(appointmentMapper::toResponse)
                .toList();
    }

    @Transactional
    public AppointmentResponse create(AppointmentRequest request) {
        validateFuture(request.startAt());
        var patient = patientRepository.findById(request.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado."));
        var doctor = doctorRepository.findById(request.doctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Medico nao encontrado."));
        int duration = request.durationMinutes() == null ? 30 : request.durationMinutes();
        validateDoctorAvailability(request.doctorId(), request.startAt(), duration, null);

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setSpecialty(doctor.getSpecialty());
        appointment.setStartAt(request.startAt());
        appointment.setDurationMinutes(duration);
        appointment.setObservations(request.observations());
        appointment.setStatus(AppointmentStatus.AGENDADA);

        appointment = appointmentRepository.save(appointment);
        auditService.log("CREATE_APPOINTMENT", "Appointment", appointment.getId(), "Consulta criada para " + patient.getFullName());
        return appointmentMapper.toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse cancel(UUID id) {
        var appointment = findEntity(id);
        appointment.setStatus(AppointmentStatus.CANCELADA);
        auditService.log("CANCEL_APPOINTMENT", "Appointment", id, "Consulta cancelada.");
        return appointmentMapper.toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse conclude(UUID id) {
        var appointment = findEntity(id);
        appointment.setStatus(AppointmentStatus.CONCLUIDA);
        return appointmentMapper.toResponse(appointment);
    }

    @Transactional
    public AppointmentResponse reschedule(UUID id, LocalDateTime newStartAt) {
        validateFuture(newStartAt);
        var appointment = findEntity(id);
        validateDoctorAvailability(appointment.getDoctor().getId(), newStartAt, appointment.getDurationMinutes(), appointment.getId());
        appointment.setStartAt(newStartAt);
        appointment.setStatus(AppointmentStatus.AGENDADA);
        return appointmentMapper.toResponse(appointment);
    }

    private Appointment findEntity(UUID id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta nao encontrada."));
    }

    private void validateFuture(LocalDateTime startAt) {
        if (startAt.isBefore(LocalDateTime.now())) {
            throw new BusinessException("Nao e permitido agendar consulta no passado.");
        }
    }

    private void validateDoctorAvailability(UUID doctorId, LocalDateTime startAt, int durationMinutes, UUID ignoredAppointmentId) {
        LocalDateTime dayStart = startAt.toLocalDate().atStartOfDay();
        LocalDateTime dayEnd = LocalDateTime.of(startAt.toLocalDate(), LocalTime.MAX);
        LocalDateTime requestedEnd = startAt.plusMinutes(durationMinutes);
        boolean conflict = appointmentRepository
                .findByDoctor_IdAndStatusNotAndStartAtBetween(doctorId, AppointmentStatus.CANCELADA, dayStart, dayEnd)
                .stream()
                .filter(existing -> ignoredAppointmentId == null || !ignoredAppointmentId.equals(existing.getId()))
                .anyMatch(existing -> {
                    LocalDateTime existingStart = existing.getStartAt();
                    LocalDateTime existingEnd = existingStart.plusMinutes(existing.getDurationMinutes());
                    return existingStart.isBefore(requestedEnd) && existingEnd.isAfter(startAt);
                });
        if (conflict) {
            throw new BusinessException("O medico ja possui consulta neste horario.");
        }
    }
}
