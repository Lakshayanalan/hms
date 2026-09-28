package com.hospital.management.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DoctorAvailabilityResponse {
    
    private Long doctorId;
    private String doctorName;
    private String specialization;
    private List<TimeSlot> availableSlots;
    
    public static class TimeSlot {
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private boolean isAvailable;
        
        public TimeSlot() {}
        
        public TimeSlot(LocalDateTime startTime, LocalDateTime endTime, boolean isAvailable) {
            this.startTime = startTime;
            this.endTime = endTime;
            this.isAvailable = isAvailable;
        }
        
        // Getters and Setters
        public LocalDateTime getStartTime() { return startTime; }
        public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
        
        public LocalDateTime getEndTime() { return endTime; }
        public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }
        
        public boolean isAvailable() { return isAvailable; }
        public void setAvailable(boolean available) { isAvailable = available; }
    }
    
    // Constructors
    public DoctorAvailabilityResponse() {}
    
    public DoctorAvailabilityResponse(Long doctorId, String doctorName, String specialization, List<TimeSlot> availableSlots) {
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.specialization = specialization;
        this.availableSlots = availableSlots;
    }
    
    // Getters and Setters
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    
    public List<TimeSlot> getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(List<TimeSlot> availableSlots) { this.availableSlots = availableSlots; }
}