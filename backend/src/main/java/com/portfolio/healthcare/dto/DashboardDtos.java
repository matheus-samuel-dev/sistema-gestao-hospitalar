package com.portfolio.healthcare.dto;

import java.math.BigDecimal;
import java.util.List;

public final class DashboardDtos {
    private DashboardDtos() {
    }

    public record StatCardResponse(
            String title,
            String value,
            String variation,
            String tone
    ) {
    }

    public record ChartPoint(
            String label,
            Number value
    ) {
    }

    public record SpecialtyPoint(
            String specialty,
            long total
    ) {
    }

    public record DashboardResponse(
            List<StatCardResponse> stats,
            List<ChartPoint> appointmentsLast7Days,
            List<ChartPoint> revenueLast6Months,
            List<SpecialtyPoint> appointmentsBySpecialty,
            List<AppointmentDtos.AppointmentResponse> upcomingAppointments,
            List<PatientDtos.PatientResponse> latestPatients,
            List<ClinicalDtos.ExamResponse> pendingExams,
            List<ClinicalDtos.HospitalizationResponse> recentHospitalizations,
            BigDecimal monthRevenue
    ) {
    }
}
