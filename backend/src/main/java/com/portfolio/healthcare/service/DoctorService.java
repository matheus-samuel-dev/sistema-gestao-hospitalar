package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.DoctorDtos.DoctorRequest;
import com.portfolio.healthcare.dto.DoctorDtos.DoctorResponse;
import com.portfolio.healthcare.exception.BusinessException;
import com.portfolio.healthcare.exception.ResourceNotFoundException;
import com.portfolio.healthcare.mapper.DoctorMapper;
import com.portfolio.healthcare.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorMapper doctorMapper;

    @Transactional(readOnly = true)
    public Page<DoctorResponse> list(String search, Pageable pageable) {
        if (StringUtils.hasText(search)) {
            return doctorRepository.findByNameContainingIgnoreCaseOrCrmContainingIgnoreCaseOrSpecialtyContainingIgnoreCase(
                    search, search, search, pageable).map(doctorMapper::toResponse);
        }
        return doctorRepository.findAll(pageable).map(doctorMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public DoctorResponse get(UUID id) {
        return doctorMapper.toResponse(doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medico nao encontrado.")));
    }

    @Transactional
    public DoctorResponse create(DoctorRequest request) {
        if (doctorRepository.existsByCrm(request.crm())) {
            throw new BusinessException("Ja existe medico cadastrado com este CRM.");
        }
        return doctorMapper.toResponse(doctorRepository.save(doctorMapper.toEntity(request)));
    }

    @Transactional
    public DoctorResponse update(UUID id, DoctorRequest request) {
        var doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medico nao encontrado."));
        if (doctorRepository.existsByCrmAndIdNot(request.crm(), id)) {
            throw new BusinessException("Ja existe medico cadastrado com este CRM.");
        }
        doctorMapper.update(doctor, request);
        return doctorMapper.toResponse(doctor);
    }
}
