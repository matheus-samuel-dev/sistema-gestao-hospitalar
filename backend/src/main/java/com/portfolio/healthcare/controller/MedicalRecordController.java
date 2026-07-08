package com.portfolio.healthcare.controller;

import com.portfolio.healthcare.dto.MedicalRecordDtos.EntryRequest;
import com.portfolio.healthcare.dto.MedicalRecordDtos.MedicalRecordResponse;
import com.portfolio.healthcare.dto.MedicalRecordDtos.MedicalRecordUpdateRequest;
import com.portfolio.healthcare.dto.MedicalRecordDtos.PrescriptionRequest;
import com.portfolio.healthcare.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
@Tag(name = "Prontuarios")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @GetMapping("/patient/{patientId}")
    public MedicalRecordResponse getByPatient(@PathVariable UUID patientId) {
        return medicalRecordService.getByPatient(patientId);
    }

    @PutMapping
    public MedicalRecordResponse upsert(@Valid @RequestBody MedicalRecordUpdateRequest request) {
        return medicalRecordService.upsert(request);
    }

    @PostMapping("/patient/{patientId}/entries")
    public MedicalRecordResponse addEntry(@PathVariable UUID patientId, @Valid @RequestBody EntryRequest request) {
        return medicalRecordService.addEntry(patientId, request);
    }

    @PostMapping("/patient/{patientId}/prescriptions")
    public MedicalRecordResponse addPrescription(@PathVariable UUID patientId, @Valid @RequestBody PrescriptionRequest request) {
        return medicalRecordService.addPrescription(patientId, request);
    }
}
