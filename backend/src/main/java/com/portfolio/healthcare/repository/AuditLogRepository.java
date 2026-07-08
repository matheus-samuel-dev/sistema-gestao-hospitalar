package com.portfolio.healthcare.repository;

import com.portfolio.healthcare.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findTop20ByOrderByOccurredAtDesc();
}
