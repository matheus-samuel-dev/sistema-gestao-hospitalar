package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.DoctorDtos.DoctorRequest;
import com.portfolio.healthcare.entity.Doctor;
import com.portfolio.healthcare.entity.enums.EntityStatus;
import com.portfolio.healthcare.exception.BusinessException;
import com.portfolio.healthcare.mapper.DoctorMapper;
import com.portfolio.healthcare.repository.DoctorRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoctorServiceTest {

    @Mock
    DoctorRepository doctorRepository;

    @Spy
    DoctorMapper doctorMapper;

    @InjectMocks
    DoctorService doctorService;

    @Test
    void shouldCreateDoctor() {
        DoctorRequest request = request("CRM-SP 123456");
        when(doctorRepository.existsByCrm(request.crm())).thenReturn(false);
        when(doctorRepository.save(any(Doctor.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = doctorService.create(request);

        assertThat(response.name()).isEqualTo("Dra. Ana Costa");
        assertThat(response.specialty()).isEqualTo("Cardiologia");
    }

    @Test
    void shouldRejectDuplicatedCrm() {
        DoctorRequest request = request("CRM-SP 123456");
        when(doctorRepository.existsByCrm(request.crm())).thenReturn(true);

        assertThatThrownBy(() -> doctorService.create(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("CRM");
    }

    private DoctorRequest request(String crm) {
        return new DoctorRequest(
                "Dra. Ana Costa",
                crm,
                "Cardiologia",
                "(11) 99999-1111",
                "ana@healthcare.com",
                "09:00 - 18:00",
                null,
                EntityStatus.ATIVO
        );
    }
}
