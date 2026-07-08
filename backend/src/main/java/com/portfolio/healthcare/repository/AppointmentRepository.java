package com.portfolio.healthcare.repository;

import com.portfolio.healthcare.entity.Appointment;
import com.portfolio.healthcare.entity.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    boolean existsByDoctor_IdAndStartAtAndStatusNot(UUID doctorId, LocalDateTime startAt, AppointmentStatus status);

    @EntityGraph(attributePaths = {"patient", "doctor"})
    List<Appointment> findByStartAtBetweenOrderByStartAtAsc(LocalDateTime start, LocalDateTime end);

    @EntityGraph(attributePaths = {"patient", "doctor"})
    List<Appointment> findByDoctor_IdAndStatusNotAndStartAtBetween(UUID doctorId, AppointmentStatus status, LocalDateTime start, LocalDateTime end);

    long countByStartAtBetween(LocalDateTime start, LocalDateTime end);

    long countByStatus(AppointmentStatus status);
}
