package com.portfolio.healthcare.service;

import com.portfolio.healthcare.entity.AuditLog;
import com.portfolio.healthcare.entity.User;
import com.portfolio.healthcare.repository.AuditLogRepository;
import com.portfolio.healthcare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(String action, String entity, UUID entityId, String description) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntity(entity);
        log.setEntityId(entityId);
        log.setDescription(description);
        log.setOccurredAt(Instant.now());
        currentUser().ifPresent(log::setUser);
        auditLogRepository.save(log);
    }

    private Optional<User> currentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return Optional.empty();
        }
        return userRepository.findByEmailIgnoreCase(authentication.getName());
    }
}
