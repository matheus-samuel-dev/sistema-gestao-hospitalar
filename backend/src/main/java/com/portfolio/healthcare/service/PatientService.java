package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.PatientDtos.PatientRequest;
import com.portfolio.healthcare.dto.PatientDtos.PatientResponse;
import com.portfolio.healthcare.entity.enums.EntityStatus;
import com.portfolio.healthcare.exception.BusinessException;
import com.portfolio.healthcare.exception.ResourceNotFoundException;
import com.portfolio.healthcare.mapper.PatientMapper;
import com.portfolio.healthcare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public Page<PatientResponse> list(String search, Pageable pageable) {
        if (StringUtils.hasText(search)) {
            return patientRepository.findByFullNameContainingIgnoreCaseOrCpfContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                    search, search, search, pageable).map(patientMapper::toResponse);
        }
        return patientRepository.findAll(pageable).map(patientMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public PatientResponse get(UUID id) {
        return patientMapper.toResponse(patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado.")));
    }

    @Transactional
    public PatientResponse create(PatientRequest request) {
        if (patientRepository.existsByCpf(request.cpf())) {
            throw new BusinessException("Ja existe paciente cadastrado com este CPF.");
        }
        var patient = patientRepository.save(patientMapper.toEntity(request));
        auditService.log("CREATE_PATIENT", "Patient", patient.getId(), "Paciente criado: " + patient.getFullName());
        return patientMapper.toResponse(patient);
    }

    @Transactional
    public PatientResponse update(UUID id, PatientRequest request) {
        var patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado."));
        if (patientRepository.existsByCpfAndIdNot(request.cpf(), id)) {
            throw new BusinessException("Ja existe paciente cadastrado com este CPF.");
        }
        patientMapper.update(patient, request);
        auditService.log("UPDATE_PATIENT", "Patient", patient.getId(), "Paciente atualizado: " + patient.getFullName());
        return patientMapper.toResponse(patient);
    }

    @Transactional
    public void inactivate(UUID id) {
        var patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado."));
        patient.setStatus(EntityStatus.INATIVO);
        auditService.log("INACTIVATE_PATIENT", "Patient", patient.getId(), "Paciente inativado: " + patient.getFullName());
    }
}
