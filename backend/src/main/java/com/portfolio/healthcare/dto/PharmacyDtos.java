package com.portfolio.healthcare.dto;

import com.portfolio.healthcare.entity.enums.MedicineStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public final class PharmacyDtos {
    private PharmacyDtos() {
    }

    public record MedicineRequest(
            @NotBlank String name,
            @NotBlank String activeIngredient,
            String manufacturer,
            @NotBlank String batch,
            @NotNull @Future LocalDate expirationDate,
            @NotNull @Min(0) Integer quantityInStock,
            @NotNull @Min(1) Integer minimumStock,
            MedicineStatus status
    ) {
    }

    public record StockMovementRequest(
            @Min(1) int quantity,
            String reason
    ) {
    }

    public record MedicineResponse(
            UUID id,
            String name,
            String activeIngredient,
            String manufacturer,
            String batch,
            LocalDate expirationDate,
            Integer quantityInStock,
            Integer minimumStock,
            MedicineStatus status,
            boolean lowStock,
            boolean expiringSoon
    ) {
    }
}
