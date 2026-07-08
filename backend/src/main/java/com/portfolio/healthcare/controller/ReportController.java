package com.portfolio.healthcare.controller;

import com.portfolio.healthcare.dto.DashboardDtos.DashboardResponse;
import com.portfolio.healthcare.service.DashboardService;
import com.portfolio.healthcare.service.PdfExportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@Tag(name = "Relatorios")
public class ReportController {

    private final DashboardService dashboardService;
    private final PdfExportService pdfExportService;

    @GetMapping
    public DashboardResponse analytics() {
        return dashboardService.overview();
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportPdfSummary() {
        var dashboard = dashboardService.overview();
        byte[] pdf = pdfExportService.simpleReport("Sistema Gestao Hospitalar - Relatorio executivo", List.of(
                "Receita do mes: R$ " + dashboard.monthRevenue(),
                "Indicadores principais: " + dashboard.stats().size(),
                "Consultas por especialidade: " + dashboard.appointmentsBySpecialty().size()
        ));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-sistema-gestao-hospitalar.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
