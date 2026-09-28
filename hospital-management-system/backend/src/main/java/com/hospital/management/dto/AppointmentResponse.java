package com.hospital.management.dto;

import java.time.LocalDateTime;

import com.hospital.management.entity.AppointmentStatus;
import com.hospital.management.entity.AppointmentType;

public class AppointmentResponse {
    
    private Long appointmentId;
    private Long patientId;
    private String patientName;
    private String patientNumber;
    private Long doctorId;
    private String doctorName;
    private LocalDateTime appointmentDateTime;
    private Integer durationMinutes;
    private AppointmentType appointmentType;
    private AppointmentStatus status;
    private String reason;
    private String notes;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public AppointmentResponse() {}
    
    public AppointmentResponse(Long appointmentId, Long patientId, String patientName, 
                              String patientNumber, Long doctorId, String doctorName,
                              LocalDateTime appointmentDateTime, Integer durationMinutes,
                              AppointmentType appointmentType, AppointmentStatus status,
                              String reason, String notes, String createdByName,
                              LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientNumber = patientNumber;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.appointmentDateTime = appointmentDateTime;
        this.durationMinutes = durationMinutes;
        this.appointmentType = appointmentType;
        this.status = status;
        this.reason = reason;
        this.notes = notes;
        this.createdByName = createdByName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    
    public String getPatientNumber() { return patientNumber; }
    public void setPatientNumber(String patientNumber) { this.patientNumber = patientNumber; }
    
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    
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
    
    public String getCreatedByName() { return createdByName; }
    public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper method to get end time
    public LocalDateTime getEndTime() {
        return appointmentDateTime.plusMinutes(durationMinutes != null ? durationMinutes : 30);
    }
}