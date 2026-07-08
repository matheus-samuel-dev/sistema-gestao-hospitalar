package com.portfolio.healthcare.entity;

import com.portfolio.healthcare.entity.enums.HospitalizationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "hospitalizations")
public class Hospitalization extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id")
    private Doctor responsibleDoctor;

    @Column(nullable = false)
    private String room;

    @Column(nullable = false)
    private String bed;

    @Column(nullable = false)
    private LocalDate entryDate;

    private LocalDate expectedDischargeDate;
    private LocalDate dischargeDate;

    @Column(nullable = false, length = 1200)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private HospitalizationStatus status = HospitalizationStatus.ATIVA;

    @Column(length = 1200)
    private String observations;
}
