package com.portfolio.healthcare.mapper;

import com.portfolio.healthcare.dto.DoctorDtos.DoctorRequest;
import com.portfolio.healthcare.dto.DoctorDtos.DoctorResponse;
import com.portfolio.healthcare.entity.Doctor;
import com.portfolio.healthcare.entity.enums.EntityStatus;
import org.springframework.stereotype.Component;

@Component
public class DoctorMapper {

    public Doctor toEntity(DoctorRequest request) {
        Doctor doctor = new Doctor();
        update(doctor, request);
        return doctor;
    }

    public void update(Doctor doctor, DoctorRequest request) {
        doctor.setName(request.name());
        doctor.setCrm(request.crm());
        doctor.setSpecialty(request.specialty());
        doctor.setPhone(request.phone());
        doctor.setEmail(request.email());
        doctor.setOfficeHours(request.officeHours());
        doctor.setAvatarUrl(request.avatarUrl());
        doctor.setStatus(request.status() == null ? EntityStatus.ATIVO : request.status());
    }

    public DoctorResponse toResponse(Doctor doctor) {
        return new DoctorResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getCrm(),
                doctor.getSpecialty(),
                doctor.getPhone(),
                doctor.getEmail(),
                doctor.getOfficeHours(),
                doctor.getAvatarUrl(),
                doctor.getStatus()
        );
    }
}
