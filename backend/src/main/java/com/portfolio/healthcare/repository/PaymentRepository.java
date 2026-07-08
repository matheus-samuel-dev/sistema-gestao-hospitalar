package com.portfolio.healthcare.repository;

import com.portfolio.healthcare.entity.Payment;
import com.portfolio.healthcare.entity.enums.PaymentStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    @EntityGraph(attributePaths = {"patient"})
    List<Payment> findByDueDateBetween(LocalDate start, LocalDate end);

    @Override
    @EntityGraph(attributePaths = {"patient"})
    List<Payment> findAll();

    long countByStatus(PaymentStatus status);
}
