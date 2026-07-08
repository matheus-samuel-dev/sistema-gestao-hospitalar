package com.portfolio.healthcare.dto;

import com.portfolio.healthcare.entity.enums.ExamStatus;
import com.portfolio.healthcare.entity.enums.HospitalizationStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public final class ClinicalDtos {
    private ClinicalDtos() {
    }

    public record ExamRequest(
            @NotNull UUID patientId,
            UUID doctorId,
            @NotBlank String examType,
            @NotNull LocalDate requestedAt,
            LocalDate performedAt,
            @Size(max = 2500) String result,
            ExamStatus status,
            @Size(max = 1200) String observations
    ) {
    }

    public record ExamResponse(
            UUID id,
            UUID patientId,
            String patientName,
            UUID doctorId,
            String doctorName,
            String examType,
            LocalDate requestedAt,
            LocalDate performedAt,
            String result,
            ExamStatus status,
            String observations
    ) {
    }

    public record HospitalizationRequest(
            @NotNull UUID patientId,
            UUID doctorId,
            @NotBlank String room,
            @NotBlank String bed,
            @NotNull LocalDate entryDate,
            LocalDate expectedDischargeDate,
            LocalDate dischargeDate,
            @NotBlank @Size(max = 1200) String reason,
            HospitalizationStatus status,
            @Size(max = 1200) String observations
    ) {
    }

    public record HospitalizationResponse(
            UUID id,
            UUID patientId,
            String patientName,
            UUID doctorId,
            String doctorName,
            String room,
            String bed,
            LocalDate entryDate,
            LocalDate expectedDischargeDate,
            LocalDate dischargeDate,
            String reason,
            HospitalizationStatus status,
            String observations
    ) {
    }
}
