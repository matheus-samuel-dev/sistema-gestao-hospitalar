package com.portfolio.healthcare.repository;

import com.portfolio.healthcare.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findTop10ByUser_IdOrderByCreatedAtDesc(UUID userId);
}
