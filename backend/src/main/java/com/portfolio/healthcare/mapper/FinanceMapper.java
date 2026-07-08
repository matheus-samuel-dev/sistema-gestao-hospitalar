package com.portfolio.healthcare.mapper;

import com.portfolio.healthcare.dto.FinanceDtos.PaymentResponse;
import com.portfolio.healthcare.entity.Payment;
import org.springframework.stereotype.Component;

@Component
public class FinanceMapper {

    public PaymentResponse toResponse(Payment payment) {
        return new PaymentResponse(
                payment.getId(),
                payment.getPatient().getId(),
                payment.getPatient().getFullName(),
                payment.getServiceType(),
                payment.getAmount(),
                payment.getStatus(),
                payment.getMethod(),
                payment.getDueDate(),
                payment.getPaymentDate()
        );
    }
}
