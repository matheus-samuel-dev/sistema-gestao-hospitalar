package com.portfolio.healthcare.mapper;

import com.portfolio.healthcare.dto.AppointmentDtos.AppointmentResponse;
import com.portfolio.healthcare.entity.Appointment;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    public AppointmentResponse toResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getFullName(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getName(),
                appointment.getSpecialty(),
                appointment.getStartAt(),
                appointment.getDurationMinutes(),
                appointment.getStatus(),
                appointment.getObservations()
        );
    }
}
