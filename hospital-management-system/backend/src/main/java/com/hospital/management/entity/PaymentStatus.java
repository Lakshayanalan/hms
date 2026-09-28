package com.hospital.management.entity;

public enum PaymentStatus {
    PENDING("Pending"),
    PAID("Paid"), 
    PARTIAL("Partial"),
    REFUNDED("Refunded"),
    CANCELLED("Cancelled"),
    OVERDUE("Overdue");
    
    private final String displayName;
    
    PaymentStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}