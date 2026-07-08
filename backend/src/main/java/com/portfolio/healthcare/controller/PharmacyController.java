package com.portfolio.healthcare.controller;

import com.portfolio.healthcare.dto.PharmacyDtos.MedicineRequest;
import com.portfolio.healthcare.dto.PharmacyDtos.MedicineResponse;
import com.portfolio.healthcare.dto.PharmacyDtos.StockMovementRequest;
import com.portfolio.healthcare.service.MedicineService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pharmacy")
@RequiredArgsConstructor
@Tag(name = "Farmacia")
public class PharmacyController {

    private final MedicineService medicineService;

    @GetMapping("/medicines")
    public List<MedicineResponse> list() {
        return medicineService.list();
    }

    @PostMapping("/medicines")
    public MedicineResponse create(@Valid @RequestBody MedicineRequest request) {
        return medicineService.create(request);
    }

    @PutMapping("/medicines/{id}")
    public MedicineResponse update(@PathVariable UUID id, @Valid @RequestBody MedicineRequest request) {
        return medicineService.update(id, request);
    }

    @PatchMapping("/medicines/{id}/dispense")
    public MedicineResponse dispense(@PathVariable UUID id, @Valid @RequestBody StockMovementRequest request) {
        return medicineService.dispense(id, request);
    }
}
