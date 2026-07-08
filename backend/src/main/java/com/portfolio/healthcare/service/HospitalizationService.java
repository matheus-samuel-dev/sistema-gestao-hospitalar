package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.ClinicalDtos.HospitalizationRequest;
import com.portfolio.healthcare.dto.ClinicalDtos.HospitalizationResponse;
import com.portfolio.healthcare.entity.Hospitalization;
import com.portfolio.healthcare.entity.enums.HospitalizationStatus;
import com.portfolio.healthcare.exception.ResourceNotFoundException;
import com.portfolio.healthcare.mapper.ClinicalMapper;
import com.portfolio.healthcare.repository.DoctorRepository;
import com.portfolio.healthcare.repository.HospitalizationRepository;
import com.portfolio.healthcare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HospitalizationService {

    private final HospitalizationRepository hospitalizationRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ClinicalMapper clinicalMapper;

    @Transactional(readOnly = true)
    public List<HospitalizationResponse> list() {
        return hospitalizationRepository.findAll().stream().map(clinicalMapper::hospitalizationToResponse).toList();
    }

    @Transactional
    public HospitalizationResponse create(HospitalizationRequest request) {
        Hospitalization hospitalization = new Hospitalization();
        apply(hospitalization, request);
        return clinicalMapper.hospitalizationToResponse(hospitalizationRepository.save(hospitalization));
    }

    @Transactional
    public HospitalizationResponse update(UUID id, HospitalizationRequest request) {
        Hospitalization hospitalization = hospitalizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internacao nao encontrada."));
        apply(hospitalization, request);
        return clinicalMapper.hospitalizationToResponse(hospitalization);
    }

    private void apply(Hospitalization hospitalization, HospitalizationRequest request) {
        hospitalization.setPatient(patientRepository.findById(request.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado.")));
        hospitalization.setResponsibleDoctor(request.doctorId() == null ? null : doctorRepository.findById(request.doctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Medico nao encontrado.")));
        hospitalization.setRoom(request.room());
        hospitalization.setBed(request.bed());
        hospitalization.setEntryDate(request.entryDate());
        hospitalization.setExpectedDischargeDate(request.expectedDischargeDate());
        hospitalization.setDischargeDate(request.dischargeDate());
        hospitalization.setReason(request.reason());
        hospitalization.setStatus(request.status() == null ? HospitalizationStatus.ATIVA : request.status());
        hospitalization.setObservations(request.observations());
    }
}
