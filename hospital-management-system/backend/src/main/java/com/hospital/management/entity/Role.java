package com.hospital.management.entity;

public enum Role {
    PATIENT("Patient"),
    RECEPTIONIST("Receptionist"),
    DOCTOR("Doctor"),
    NURSE("Nurse"),
    IT_OFFICER("IT Officer"),
    HOSPITAL_MANAGER("Hospital Manager");
    
    private final String displayName;
    
    Role(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}