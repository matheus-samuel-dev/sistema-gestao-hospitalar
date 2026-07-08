package com.portfolio.healthcare.repository;

import com.portfolio.healthcare.entity.MedicalRecordEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MedicalRecordEntryRepository extends JpaRepository<MedicalRecordEntry, UUID> {
}
