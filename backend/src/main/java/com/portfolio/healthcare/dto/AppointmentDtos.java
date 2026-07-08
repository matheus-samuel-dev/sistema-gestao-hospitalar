package com.portfolio.healthcare.dto;

import com.portfolio.healthcare.entity.enums.AppointmentStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.UUID;

public final class AppointmentDtos {
    private AppointmentDtos() {
    }

    public record AppointmentRequest(
            @NotNull UUID patientId,
            @NotNull UUID doctorId,
            @NotNull @Future LocalDateTime startAt,
            @Min(15) Integer durationMinutes,
            @Size(max = 1200) String observations
    ) {
    }

    public record RescheduleRequest(
            @NotNull @Future LocalDateTime startAt
    ) {
    }

    public record AppointmentResponse(
            UUID id,
            UUID patientId,
            String patientName,
            UUID doctorId,
            String doctorName,
            String specialty,
            LocalDateTime startAt,
            Integer durationMinutes,
            AppointmentStatus status,
            String observations
    ) {
    }
}
