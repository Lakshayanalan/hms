package com.hospital.management.entity;

public enum NotificationType {
    APPOINTMENT_CREATED("Appointment Created"),
    APPOINTMENT_APPROVED("Appointment Approved"), 
    APPOINTMENT_REJECTED("Appointment Rejected"),
    APPOINTMENT_RESCHEDULED("Appointment Rescheduled"),
    APPOINTMENT_CANCELLED("Appointment Cancelled"),
    APPOINTMENT_REMINDER("Appointment Reminder"),
    APPOINTMENT_COMPLETED("Appointment Completed"),
    
    MEDICAL_RECORD_CREATED("Medical Record Created"),
    MEDICAL_RECORD_UPDATED("Medical Record Updated"),
    
    INVOICE_GENERATED("Invoice Generated"),
    INVOICE_PAID("Invoice Paid"),
    INVOICE_OVERDUE("Invoice Overdue"),
    
    USER_CREATED("User Created"),
    USER_UPDATED("User Updated"),
    
    SYSTEM_ALERT("System Alert"),
    GENERAL_MESSAGE("General Message");
    
    private final String displayName;
    
    NotificationType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}