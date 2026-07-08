package com.portfolio.healthcare.entity;

import com.portfolio.healthcare.entity.enums.MedicineStatus;
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
@Table(name = "medicines")
public class Medicine extends BaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String activeIngredient;

    private String manufacturer;

    @Column(nullable = false)
    private String batch;

    @Column(nullable = false)
    private LocalDate expirationDate;

    @Column(nullable = false)
    private Integer quantityInStock;

    @Column(nullable = false)
    private Integer minimumStock;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MedicineStatus status = MedicineStatus.DISPONIVEL;
}
