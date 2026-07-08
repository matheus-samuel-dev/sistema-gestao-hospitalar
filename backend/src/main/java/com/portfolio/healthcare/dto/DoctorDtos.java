package com.portfolio.healthcare.dto;

import com.portfolio.healthcare.entity.enums.EntityStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public final class DoctorDtos {
    private DoctorDtos() {
    }

    public record DoctorRequest(
            @NotBlank @Size(max = 180) String name,
            @NotBlank @Size(max = 30) String crm,
            @NotBlank @Size(max = 120) String specialty,
            @Size(max = 30) String phone,
            @Email String email,
            @Size(max = 120) String officeHours,
            String avatarUrl,
            EntityStatus status
    ) {
    }

    public record DoctorResponse(
            UUID id,
            String name,
            String crm,
            String specialty,
            String phone,
            String email,
            String officeHours,
            String avatarUrl,
            EntityStatus status
    ) {
    }
}
