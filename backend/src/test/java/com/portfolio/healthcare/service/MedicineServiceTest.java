package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.PharmacyDtos.MedicineRequest;
import com.portfolio.healthcare.dto.PharmacyDtos.StockMovementRequest;
import com.portfolio.healthcare.entity.Medicine;
import com.portfolio.healthcare.entity.enums.MedicineStatus;
import com.portfolio.healthcare.exception.BusinessException;
import com.portfolio.healthcare.mapper.PharmacyMapper;
import com.portfolio.healthcare.repository.MedicineRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MedicineServiceTest {

    @Mock
    MedicineRepository medicineRepository;

    @Spy
    PharmacyMapper pharmacyMapper;

    @Mock
    AuditService auditService;

    @InjectMocks
    MedicineService medicineService;

    @Test
    void shouldMarkLowStockOnCreate() {
        when(medicineRepository.save(any(Medicine.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = medicineService.create(new MedicineRequest(
                "Omeprazol",
                "Omeprazol",
                "Eurofarma",
                "OME-01",
                LocalDate.now().plusMonths(8),
                10,
                20,
                null
        ));

        assertThat(response.status()).isEqualTo(MedicineStatus.ESTOQUE_BAIXO);
        assertThat(response.lowStock()).isTrue();
    }

    @Test
    void shouldRejectDispenseAboveStock() {
        UUID medicineId = UUID.randomUUID();
        Medicine medicine = new Medicine();
        medicine.setId(medicineId);
        medicine.setName("Dipirona");
        medicine.setActiveIngredient("Dipirona");
        medicine.setBatch("DIP-01");
        medicine.setExpirationDate(LocalDate.now().plusMonths(6));
        medicine.setQuantityInStock(3);
        medicine.setMinimumStock(5);
        medicine.setStatus(MedicineStatus.ESTOQUE_BAIXO);

        when(medicineRepository.findById(medicineId)).thenReturn(Optional.of(medicine));

        assertThatThrownBy(() -> medicineService.dispense(medicineId, new StockMovementRequest(5, "Aplicacao")))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Estoque insuficiente");
    }
}
