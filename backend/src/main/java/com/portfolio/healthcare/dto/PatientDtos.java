package com.portfolio.healthcare.dto;

import com.portfolio.healthcare.entity.enums.EntityStatus;
import com.portfolio.healthcare.entity.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public final class PatientDtos {
    private PatientDtos() {
    }

    public record PatientRequest(
            @NotBlank @Size(max = 180) String fullName,
            @NotBlank @Size(max = 20) String cpf,
            @Size(max = 30) String rg,
            @NotNull @Past LocalDate birthDate,
            @NotNull Gender gender,
            @NotBlank @Size(max = 30) String phone,
            @Email String email,
            @Size(max = 260) String address,
            @Size(max = 120) String insuranceProvider,
            @Size(max = 80) String insuranceNumber,
            @Size(max = 1200) String allergies,
            @Size(max = 1200) String familyHistory,
            @Size(max = 1200) String observations,
            EntityStatus status
    ) {
    }

    public record PatientResponse(
            UUID id,
            String fullName,
            String cpf,
            String rg,
            LocalDate birthDate,
            Integer age,
            Gender gender,
            String phone,
            String email,
            String address,
            String insuranceProvider,
            String insuranceNumber,
            String allergies,
            String familyHistory,
            String observations,
            EntityStatus status
    ) {
    }
}
