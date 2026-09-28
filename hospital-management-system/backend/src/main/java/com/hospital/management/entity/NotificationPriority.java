package com.hospital.management.entity;

public enum NotificationPriority {
    LOW("Low"),
    NORMAL("Normal"),
    HIGH("High"),
    URGENT("Urgent");
    
    private final String displayName;
    
    NotificationPriority(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}