package com.hospital.management.entity;

public enum ServiceCategory {
    CONSULTATION("Consultation"),
    DIAGNOSTIC("Diagnostic"),
    TREATMENT("Treatment"),
    SURGERY("Surgery"),
    THERAPY("Therapy"),
    LABORATORY("Laboratory"),
    RADIOLOGY("Radiology"),
    PHARMACY("Pharmacy"),
    ROOM_CHARGE("Room Charge"),
    EMERGENCY("Emergency"),
    AMBULANCE("Ambulance"),
    OTHER("Other");
    
    private final String displayName;
    
    ServiceCategory(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    @Override
    public String toString() {
        return displayName;
    }
}