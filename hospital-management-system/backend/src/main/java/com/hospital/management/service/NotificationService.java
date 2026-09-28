package com.hospital.management.service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Invoice;
import com.hospital.management.entity.Notification;
import com.hospital.management.entity.NotificationPriority;
import com.hospital.management.entity.NotificationType;
import com.hospital.management.entity.User;
import com.hospital.management.repository.NotificationRepository;

@Service
@Transactional
public class NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    /**
     * Create and send a notification
     */
    public Notification createNotification(User recipient, NotificationType type, 
                                         String title, String message, NotificationPriority priority) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(priority != null ? priority : NotificationPriority.NORMAL);
        
        Notification savedNotification = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        sendRealtimeNotification(savedNotification);
        
        return savedNotification;
    }
    
    /**
     * Create notification with entity reference
     */
    public Notification createNotificationWithEntity(User recipient, User sender, NotificationType type,
                                                   String title, String message, String entityType, Long entityId,
                                                   NotificationPriority priority) {
        Notification notification = new Notification();
        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setEntityType(entityType);
        notification.setEntityId(entityId);
        notification.setPriority(priority != null ? priority : NotificationPriority.NORMAL);
        
        Notification savedNotification = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        sendRealtimeNotification(savedNotification);
        
        return savedNotification;
    }
    
    /**
     * Get all notifications for a user
     */
    @Transactional(readOnly = true)
    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
    }
    
    /**
     * Get unread notifications for a user
     */
    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotificationsForUser(User user) {
        return notificationRepository.findByRecipientAndIsReadFalseOrderByCreatedAtDesc(user);
    }
    
    /**
     * Get notifications with pagination
     */
    @Transactional(readOnly = true)
    public Page<Notification> getNotificationsForUser(User user, Pageable pageable) {
        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user, pageable);
    }
    
    /**
     * Count unread notifications
     */
    @Transactional(readOnly = true)
    public long countUnreadNotifications(User user) {
        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }
    
    /**
     * Mark notification as read
     */
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getIsRead()) {
            notification.markAsRead();
            notificationRepository.save(notification);
        }
    }
    
    /**
     * Mark all notifications as read for a user
     */
    public void markAllAsRead(User user) {
        notificationRepository.markAllAsReadForUser(user, LocalDateTime.now());
    }
    
    /**
     * Get high priority notifications
     */
    @Transactional(readOnly = true)
    public List<Notification> getHighPriorityNotifications(User user) {
        List<NotificationPriority> highPriorities = Arrays.asList(
            NotificationPriority.HIGH, NotificationPriority.URGENT
        );
        return notificationRepository.findByRecipientAndIsReadFalseAndPriorityInOrderByCreatedAtDesc(
            user, highPriorities
        );
    }
    
    /**
     * Send real-time notification via WebSocket
     */
    private void sendRealtimeNotification(Notification notification) {
        // Send to specific user channel
        String destination = "/topic/user/" + notification.getRecipient().getUserId() + "/notifications";
        messagingTemplate.convertAndSend(destination, notification);
        
        // Also send to role-based channels if needed
        String roleDestination = "/topic/role/" + notification.getRecipient().getRole().name() + "/notifications";
        messagingTemplate.convertAndSend(roleDestination, notification);
    }
    
    // Specific notification methods for different events
    
    /**
     * Notify doctor about new appointment request
     */
    public void notifyAppointmentRequest(Appointment appointment) {
        String title = "New Appointment Request";
        String message = String.format("Patient %s has requested an appointment on %s", 
            appointment.getPatient().getFullName(), 
            appointment.getAppointmentDateTime().toString());
            
        createNotificationWithEntity(
            appointment.getDoctor(),
            appointment.getCreatedBy(),
            NotificationType.APPOINTMENT_CREATED,
            title,
            message,
            "APPOINTMENT",
            appointment.getAppointmentId(),
            NotificationPriority.NORMAL
        );
    }
    
    /**
     * Notify patient about appointment approval/rejection
     */
    public void notifyAppointmentResponse(Appointment appointment, boolean approved, String reason) {
        User patientUser = appointment.getPatient().getUser(); // Assuming Patient has User relationship
        
        NotificationType type = approved ? NotificationType.APPOINTMENT_APPROVED : NotificationType.APPOINTMENT_REJECTED;
        String title = approved ? "Appointment Approved" : "Appointment Rejected";
        String message = approved 
            ? String.format("Your appointment with Dr. %s has been approved for %s", 
                appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName(),
                appointment.getAppointmentDateTime().toString())
            : String.format("Your appointment request has been rejected. Reason: %s", reason);
            
        NotificationPriority priority = approved ? NotificationPriority.NORMAL : NotificationPriority.HIGH;
        
        createNotificationWithEntity(
            patientUser,
            appointment.getDoctor(),
            type,
            title,
            message,
            "APPOINTMENT",
            appointment.getAppointmentId(),
            priority
        );
    }
    
    /**
     * Notify patient about appointment completion
     */
    public void notifyAppointmentCompletion(Appointment appointment) {
        User patientUser = appointment.getPatient().getUser();
        
        String title = "Appointment Completed";
        String message = String.format("Your appointment with Dr. %s has been completed. Medical records and billing information are available.",
            appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName());
            
        createNotificationWithEntity(
            patientUser,
            appointment.getDoctor(),
            NotificationType.APPOINTMENT_COMPLETED,
            title,
            message,
            "APPOINTMENT",
            appointment.getAppointmentId(),
            NotificationPriority.NORMAL
        );
    }
    
    /**
     * Notify patient about new invoice
     */
    public void notifyInvoiceGenerated(Invoice invoice) {
        User patientUser = invoice.getPatient().getUser();
        
        String title = "New Invoice Generated";
        String message = String.format("A new invoice #%s for $%.2f has been generated for your recent appointment.",
            invoice.getInvoiceNumber(), invoice.getTotalAmount());
            
        createNotificationWithEntity(
            patientUser,
            invoice.getCreatedBy(),
            NotificationType.INVOICE_GENERATED,
            title,
            message,
            "INVOICE",
            invoice.getInvoiceId(),
            NotificationPriority.NORMAL
        );
    }
    
    /**
     * Notify admin about system events
     */
    public void notifyAdminSystemEvent(String title, String message, NotificationPriority priority) {
        // Find admin users and send notification
        // This would require a method to get admin users
        // For now, this is a placeholder
    }
    
    /**
     * Clean up old read notifications (should be called periodically)
     */
    public void cleanupOldNotifications(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        notificationRepository.deleteOldReadNotifications(cutoffDate);
    }
}