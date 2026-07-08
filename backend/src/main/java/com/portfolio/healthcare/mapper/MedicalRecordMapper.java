package com.portfolio.healthcare.mapper;

import com.portfolio.healthcare.dto.MedicalRecordDtos.EntryResponse;
import com.portfolio.healthcare.dto.MedicalRecordDtos.MedicalRecordResponse;
import com.portfolio.healthcare.dto.MedicalRecordDtos.PrescriptionResponse;
import com.portfolio.healthcare.entity.MedicalRecord;
import com.portfolio.healthcare.entity.MedicalRecordEntry;
import com.portfolio.healthcare.entity.Prescription;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;

@Component
public class MedicalRecordMapper {

    public MedicalRecordResponse toResponse(MedicalRecord record) {
        var patient = record.getPatient();
        return new MedicalRecordResponse(
                record.getId(),
                patient.getId(),
                patient.getFullName(),
                patient.getBirthDate(),
                calculateAge(patient.getBirthDate()),
                patient.getGender().name(),
                patient.getPhone(),
                patient.getEmail(),
                patient.getAllergies(),
                patient.getFamilyHistory(),
                record.getSummary(),
                record.getCurrentMedications(),
                record.getMedicalNotes(),
                record.getEntries().stream().map(this::entryToResponse).toList(),
                record.getPrescriptions().stream().map(this::prescriptionToResponse).toList()
        );
    }

    public EntryResponse entryToResponse(MedicalRecordEntry entry) {
        return new EntryResponse(
                entry.getId(),
                entry.getDoctor() == null ? null : entry.getDoctor().getId(),
                entry.getDoctor() == null ? "Equipe HealthCare" : entry.getDoctor().getName(),
                entry.getOccurredAt(),
                entry.getTitle(),
                entry.getDescription()
        );
    }

    public PrescriptionResponse prescriptionToResponse(Prescription prescription) {
        return new PrescriptionResponse(
                prescription.getId(),
                prescription.getDoctor() == null ? null : prescription.getDoctor().getId(),
                prescription.getDoctor() == null ? "Equipe HealthCare" : prescription.getDoctor().getName(),
                prescription.getMedication(),
                prescription.getDosage(),
                prescription.getFrequency(),
                prescription.getDuration(),
                prescription.getObservations()
        );
    }

    private int calculateAge(LocalDate birthDate) {
        return birthDate == null ? 0 : Period.between(birthDate, LocalDate.now()).getYears();
    }
}
