package com.portfolio.healthcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public final class MedicalRecordDtos {
    private MedicalRecordDtos() {
    }

    public record MedicalRecordResponse(
            UUID id,
            UUID patientId,
            String patientName,
            LocalDate birthDate,
            Integer age,
            String gender,
            String phone,
            String email,
            String allergies,
            String familyHistory,
            String summary,
            String currentMedications,
            String medicalNotes,
            List<EntryResponse> entries,
            List<PrescriptionResponse> prescriptions
    ) {
    }

    public record EntryRequest(
            UUID doctorId,
            @NotBlank @Size(max = 180) String title,
            @NotBlank @Size(max = 2500) String description,
            LocalDateTime occurredAt
    ) {
    }

    public record EntryResponse(
            UUID id,
            UUID doctorId,
            String doctorName,
            LocalDateTime occurredAt,
            String title,
            String description
    ) {
    }

    public record PrescriptionRequest(
            UUID doctorId,
            @NotBlank String medication,
            @NotBlank String dosage,
            @NotBlank String frequency,
            @NotBlank String duration,
            @Size(max = 1200) String observations
    ) {
    }

    public record PrescriptionResponse(
            UUID id,
            UUID doctorId,
            String doctorName,
            String medication,
            String dosage,
            String frequency,
            String duration,
            String observations
    ) {
    }

    public record MedicalRecordUpdateRequest(
            @NotNull UUID patientId,
            @Size(max = 1200) String summary,
            @Size(max = 1200) String currentMedications,
            @Size(max = 1200) String medicalNotes
    ) {
    }
}
