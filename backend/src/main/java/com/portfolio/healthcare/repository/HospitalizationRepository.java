package com.portfolio.healthcare.repository;

import com.portfolio.healthcare.entity.Hospitalization;
import com.portfolio.healthcare.entity.enums.HospitalizationStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface HospitalizationRepository extends JpaRepository<Hospitalization, UUID> {
    long countByStatus(HospitalizationStatus status);

    @Override
    @EntityGraph(attributePaths = {"patient", "responsibleDoctor"})
    List<Hospitalization> findAll();

    @EntityGraph(attributePaths = {"patient", "responsibleDoctor"})
    List<Hospitalization> findTop6ByOrderByEntryDateDesc();
}
