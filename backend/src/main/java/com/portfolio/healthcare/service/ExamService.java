package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.ClinicalDtos.ExamRequest;
import com.portfolio.healthcare.dto.ClinicalDtos.ExamResponse;
import com.portfolio.healthcare.entity.Exam;
import com.portfolio.healthcare.entity.enums.ExamStatus;
import com.portfolio.healthcare.exception.ResourceNotFoundException;
import com.portfolio.healthcare.mapper.ClinicalMapper;
import com.portfolio.healthcare.repository.DoctorRepository;
import com.portfolio.healthcare.repository.ExamRepository;
import com.portfolio.healthcare.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ExamService {

    private final ExamRepository examRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final ClinicalMapper clinicalMapper;

    @Transactional(readOnly = true)
    public List<ExamResponse> list() {
        return examRepository.findAll().stream().map(clinicalMapper::examToResponse).toList();
    }

    @Transactional
    public ExamResponse create(ExamRequest request) {
        Exam exam = new Exam();
        apply(exam, request);
        return clinicalMapper.examToResponse(examRepository.save(exam));
    }

    @Transactional
    public ExamResponse update(UUID id, ExamRequest request) {
        Exam exam = examRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Exame nao encontrado."));
        apply(exam, request);
        return clinicalMapper.examToResponse(exam);
    }

    private void apply(Exam exam, ExamRequest request) {
        exam.setPatient(patientRepository.findById(request.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado.")));
        exam.setRequestingDoctor(request.doctorId() == null ? null : doctorRepository.findById(request.doctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Medico nao encontrado.")));
        exam.setExamType(request.examType());
        exam.setRequestedAt(request.requestedAt());
        exam.setPerformedAt(request.performedAt());
        exam.setResult(request.result());
        exam.setStatus(request.status() == null ? ExamStatus.SOLICITADO : request.status());
        exam.setObservations(request.observations());
    }
}
