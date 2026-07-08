package com.portfolio.healthcare.controller;

import com.portfolio.healthcare.dto.PatientDtos.PatientRequest;
import com.portfolio.healthcare.dto.PatientDtos.PatientResponse;
import com.portfolio.healthcare.service.PatientService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

import static org.springframework.http.HttpStatus.NO_CONTENT;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@Tag(name = "Pacientes")
public class PatientController {

    private final PatientService patientService;

    @GetMapping
    public Page<PatientResponse> list(@RequestParam(required = false) String search, Pageable pageable) {
        return patientService.list(search, pageable);
    }

    @GetMapping("/{id}")
    public PatientResponse get(@PathVariable UUID id) {
        return patientService.get(id);
    }

    @PostMapping
    public PatientResponse create(@Valid @RequestBody PatientRequest request) {
        return patientService.create(request);
    }

    @PutMapping("/{id}")
    public PatientResponse update(@PathVariable UUID id, @Valid @RequestBody PatientRequest request) {
        return patientService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(NO_CONTENT)
    public void inactivate(@PathVariable UUID id) {
        patientService.inactivate(id);
    }
}
