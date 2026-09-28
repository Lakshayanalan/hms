package com.hospital.management.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "notifications")
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long notificationId;
    
    @ManyToOne
    @JoinColumn(name = "recipient_user_id", nullable = false)
    @NotNull
    private User recipient;
    
    @ManyToOne
    @JoinColumn(name = "sender_user_id")
    private User sender;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    @NotNull
    private NotificationType type;
    
    @NotNull
    @Size(max = 200)
    @Column(name = "title")
    private String title;
    
    @NotNull
    @Size(max = 1000)
    @Column(name = "message", columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "entity_type")
    private String entityType; // "APPOINTMENT", "INVOICE", "MEDICAL_RECORD"
    
    @Column(name = "entity_id")
    private Long entityId; // ID of the related entity
    
    @Column(name = "is_read")
    private Boolean isRead = false;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private NotificationPriority priority = NotificationPriority.NORMAL;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "read_at")
    private LocalDateTime readAt;
    
    // Constructors
    public Notification() {}
    
    public Notification(User recipient, NotificationType type, String title, String message) {
        this.recipient = recipient;
        this.type = type;
        this.title = title;
        this.message = message;
    }
    
    public Notification(User recipient, User sender, NotificationType type, String title, 
                       String message, String entityType, Long entityId) {
        this.recipient = recipient;
        this.sender = sender;
        this.type = type;
        this.title = title;
        this.message = message;
        this.entityType = entityType;
        this.entityId = entityId;
    }
    
    // Getters and Setters
    public Long getNotificationId() { return notificationId; }
    public void setNotificationId(Long notificationId) { this.notificationId = notificationId; }
    
    public User getRecipient() { return recipient; }
    public void setRecipient(User recipient) { this.recipient = recipient; }
    
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    
    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    
    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    
    public Boolean getIsRead() { return isRead; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    
    public NotificationPriority getPriority() { return priority; }
    public void setPriority(NotificationPriority priority) { this.priority = priority; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getReadAt() { return readAt; }
    public void setReadAt(LocalDateTime readAt) { this.readAt = readAt; }
    
    // Helper method to mark as read
    public void markAsRead() {
        this.isRead = true;
        this.readAt = LocalDateTime.now();
    }
}