package com.portfolio.healthcare.dto;

import com.portfolio.healthcare.entity.enums.PaymentMethod;
import com.portfolio.healthcare.entity.enums.PaymentStatus;
import com.portfolio.healthcare.entity.enums.ServiceType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public final class FinanceDtos {
    private FinanceDtos() {
    }

    public record PaymentRequest(
            @NotNull UUID patientId,
            @NotNull ServiceType serviceType,
            @NotNull @DecimalMin("0.01") BigDecimal amount,
            PaymentStatus status,
            @NotNull PaymentMethod method,
            @NotNull LocalDate dueDate,
            LocalDate paymentDate
    ) {
    }

    public record PaymentResponse(
            UUID id,
            UUID patientId,
            String patientName,
            ServiceType serviceType,
            BigDecimal amount,
            PaymentStatus status,
            PaymentMethod method,
            LocalDate dueDate,
            LocalDate paymentDate
    ) {
    }

    public record MonthlyRevenuePoint(String month, BigDecimal revenue) {
    }

    public record FinancialSummaryResponse(
            BigDecimal monthlyRevenue,
            long pendingPayments,
            long overduePayments,
            List<MonthlyRevenuePoint> revenueByMonth
    ) {
    }
}
