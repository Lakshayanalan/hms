package com.hospital.management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.entity.Notification;
import com.hospital.management.entity.User;
import com.hospital.management.service.NotificationService;
import com.hospital.management.service.UserService;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Get all notifications for current user
     */
    @GetMapping
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('PATIENT') or hasRole('RECEPTIONIST')")
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            if (currentUser != null) {
                List<Notification> notifications = notificationService.getNotificationsForUser(currentUser);
                return ResponseEntity.ok(notifications);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get notifications with pagination
     */
    @GetMapping("/paged")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('PATIENT') or hasRole('RECEPTIONIST')")
    public ResponseEntity<Page<Notification>> getMyNotificationsPaged(Pageable pageable, Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            if (currentUser != null) {
                Page<Notification> notifications = notificationService.getNotificationsForUser(currentUser, pageable);
                return ResponseEntity.ok(notifications);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get unread notifications for current user
     */
    @GetMapping("/unread")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('PATIENT') or hasRole('RECEPTIONIST')")
    public ResponseEntity<List<Notification>> getUnreadNotifications(Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            if (currentUser != null) {
                List<Notification> notifications = notificationService.getUnreadNotificationsForUser(currentUser);
                return ResponseEntity.ok(notifications);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get unread notification count
     */
    @GetMapping("/unread-count")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('PATIENT') or hasRole('RECEPTIONIST')")
    public ResponseEntity<Long> getUnreadNotificationCount(Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            if (currentUser != null) {
                long count = notificationService.countUnreadNotifications(currentUser);
                return ResponseEntity.ok(count);
            }
            return ResponseEntity.ok(0L);
        } catch (Exception e) {
            return ResponseEntity.ok(0L);
        }
    }
    
    /**
     * Get high priority notifications
     */
    @GetMapping("/high-priority")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('PATIENT') or hasRole('RECEPTIONIST')")
    public ResponseEntity<List<Notification>> getHighPriorityNotifications(Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            if (currentUser != null) {
                List<Notification> notifications = notificationService.getHighPriorityNotifications(currentUser);
                return ResponseEntity.ok(notifications);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Mark notification as read
     */
    @PutMapping("/{notificationId}/read")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('PATIENT') or hasRole('RECEPTIONIST')")
    public ResponseEntity<Void> markAsRead(@PathVariable Long notificationId) {
        try {
            notificationService.markAsRead(notificationId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Mark all notifications as read
     */
    @PutMapping("/mark-all-read")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('PATIENT') or hasRole('RECEPTIONIST')")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            if (currentUser != null) {
                notificationService.markAllAsRead(currentUser);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}