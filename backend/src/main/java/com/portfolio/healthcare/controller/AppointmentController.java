package com.portfolio.healthcare.controller;

import com.portfolio.healthcare.dto.AppointmentDtos.AppointmentRequest;
import com.portfolio.healthcare.dto.AppointmentDtos.AppointmentResponse;
import com.portfolio.healthcare.dto.AppointmentDtos.RescheduleRequest;
import com.portfolio.healthcare.service.AppointmentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@Tag(name = "Consultas")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @GetMapping
    public List<AppointmentResponse> list(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return appointmentService.list(start, end);
    }

    @PostMapping
    public AppointmentResponse create(@Valid @RequestBody AppointmentRequest request) {
        return appointmentService.create(request);
    }

    @PatchMapping("/{id}/cancel")
    public AppointmentResponse cancel(@PathVariable UUID id) {
        return appointmentService.cancel(id);
    }

    @PatchMapping("/{id}/conclude")
    public AppointmentResponse conclude(@PathVariable UUID id) {
        return appointmentService.conclude(id);
    }

    @PatchMapping("/{id}/reschedule")
    public AppointmentResponse reschedule(@PathVariable UUID id, @Valid @RequestBody RescheduleRequest request) {
        return appointmentService.reschedule(id, request.startAt());
    }
}
