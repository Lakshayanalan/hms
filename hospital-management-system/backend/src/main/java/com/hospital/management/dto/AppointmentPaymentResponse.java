package com.hospital.management.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.hospital.management.entity.AppointmentStatus;
import com.hospital.management.entity.AppointmentType;
import com.hospital.management.entity.PaymentMethod;
import com.hospital.management.entity.PaymentStatus;

/**
 * Response DTO for appointment booking with payment processing
 */
public class AppointmentPaymentResponse {
    
    // Appointment details
    private Long appointmentId;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private LocalDateTime appointmentDateTime;
    private Integer durationMinutes;
    private AppointmentType appointmentType;
    private String reason;
    private String notes;
    private AppointmentStatus status;
    private LocalDateTime createdAt;
    
    // Payment details
    private Long paymentId;
    private Long invoiceId;
    private BigDecimal paymentAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String paymentReferenceNumber;
    private String paymentNotes;
    private LocalDateTime paymentDate;
    
    // Success indicators
    private boolean paymentSuccessful;
    private boolean appointmentConfirmed;
    private String message;
    
    // Constructors
    public AppointmentPaymentResponse() {}
    
    // Getters and Setters
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    
    public LocalDateTime getAppointmentDateTime() { return appointmentDateTime; }
    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }
    
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    
    public AppointmentType getAppointmentType() { return appointmentType; }
    public void setAppointmentType(AppointmentType appointmentType) { this.appointmentType = appointmentType; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }
    
    public Long getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Long invoiceId) { this.invoiceId = invoiceId; }
    
    public BigDecimal getPaymentAmount() { return paymentAmount; }
    public void setPaymentAmount(BigDecimal paymentAmount) { this.paymentAmount = paymentAmount; }
    
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public String getPaymentReferenceNumber() { return paymentReferenceNumber; }
    public void setPaymentReferenceNumber(String paymentReferenceNumber) { this.paymentReferenceNumber = paymentReferenceNumber; }
    
    public String getPaymentNotes() { return paymentNotes; }
    public void setPaymentNotes(String paymentNotes) { this.paymentNotes = paymentNotes; }
    
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
    
    public boolean isPaymentSuccessful() { return paymentSuccessful; }
    public void setPaymentSuccessful(boolean paymentSuccessful) { this.paymentSuccessful = paymentSuccessful; }
    
    public boolean isAppointmentConfirmed() { return appointmentConfirmed; }
    public void setAppointmentConfirmed(boolean appointmentConfirmed) { this.appointmentConfirmed = appointmentConfirmed; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}