package com.portfolio.healthcare.controller;

import com.portfolio.healthcare.dto.ClinicalDtos.HospitalizationRequest;
import com.portfolio.healthcare.dto.ClinicalDtos.HospitalizationResponse;
import com.portfolio.healthcare.service.HospitalizationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/hospitalizations")
@RequiredArgsConstructor
@Tag(name = "Internacoes")
public class HospitalizationController {

    private final HospitalizationService hospitalizationService;

    @GetMapping
    public List<HospitalizationResponse> list() {
        return hospitalizationService.list();
    }

    @PostMapping
    public HospitalizationResponse create(@Valid @RequestBody HospitalizationRequest request) {
        return hospitalizationService.create(request);
    }

    @PutMapping("/{id}")
    public HospitalizationResponse update(@PathVariable UUID id, @Valid @RequestBody HospitalizationRequest request) {
        return hospitalizationService.update(id, request);
    }
}
