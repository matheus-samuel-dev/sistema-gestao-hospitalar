package com.portfolio.healthcare.mapper;

import com.portfolio.healthcare.dto.PharmacyDtos.MedicineResponse;
import com.portfolio.healthcare.entity.Medicine;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class PharmacyMapper {

    public MedicineResponse toResponse(Medicine medicine) {
        boolean lowStock = medicine.getQuantityInStock() <= medicine.getMinimumStock();
        boolean expiringSoon = medicine.getExpirationDate().isBefore(LocalDate.now().plusDays(45));
        return new MedicineResponse(
                medicine.getId(),
                medicine.getName(),
                medicine.getActiveIngredient(),
                medicine.getManufacturer(),
                medicine.getBatch(),
                medicine.getExpirationDate(),
                medicine.getQuantityInStock(),
                medicine.getMinimumStock(),
                medicine.getStatus(),
                lowStock,
                expiringSoon
        );
    }
}
