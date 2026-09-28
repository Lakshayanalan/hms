package com.hospital.management.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

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
@Table(name = "appointments")
public class Appointment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Long appointmentId;
    
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @NotNull
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @NotNull
    private User doctor; // User with DOCTOR role
    
    @NotNull
    @Column(name = "appointment_date_time")
    private LocalDateTime appointmentDateTime;
    
    @Column(name = "duration_minutes")
    private Integer durationMinutes = 30; // Default 30 minutes
    
    @Enumerated(EnumType.STRING)
    @Column(name = "appointment_type")
    private AppointmentType appointmentType = AppointmentType.CONSULTATION;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private AppointmentStatus status = AppointmentStatus.REQUESTED;
    
    @Size(max = 500)
    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;
    
    @Size(max = 1000)
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    // Approval workflow fields
    @Size(max = 1000)
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
    
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
    
    @Column(name = "rejected_at") 
    private LocalDateTime rejectedAt;
    
    @ManyToOne
    @JoinColumn(name = "approved_by")
    private User approvedBy;
    
    @ManyToOne
    @JoinColumn(name = "rejected_by")
    private User rejectedBy;
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy; // User who created the appointment (could be receptionist, doctor, etc.)
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Appointment() {}
    
    public Appointment(Patient patient, User doctor, LocalDateTime appointmentDateTime,
                      Integer durationMinutes, AppointmentType appointmentType, 
                      String reason, User createdBy) {
        this.patient = patient;
        this.doctor = doctor;
        this.appointmentDateTime = appointmentDateTime;
        this.durationMinutes = durationMinutes;
        this.appointmentType = appointmentType;
        this.reason = reason;
        this.createdBy = createdBy;
    }
    
    // Getters and Setters
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    
    public User getDoctor() { return doctor; }
    public void setDoctor(User doctor) { this.doctor = doctor; }
    
    public LocalDateTime getAppointmentDateTime() { return appointmentDateTime; }
    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }
    
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    
    public AppointmentType getAppointmentType() { return appointmentType; }
    public void setAppointmentType(AppointmentType appointmentType) { this.appointmentType = appointmentType; }
    
    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Workflow fields getters and setters
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    
    public LocalDateTime getRejectedAt() { return rejectedAt; }
    public void setRejectedAt(LocalDateTime rejectedAt) { this.rejectedAt = rejectedAt; }
    
    public User getApprovedBy() { return approvedBy; }
    public void setApprovedBy(User approvedBy) { this.approvedBy = approvedBy; }
    
    public User getRejectedBy() { return rejectedBy; }
    public void setRejectedBy(User rejectedBy) { this.rejectedBy = rejectedBy; }
    
    // Helper methods
    public LocalDateTime getEndTime() {
        return appointmentDateTime.plusMinutes(durationMinutes != null ? durationMinutes : 30);
    }
    
    public boolean isConflictsWith(LocalDateTime startTime, LocalDateTime endTime) {
        LocalDateTime thisEndTime = getEndTime();
        return appointmentDateTime.isBefore(endTime) && thisEndTime.isAfter(startTime);
    }
    
    // Workflow helper methods
    public void approve(User approver) {
        this.status = AppointmentStatus.APPROVED;
        this.approvedBy = approver;
        this.approvedAt = LocalDateTime.now();
    }
    
    public void reject(User rejector, String reason) {
        this.status = AppointmentStatus.REJECTED;
        this.rejectedBy = rejector;
        this.rejectedAt = LocalDateTime.now();
        this.rejectionReason = reason;
    }
    
    public void complete() {
        this.status = AppointmentStatus.COMPLETED;
    }
    
    public boolean canBeApproved() {
        return this.status == AppointmentStatus.REQUESTED || this.status == AppointmentStatus.PENDING_APPROVAL;
    }
    
    public boolean canBeRejected() {
        return this.status == AppointmentStatus.REQUESTED || this.status == AppointmentStatus.PENDING_APPROVAL;
    }
}