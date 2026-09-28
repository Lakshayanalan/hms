package com.hospital.management.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.management.entity.Notification;
import com.hospital.management.entity.NotificationPriority;
import com.hospital.management.entity.NotificationType;
import com.hospital.management.entity.User;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    /**
     * Find all notifications for a specific user ordered by creation date descending
     */
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);
    
    /**
     * Find unread notifications for a specific user
     */
    List<Notification> findByRecipientAndIsReadFalseOrderByCreatedAtDesc(User recipient);
    
    /**
     * Find notifications for a user with pagination
     */
    Page<Notification> findByRecipientOrderByCreatedAtDesc(User recipient, Pageable pageable);
    
    /**
     * Count unread notifications for a user
     */
    long countByRecipientAndIsReadFalse(User recipient);
    
    /**
     * Find notifications by type for a specific user
     */
    List<Notification> findByRecipientAndTypeOrderByCreatedAtDesc(User recipient, NotificationType type);
    
    /**
     * Find notifications by priority for a specific user
     */
    List<Notification> findByRecipientAndPriorityOrderByCreatedAtDesc(User recipient, NotificationPriority priority);
    
    /**
     * Find notifications related to a specific entity
     */
    List<Notification> findByEntityTypeAndEntityId(String entityType, Long entityId);
    
    /**
     * Find notifications created after a specific date
     */
    List<Notification> findByCreatedAtAfterOrderByCreatedAtDesc(LocalDateTime afterDate);
    
    /**
     * Mark all notifications as read for a user
     */
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.recipient = :recipient AND n.isRead = false")
    void markAllAsReadForUser(@Param("recipient") User recipient, @Param("readAt") LocalDateTime readAt);
    
    /**
     * Delete old read notifications (cleanup)
     */
    @Query("DELETE FROM Notification n WHERE n.isRead = true AND n.createdAt < :beforeDate")
    void deleteOldReadNotifications(@Param("beforeDate") LocalDateTime beforeDate);
    
    /**
     * Find high priority unread notifications
     */
    List<Notification> findByRecipientAndIsReadFalseAndPriorityInOrderByCreatedAtDesc(
        User recipient, List<NotificationPriority> priorities);
}