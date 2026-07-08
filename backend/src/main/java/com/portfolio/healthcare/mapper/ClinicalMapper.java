package com.portfolio.healthcare.mapper;

import com.portfolio.healthcare.dto.ClinicalDtos.ExamResponse;
import com.portfolio.healthcare.dto.ClinicalDtos.HospitalizationResponse;
import com.portfolio.healthcare.entity.Exam;
import com.portfolio.healthcare.entity.Hospitalization;
import org.springframework.stereotype.Component;

@Component
public class ClinicalMapper {

    public ExamResponse examToResponse(Exam exam) {
        return new ExamResponse(
                exam.getId(),
                exam.getPatient().getId(),
                exam.getPatient().getFullName(),
                exam.getRequestingDoctor() == null ? null : exam.getRequestingDoctor().getId(),
                exam.getRequestingDoctor() == null ? "Nao informado" : exam.getRequestingDoctor().getName(),
                exam.getExamType(),
                exam.getRequestedAt(),
                exam.getPerformedAt(),
                exam.getResult(),
                exam.getStatus(),
                exam.getObservations()
        );
    }

    public HospitalizationResponse hospitalizationToResponse(Hospitalization hospitalization) {
        return new HospitalizationResponse(
                hospitalization.getId(),
                hospitalization.getPatient().getId(),
                hospitalization.getPatient().getFullName(),
                hospitalization.getResponsibleDoctor() == null ? null : hospitalization.getResponsibleDoctor().getId(),
                hospitalization.getResponsibleDoctor() == null ? "Nao informado" : hospitalization.getResponsibleDoctor().getName(),
                hospitalization.getRoom(),
                hospitalization.getBed(),
                hospitalization.getEntryDate(),
                hospitalization.getExpectedDischargeDate(),
                hospitalization.getDischargeDate(),
                hospitalization.getReason(),
                hospitalization.getStatus(),
                hospitalization.getObservations()
        );
    }
}
