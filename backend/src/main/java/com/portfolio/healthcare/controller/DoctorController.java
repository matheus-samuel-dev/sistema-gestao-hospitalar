package com.portfolio.healthcare.controller;

import com.portfolio.healthcare.dto.DoctorDtos.DoctorRequest;
import com.portfolio.healthcare.dto.DoctorDtos.DoctorResponse;
import com.portfolio.healthcare.service.DoctorService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@Tag(name = "Medicos")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    public Page<DoctorResponse> list(@RequestParam(required = false) String search, Pageable pageable) {
        return doctorService.list(search, pageable);
    }

    @GetMapping("/{id}")
    public DoctorResponse get(@PathVariable UUID id) {
        return doctorService.get(id);
    }

    @PostMapping
    public DoctorResponse create(@Valid @RequestBody DoctorRequest request) {
        return doctorService.create(request);
    }

    @PutMapping("/{id}")
    public DoctorResponse update(@PathVariable UUID id, @Valid @RequestBody DoctorRequest request) {
        return doctorService.update(id, request);
    }
}
