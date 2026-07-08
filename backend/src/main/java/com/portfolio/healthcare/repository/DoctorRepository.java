package com.portfolio.healthcare.repository;

import com.portfolio.healthcare.entity.Doctor;
import com.portfolio.healthcare.entity.enums.EntityStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    Page<Doctor> findByNameContainingIgnoreCaseOrCrmContainingIgnoreCaseOrSpecialtyContainingIgnoreCase(
            String name,
            String crm,
            String specialty,
            Pageable pageable
    );

    List<Doctor> findByStatusOrderByName(EntityStatus status);
    boolean existsByCrm(String crm);
    boolean existsByCrmAndIdNot(String crm, UUID id);
}
