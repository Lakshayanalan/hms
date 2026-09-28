package com.hospital.management.entity;

public enum ChargeType {
    AUTOMATIC("Automatic"),
    MANUAL("Manual"),
    CONSULTATION("Consultation"),
    MEDICATION("Medication"),
    SERVICE("Service"),
    LABORATORY("Laboratory"),
    PROCEDURE("Procedure"),
    EMERGENCY("Emergency"),
    SURGERY("Surgery"),
    IMAGING("Imaging");
    
    private final String displayName;
    
    ChargeType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}