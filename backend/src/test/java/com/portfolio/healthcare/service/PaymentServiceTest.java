package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.FinanceDtos.PaymentRequest;
import com.portfolio.healthcare.entity.Patient;
import com.portfolio.healthcare.entity.Payment;
import com.portfolio.healthcare.entity.enums.PaymentMethod;
import com.portfolio.healthcare.entity.enums.PaymentStatus;
import com.portfolio.healthcare.entity.enums.ServiceType;
import com.portfolio.healthcare.exception.BusinessException;
import com.portfolio.healthcare.mapper.FinanceMapper;
import com.portfolio.healthcare.repository.PatientRepository;
import com.portfolio.healthcare.repository.PaymentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PaymentServiceTest {

    @Mock
    PaymentRepository paymentRepository;

    @Mock
    PatientRepository patientRepository;

    @Spy
    FinanceMapper financeMapper;

    @Mock
    AuditService auditService;

    @InjectMocks
    PaymentService paymentService;

    @Test
    void shouldCreatePayment() {
        UUID patientId = UUID.randomUUID();
        Patient patient = new Patient();
        patient.setId(patientId);
        patient.setFullName("Ana Pereira Lima");

        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(paymentRepository.save(any(Payment.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = paymentService.create(new PaymentRequest(
                patientId,
                ServiceType.CONSULTA,
                BigDecimal.valueOf(320),
                PaymentStatus.PENDENTE,
                PaymentMethod.PIX,
                LocalDate.now().plusDays(5),
                null
        ));

        assertThat(response.patientName()).isEqualTo("Ana Pereira Lima");
        assertThat(response.amount()).isEqualByComparingTo("320");
        assertThat(response.status()).isEqualTo(PaymentStatus.PENDENTE);
    }

    @Test
    void shouldRequirePaymentDateForPaidStatus() {
        UUID patientId = UUID.randomUUID();

        assertThatThrownBy(() -> paymentService.create(new PaymentRequest(
                patientId,
                ServiceType.EXAME,
                BigDecimal.valueOf(450),
                PaymentStatus.PAGO,
                PaymentMethod.CARTAO_CREDITO,
                LocalDate.now(),
                null
        ))).isInstanceOf(BusinessException.class)
                .hasMessageContaining("data de pagamento");
    }
}
