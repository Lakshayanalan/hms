package com.hospital.management.entity;

public enum AppointmentStatus {
    REQUESTED("Requested"),           // Patient requested appointment
    PENDING_APPROVAL("Pending Approval"), // Waiting for doctor approval
    APPROVED("Approved"),            // Doctor approved the appointment  
    REJECTED("Rejected"),            // Doctor rejected the appointment
    RESCHEDULED("Rescheduled"),      // Appointment was rescheduled
    CONFIRMED("Confirmed"),          // Final confirmation before appointment
    IN_PROGRESS("In Progress"),      // Appointment is currently happening
    COMPLETED("Completed"),          // Appointment finished successfully
    CANCELLED("Cancelled"),          // Cancelled by patient or system
    NO_SHOW("No Show");             // Patient didn't show up
    
    private final String displayName;
    
    AppointmentStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}