package com.hospital.management.entity;

public enum VisitType {
    CONSULTATION("Consultation"),
    FOLLOW_UP("Follow-up"),
    EMERGENCY("Emergency"),
    ROUTINE_CHECKUP("Routine Checkup"),
    SPECIALIST_VISIT("Specialist Visit"),
    DIAGNOSTIC("Diagnostic"),
    TREATMENT("Treatment");
    
    private final String displayName;
    
    VisitType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}