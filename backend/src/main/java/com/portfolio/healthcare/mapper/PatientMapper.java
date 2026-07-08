package com.portfolio.healthcare.mapper;

import com.portfolio.healthcare.dto.PatientDtos.PatientRequest;
import com.portfolio.healthcare.dto.PatientDtos.PatientResponse;
import com.portfolio.healthcare.entity.Patient;
import com.portfolio.healthcare.entity.enums.EntityStatus;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;

@Component
public class PatientMapper {

    public Patient toEntity(PatientRequest request) {
        Patient patient = new Patient();
        update(patient, request);
        return patient;
    }

    public void update(Patient patient, PatientRequest request) {
        patient.setFullName(request.fullName());
        patient.setCpf(request.cpf());
        patient.setRg(request.rg());
        patient.setBirthDate(request.birthDate());
        patient.setGender(request.gender());
        patient.setPhone(request.phone());
        patient.setEmail(request.email());
        patient.setAddress(request.address());
        patient.setInsuranceProvider(request.insuranceProvider());
        patient.setInsuranceNumber(request.insuranceNumber());
        patient.setAllergies(request.allergies());
        patient.setFamilyHistory(request.familyHistory());
        patient.setObservations(request.observations());
        patient.setStatus(request.status() == null ? EntityStatus.ATIVO : request.status());
    }

    public PatientResponse toResponse(Patient patient) {
        return new PatientResponse(
                patient.getId(),
                patient.getFullName(),
                patient.getCpf(),
                patient.getRg(),
                patient.getBirthDate(),
                calculateAge(patient.getBirthDate()),
                patient.getGender(),
                patient.getPhone(),
                patient.getEmail(),
                patient.getAddress(),
                patient.getInsuranceProvider(),
                patient.getInsuranceNumber(),
                patient.getAllergies(),
                patient.getFamilyHistory(),
                patient.getObservations(),
                patient.getStatus()
        );
    }

    public int calculateAge(LocalDate birthDate) {
        return birthDate == null ? 0 : Period.between(birthDate, LocalDate.now()).getYears();
    }
}
