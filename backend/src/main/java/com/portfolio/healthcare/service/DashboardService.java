package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.DashboardDtos.ChartPoint;
import com.portfolio.healthcare.dto.DashboardDtos.DashboardResponse;
import com.portfolio.healthcare.dto.DashboardDtos.SpecialtyPoint;
import com.portfolio.healthcare.dto.DashboardDtos.StatCardResponse;
import com.portfolio.healthcare.entity.Payment;
import com.portfolio.healthcare.entity.enums.AppointmentStatus;
import com.portfolio.healthcare.entity.enums.EntityStatus;
import com.portfolio.healthcare.entity.enums.ExamStatus;
import com.portfolio.healthcare.entity.enums.HospitalizationStatus;
import com.portfolio.healthcare.entity.enums.PaymentStatus;
import com.portfolio.healthcare.mapper.AppointmentMapper;
import com.portfolio.healthcare.mapper.ClinicalMapper;
import com.portfolio.healthcare.mapper.PatientMapper;
import com.portfolio.healthcare.repository.AppointmentRepository;
import com.portfolio.healthcare.repository.ExamRepository;
import com.portfolio.healthcare.repository.HospitalizationRepository;
import com.portfolio.healthcare.repository.PatientRepository;
import com.portfolio.healthcare.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final HospitalizationRepository hospitalizationRepository;
    private final PaymentRepository paymentRepository;
    private final ExamRepository examRepository;
    private final AppointmentMapper appointmentMapper;
    private final PatientMapper patientMapper;
    private final ClinicalMapper clinicalMapper;

    @Transactional(readOnly = true)
    public DashboardResponse overview() {
        LocalDate today = LocalDate.now();
        LocalDateTime todayStart = today.atStartOfDay();
        LocalDateTime todayEnd = LocalDateTime.of(today, LocalTime.MAX);
        YearMonth month = YearMonth.now();

        BigDecimal monthRevenue = paymentRepository.findByDueDateBetween(month.atDay(1), month.atEndOfMonth()).stream()
                .filter(payment -> payment.getStatus() == PaymentStatus.PAGO)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        var stats = List.of(
                new StatCardResponse("Consultas hoje", String.valueOf(appointmentRepository.countByStartAtBetween(todayStart, todayEnd)), "+12%", "blue"),
                new StatCardResponse("Pacientes ativos", String.valueOf(patientRepository.countByStatus(EntityStatus.ATIVO)), "+8%", "green"),
                new StatCardResponse("Internacoes", String.valueOf(hospitalizationRepository.countByStatus(HospitalizationStatus.ATIVA)), "+3%", "purple"),
                new StatCardResponse("Receita do mes", "R$ " + monthRevenue, "+18%", "amber")
        );

        var last7 = IntStream.rangeClosed(0, 6)
                .mapToObj(index -> today.minusDays(6L - index))
                .map(day -> new ChartPoint(day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.forLanguageTag("pt-BR")),
                        appointmentRepository.countByStartAtBetween(day.atStartOfDay(), LocalDateTime.of(day, LocalTime.MAX))))
                .toList();

        var revenue6 = IntStream.rangeClosed(0, 5)
                .mapToObj(index -> month.minusMonths(5L - index))
                .map(item -> {
                    BigDecimal revenue = paymentRepository.findByDueDateBetween(item.atDay(1), item.atEndOfMonth()).stream()
                            .filter(payment -> payment.getStatus() == PaymentStatus.PAGO)
                            .map(Payment::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    return new ChartPoint(item.getMonth().getDisplayName(TextStyle.SHORT, Locale.forLanguageTag("pt-BR")), revenue);
                })
                .toList();

        List<SpecialtyPoint> bySpecialty = appointmentRepository.findByStartAtBetweenOrderByStartAtAsc(
                        month.atDay(1).atStartOfDay(), LocalDateTime.of(month.atEndOfMonth(), LocalTime.MAX))
                .stream()
                .collect(Collectors.groupingBy(appointment -> appointment.getSpecialty() == null ? "Nao informado" : appointment.getSpecialty(), Collectors.counting()))
                .entrySet()
                .stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> new SpecialtyPoint(entry.getKey(), entry.getValue()))
                .toList();

        var upcoming = appointmentRepository.findByStartAtBetweenOrderByStartAtAsc(todayStart, today.plusDays(7).atTime(LocalTime.MAX))
                .stream()
                .filter(appointment -> appointment.getStatus() != AppointmentStatus.CANCELADA)
                .limit(6)
                .map(appointmentMapper::toResponse)
                .toList();

        var latestPatients = patientRepository.findAll(PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream()
                .map(patientMapper::toResponse)
                .toList();

        var pendingExams = examRepository.findAll().stream()
                .filter(exam -> exam.getStatus() == ExamStatus.SOLICITADO || exam.getStatus() == ExamStatus.AGENDADO || exam.getStatus() == ExamStatus.EM_ANALISE)
                .sorted(Comparator.comparing(com.portfolio.healthcare.entity.Exam::getRequestedAt).reversed())
                .limit(6)
                .map(clinicalMapper::examToResponse)
                .toList();

        var recentHospitalizations = hospitalizationRepository.findTop6ByOrderByEntryDateDesc()
                .stream()
                .map(clinicalMapper::hospitalizationToResponse)
                .toList();

        return new DashboardResponse(stats, last7, revenue6, bySpecialty, upcoming, latestPatients, pendingExams, recentHospitalizations, monthRevenue);
    }
}
