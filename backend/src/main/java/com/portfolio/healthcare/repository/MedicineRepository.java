package com.portfolio.healthcare.repository;

import com.portfolio.healthcare.entity.Medicine;
import com.portfolio.healthcare.entity.enums.MedicineStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface MedicineRepository extends JpaRepository<Medicine, UUID> {
    long countByStatus(MedicineStatus status);
    List<Medicine> findByExpirationDateBefore(LocalDate date);
}
