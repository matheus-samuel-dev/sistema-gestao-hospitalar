package com.portfolio.healthcare.entity;

import com.portfolio.healthcare.entity.enums.EntityStatus;
import com.portfolio.healthcare.entity.enums.Gender;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "patients")
public class Patient extends BaseEntity {

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true, length = 20)
    private String cpf;

    private String rg;

    @Column(nullable = false)
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Gender gender = Gender.NAO_INFORMADO;

    @Column(nullable = false)
    private String phone;

    private String email;
    private String address;
    private String insuranceProvider;
    private String insuranceNumber;

    @Column(length = 1200)
    private String allergies;

    @Column(length = 1200)
    private String familyHistory;

    @Column(length = 1200)
    private String observations;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EntityStatus status = EntityStatus.ATIVO;
}
