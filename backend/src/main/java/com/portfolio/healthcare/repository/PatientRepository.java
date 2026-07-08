package com.portfolio.healthcare.repository;

import com.portfolio.healthcare.entity.Patient;
import com.portfolio.healthcare.entity.enums.EntityStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    Page<Patient> findByFullNameContainingIgnoreCaseOrCpfContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String fullName,
            String cpf,
            String phone,
            Pageable pageable
    );

    long countByStatus(EntityStatus status);
    boolean existsByCpf(String cpf);
    boolean existsByCpfAndIdNot(String cpf, UUID id);
}
