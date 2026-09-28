package com.hospital.management.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.hospital.management.entity.AppointmentType;
import com.hospital.management.entity.PaymentMethod;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * DTO for creating an appointment with payment processing
 * This allows patients to book and pay for appointments in a single transaction
 */
public class AppointmentPaymentRequest {
    
    // Appointment details
    // Note: patientId will be automatically determined from authenticated user
    private Long patientId;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    @NotNull(message = "Appointment date and time is required")
    @Future(message = "Appointment must be scheduled for a future date")
    private LocalDateTime appointmentDateTime;
    
    @Positive(message = "Duration must be positive")
    private Integer durationMinutes = 30;
    
    private AppointmentType appointmentType = AppointmentType.CONSULTATION;
    
    @Size(max = 500, message = "Reason cannot exceed 500 characters")
    private String reason;
    
    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;
    
    // Payment details
    @NotNull(message = "Payment amount is required")
    @DecimalMin(value = "0.01", message = "Payment amount must be positive")
    private BigDecimal paymentAmount;
    
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    
    @Size(max = 100, message = "Reference number cannot exceed 100 characters")
    private String paymentReferenceNumber;
    
    @Size(max = 500, message = "Payment notes cannot exceed 500 characters")
    private String paymentNotes;
    
    // Constructors
    public AppointmentPaymentRequest() {}
    
    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
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
    
    public BigDecimal getPaymentAmount() { return paymentAmount; }
    public void setPaymentAmount(BigDecimal paymentAmount) { this.paymentAmount = paymentAmount; }
    
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getPaymentReferenceNumber() { return paymentReferenceNumber; }
    public void setPaymentReferenceNumber(String paymentReferenceNumber) { this.paymentReferenceNumber = paymentReferenceNumber; }
    
    public String getPaymentNotes() { return paymentNotes; }
    public void setPaymentNotes(String paymentNotes) { this.paymentNotes = paymentNotes; }
}