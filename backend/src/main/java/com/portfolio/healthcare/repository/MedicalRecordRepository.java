package com.portfolio.healthcare.repository;

import com.portfolio.healthcare.entity.MedicalRecord;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {
    @EntityGraph(attributePaths = {"patient", "entries", "entries.doctor", "prescriptions", "prescriptions.doctor"})
    Optional<MedicalRecord> findByPatient_Id(UUID patientId);
}
