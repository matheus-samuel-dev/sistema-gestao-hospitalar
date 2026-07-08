package com.portfolio.healthcare.repository;

import com.portfolio.healthcare.entity.Exam;
import com.portfolio.healthcare.entity.enums.ExamStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ExamRepository extends JpaRepository<Exam, UUID> {
    long countByStatus(ExamStatus status);

    @Override
    @EntityGraph(attributePaths = {"patient", "requestingDoctor"})
    List<Exam> findAll();

    @EntityGraph(attributePaths = {"patient", "requestingDoctor"})
    List<Exam> findTop6ByOrderByRequestedAtDesc();
}
