package com.hospital.management.entity;

public enum ChargeStatus {
    PENDING("Pending"),
    BILLED("Billed"),
    PAID("Paid"),
    CANCELLED("Cancelled");
    
    private final String displayName;
    
    ChargeStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}