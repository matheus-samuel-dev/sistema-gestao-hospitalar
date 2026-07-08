package com.portfolio.healthcare.controller;

import com.portfolio.healthcare.dto.FinanceDtos.FinancialSummaryResponse;
import com.portfolio.healthcare.dto.FinanceDtos.PaymentRequest;
import com.portfolio.healthcare.dto.FinanceDtos.PaymentResponse;
import com.portfolio.healthcare.service.PdfExportService;
import com.portfolio.healthcare.service.PaymentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
@Tag(name = "Financeiro")
public class FinanceController {

    private final PaymentService paymentService;
    private final PdfExportService pdfExportService;

    @GetMapping("/payments")
    public List<PaymentResponse> listPayments() {
        return paymentService.list();
    }

    @PostMapping("/payments")
    public PaymentResponse createPayment(@Valid @RequestBody PaymentRequest request) {
        return paymentService.create(request);
    }

    @PutMapping("/payments/{id}")
    public PaymentResponse updatePayment(@PathVariable UUID id, @Valid @RequestBody PaymentRequest request) {
        return paymentService.update(id, request);
    }

    @GetMapping("/summary")
    public FinancialSummaryResponse summary() {
        return paymentService.summary();
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> exportExcel() {
        StringBuilder csv = new StringBuilder("paciente;servico;valor;status;metodo;vencimento;pagamento\n");
        paymentService.list().forEach(payment -> csv.append(payment.patientName()).append(';')
                .append(payment.serviceType()).append(';')
                .append(payment.amount()).append(';')
                .append(payment.status()).append(';')
                .append(payment.method()).append(';')
                .append(payment.dueDate()).append(';')
                .append(payment.paymentDate() == null ? "" : payment.paymentDate())
                .append('\n'));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=financeiro-healthcare.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv.toString().getBytes(StandardCharsets.UTF_8));
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdf() {
        var summary = paymentService.summary();
        byte[] pdf = pdfExportService.simpleReport("Sistema Gestao Hospitalar - Financeiro", List.of(
                "Receita mensal: R$ " + summary.monthlyRevenue(),
                "Pagamentos pendentes: " + summary.pendingPayments(),
                "Pagamentos atrasados: " + summary.overduePayments()
        ));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=financeiro-sistema-gestao-hospitalar.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
