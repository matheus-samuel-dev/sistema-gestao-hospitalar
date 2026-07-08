package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.PatientDtos.PatientRequest;
import com.portfolio.healthcare.entity.Patient;
import com.portfolio.healthcare.entity.enums.EntityStatus;
import com.portfolio.healthcare.entity.enums.Gender;
import com.portfolio.healthcare.exception.BusinessException;
import com.portfolio.healthcare.mapper.PatientMapper;
import com.portfolio.healthcare.repository.PatientRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PatientServiceTest {

    @Mock
    PatientRepository patientRepository;

    @Spy
    PatientMapper patientMapper;

    @Mock
    AuditService auditService;

    @InjectMocks
    PatientService patientService;

    @Test
    void shouldCreatePatient() {
        PatientRequest request = request("123.456.789-01");
        when(patientRepository.existsByCpf(request.cpf())).thenReturn(false);
        when(patientRepository.save(any(Patient.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = patientService.create(request);

        assertThat(response.fullName()).isEqualTo("Maria Oliveira Santos");
        assertThat(response.status()).isEqualTo(EntityStatus.ATIVO);
        verify(auditService).log(any(), any(), any(), any());
    }

    @Test
    void shouldRejectDuplicatedCpf() {
        PatientRequest request = request("123.456.789-01");
        when(patientRepository.existsByCpf(request.cpf())).thenReturn(true);

        assertThatThrownBy(() -> patientService.create(request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("CPF");
    }

    private PatientRequest request(String cpf) {
        return new PatientRequest(
                "Maria Oliveira Santos",
                cpf,
                "MG-123",
                LocalDate.of(1986, 4, 12),
                Gender.FEMININO,
                "(11) 99999-0000",
                "maria@email.com",
                "Rua das Flores, 100",
                "Unimed",
                "UNI-123",
                "Alergia a dipirona",
                "Historico familiar revisado",
                "Observacoes clinicas",
                EntityStatus.ATIVO
        );
    }
}
