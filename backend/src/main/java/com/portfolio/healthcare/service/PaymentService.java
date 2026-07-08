package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.FinanceDtos.FinancialSummaryResponse;
import com.portfolio.healthcare.dto.FinanceDtos.MonthlyRevenuePoint;
import com.portfolio.healthcare.dto.FinanceDtos.PaymentRequest;
import com.portfolio.healthcare.dto.FinanceDtos.PaymentResponse;
import com.portfolio.healthcare.entity.Payment;
import com.portfolio.healthcare.entity.enums.PaymentStatus;
import com.portfolio.healthcare.exception.BusinessException;
import com.portfolio.healthcare.exception.ResourceNotFoundException;
import com.portfolio.healthcare.mapper.FinanceMapper;
import com.portfolio.healthcare.repository.PatientRepository;
import com.portfolio.healthcare.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PatientRepository patientRepository;
    private final FinanceMapper financeMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<PaymentResponse> list() {
        return paymentRepository.findAll().stream().map(financeMapper::toResponse).toList();
    }

    @Transactional
    public PaymentResponse create(PaymentRequest request) {
        if (request.status() == PaymentStatus.PAGO && request.paymentDate() == null) {
            throw new BusinessException("Pagamentos quitados precisam informar data de pagamento.");
        }
        Payment payment = new Payment();
        apply(payment, request);
        payment = paymentRepository.save(payment);
        auditService.log("CREATE_PAYMENT", "Payment", payment.getId(), "Pagamento criado no valor de R$ " + payment.getAmount());
        return financeMapper.toResponse(payment);
    }

    @Transactional
    public PaymentResponse update(UUID id, PaymentRequest request) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento nao encontrado."));
        apply(payment, request);
        return financeMapper.toResponse(payment);
    }

    @Transactional(readOnly = true)
    public FinancialSummaryResponse summary() {
        YearMonth current = YearMonth.now();
        BigDecimal monthlyRevenue = paymentRepository.findByDueDateBetween(current.atDay(1), current.atEndOfMonth()).stream()
                .filter(payment -> payment.getStatus() == PaymentStatus.PAGO)
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<MonthlyRevenuePoint> revenueByMonth = java.util.stream.IntStream.rangeClosed(0, 5)
                .mapToObj(index -> current.minusMonths(5L - index))
                .map(month -> {
                    BigDecimal revenue = paymentRepository.findByDueDateBetween(month.atDay(1), month.atEndOfMonth()).stream()
                            .filter(payment -> payment.getStatus() == PaymentStatus.PAGO)
                            .map(Payment::getAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);
                    String label = month.getMonth().getDisplayName(TextStyle.SHORT, Locale.forLanguageTag("pt-BR"));
                    return new MonthlyRevenuePoint(label, revenue);
                })
                .toList();

        return new FinancialSummaryResponse(
                monthlyRevenue,
                paymentRepository.countByStatus(PaymentStatus.PENDENTE),
                paymentRepository.countByStatus(PaymentStatus.ATRASADO),
                revenueByMonth
        );
    }

    private void apply(Payment payment, PaymentRequest request) {
        payment.setPatient(patientRepository.findById(request.patientId())
                .orElseThrow(() -> new ResourceNotFoundException("Paciente nao encontrado.")));
        payment.setServiceType(request.serviceType());
        payment.setAmount(request.amount());
        payment.setStatus(request.status() == null ? PaymentStatus.PENDENTE : request.status());
        payment.setMethod(request.method());
        payment.setDueDate(request.dueDate());
        payment.setPaymentDate(request.paymentDate());
    }
}
