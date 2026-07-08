package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.PharmacyDtos.MedicineRequest;
import com.portfolio.healthcare.dto.PharmacyDtos.MedicineResponse;
import com.portfolio.healthcare.dto.PharmacyDtos.StockMovementRequest;
import com.portfolio.healthcare.entity.Medicine;
import com.portfolio.healthcare.entity.enums.MedicineStatus;
import com.portfolio.healthcare.exception.BusinessException;
import com.portfolio.healthcare.exception.ResourceNotFoundException;
import com.portfolio.healthcare.mapper.PharmacyMapper;
import com.portfolio.healthcare.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final PharmacyMapper pharmacyMapper;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public List<MedicineResponse> list() {
        return medicineRepository.findAll().stream().map(pharmacyMapper::toResponse).toList();
    }

    @Transactional
    public MedicineResponse create(MedicineRequest request) {
        Medicine medicine = new Medicine();
        apply(medicine, request);
        refreshStatus(medicine);
        return pharmacyMapper.toResponse(medicineRepository.save(medicine));
    }

    @Transactional
    public MedicineResponse update(UUID id, MedicineRequest request) {
        Medicine medicine = findEntity(id);
        apply(medicine, request);
        refreshStatus(medicine);
        return pharmacyMapper.toResponse(medicine);
    }

    @Transactional
    public MedicineResponse dispense(UUID id, StockMovementRequest request) {
        Medicine medicine = findEntity(id);
        if (medicine.getQuantityInStock() < request.quantity()) {
            throw new BusinessException("Estoque insuficiente para baixa.");
        }
        medicine.setQuantityInStock(medicine.getQuantityInStock() - request.quantity());
        refreshStatus(medicine);
        auditService.log("DISPENSE_MEDICINE", "Medicine", id, "Baixa de estoque: " + request.quantity() + " unidade(s).");
        return pharmacyMapper.toResponse(medicine);
    }

    private Medicine findEntity(UUID id) {
        return medicineRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Medicamento nao encontrado."));
    }

    private void apply(Medicine medicine, MedicineRequest request) {
        medicine.setName(request.name());
        medicine.setActiveIngredient(request.activeIngredient());
        medicine.setManufacturer(request.manufacturer());
        medicine.setBatch(request.batch());
        medicine.setExpirationDate(request.expirationDate());
        medicine.setQuantityInStock(request.quantityInStock());
        medicine.setMinimumStock(request.minimumStock());
        medicine.setStatus(request.status() == null ? MedicineStatus.DISPONIVEL : request.status());
    }

    private void refreshStatus(Medicine medicine) {
        if (medicine.getQuantityInStock() == 0) {
            medicine.setStatus(MedicineStatus.ESGOTADO);
        } else if (medicine.getQuantityInStock() <= medicine.getMinimumStock()) {
            medicine.setStatus(MedicineStatus.ESTOQUE_BAIXO);
        } else if (medicine.getExpirationDate().isBefore(LocalDate.now().plusDays(45))) {
            medicine.setStatus(MedicineStatus.VENCIMENTO_PROXIMO);
        } else if (medicine.getStatus() != MedicineStatus.INATIVO) {
            medicine.setStatus(MedicineStatus.DISPONIVEL);
        }
    }
}
