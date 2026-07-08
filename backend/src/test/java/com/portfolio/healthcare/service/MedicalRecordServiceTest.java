package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.MedicalRecordDtos.EntryRequest;
import com.portfolio.healthcare.entity.Patient;
import com.portfolio.healthcare.entity.enums.Gender;
import com.portfolio.healthcare.mapper.MedicalRecordMapper;
import com.portfolio.healthcare.repository.DoctorRepository;
import com.portfolio.healthcare.repository.MedicalRecordRepository;
import com.portfolio.healthcare.repository.PatientRepository;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MedicalRecordServiceTest {

    @Mock
    MedicalRecordRepository medicalRecordRepository;

    @Mock
    PatientRepository patientRepository;

    @Mock
    DoctorRepository doctorRepository;

    @Spy
    MedicalRecordMapper medicalRecordMapper;

    @Mock
    AuditService auditService;

    @InjectMocks
    MedicalRecordService medicalRecordService;

    @Test
    void shouldCreateRecordAndAddEntryWhenMissing() {
        UUID patientId = UUID.randomUUID();
        Patient patient = new Patient();
        patient.setId(patientId);
        patient.setFullName("Jose Santos Silva");
        patient.setBirthDate(LocalDate.of(1978, 8, 23));
        patient.setGender(Gender.MASCULINO);
        patient.setPhone("(11) 99999-2222");

        when(medicalRecordRepository.findByPatient_Id(patientId)).thenReturn(Optional.empty());
        when(patientRepository.findById(patientId)).thenReturn(Optional.of(patient));
        when(medicalRecordRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var response = medicalRecordService.addEntry(patientId, new EntryRequest(null, "Triagem", "Paciente estavel.", null));

        assertThat(response.patientName()).isEqualTo("Jose Santos Silva");
        assertThat(response.entries()).hasSize(1);
        assertThat(response.entries().get(0).title()).isEqualTo("Triagem");
    }
}
