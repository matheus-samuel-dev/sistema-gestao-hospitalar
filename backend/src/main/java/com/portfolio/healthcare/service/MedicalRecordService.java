package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.MedicalRecordDtos.EntryRequest;
import com.portfolio.healthcare.dto.MedicalRecordDtos.MedicalRecordResponse;
import com.portfolio.healthcare.dto.MedicalRecordDtos.MedicalRecordUpdateRequest;
import com.portfolio.healthcare.dto.MedicalRecordDtos.PrescriptionRequest;
import com.portfolio.healthcare.entity.MedicalRecord;
import com.portfolio.healthcare.entity.MedicalRecordEntry;
import com.portfolio.healthcare.entity.Prescription;
import com.portfolio.healthcare.exception.ResourceNotFoundException;
import com.portfolio.healthcare.mapper.MedicalRecordMapper;
import com.portfolio.healthcare.repository.DoctorRepository;
import com.portfolio.healthcare.repository.MedicalRecordRepository;
import com.portfolio.healthcare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final MedicalRecordMapper medicalRecordMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public MedicalRecordResponse getByPatient(UUID patientId) {
        return medicalRecordMapper.toResponse(findOrCreate(patientId));
    }

    @Transactional
    public MedicalRecordResponse upsert(MedicalRecordUpdateRequest request) {
        MedicalRecord record = findOrCreate(request.patientId());
        record.setSummary(request.summary());
        record.setCurrentMedications(request.currentMedications());
        record.setMedicalNotes(request.medicalNotes());
        auditService.log("UPSERT_MEDICAL_RECORD", "MedicalRecord", record.getId(), "Prontuario atualizado.");
        return medicalRecordMapper.toResponse(record);
    }

    @Transactional
    public MedicalRecordResponse addEntry(UUID patientId, EntryRequest request) {
        MedicalRecord record = findOrCreate(patientId);
        MedicalRecordEntry entry = new MedicalRecordEntry();
        entry.setMedicalRecord(record);
        entry.setDoctor(request.doctorId() == null ? null : doctorRepository.findById(request.doctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Medico nao encontrado.")));
        entry.setOccurredAt(request.occurredAt() == null ? LocalDateTime.now() : request.occurredAt());
        entry.setTitle(request.title());
        entry.setDescription(request.description());
        record.getEntries().add(entry);
        auditService.log("CREATE_MEDICAL_RECORD_ENTRY", "MedicalRecord", record.getId(), "Entrada adicionada ao prontuario.");
        return medicalRecordMapper.toResponse(record);
    }

    @Transactional
    public MedicalRecordResponse addPrescription(UUID patientId, PrescriptionRequest request) {
        MedicalRecord record = findOrCreate(patientId);
        Prescription prescription = new Prescription();
        prescription.setMedicalRecord(record);
        prescription.setDoctor(request.doctorId() == null ? null : doctorRepository.findById(request.doctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Medico nao encontrado.")));
        prescription.setMedication(request.medication());
        prescription.setDosage(request.dosage());
        prescription.setFrequency(request.frequency());
        prescription.setDuration(request.duration());
        prescription.setObservations(request.observations());
        record.getPrescriptions().add(prescription);
        return medicalRecordMapper.toResponse(record);
    }

    private MedicalRecord findOrCreate(UUID patientId) {
        return medicalRecordRepository.findByPatient_Id(patientId).orElseGet(() -> {
            var patient = patientRepository.findById(patientId)
                    .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado."));
            MedicalRecord record = new MedicalRecord();
            record.setPatient(patient);
            record.setSummary("Prontuario iniciado para acompanhamento clinico integrado.");
            return medicalRecordRepository.save(record);
        });
    }
}
