package com.hospital.management.entity;

public enum AppointmentType {
    CONSULTATION("General Consultation"),
    FOLLOW_UP("Follow-up Visit"),
    CHECKUP("Regular Checkup"),
    EMERGENCY("Emergency"),
    VACCINATION("Vaccination"),
    SURGERY("Surgery"),
    THERAPY("Therapy Session"),
    DIAGNOSTIC("Diagnostic Test");
    
    private final String displayName;
    
    AppointmentType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}