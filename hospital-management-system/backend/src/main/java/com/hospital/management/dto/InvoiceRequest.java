package com.hospital.management.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class InvoiceRequest {
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    private Long appointmentId;
    
    @NotNull(message = "Invoice date is required")
    private LocalDate invoiceDate;
    
    private LocalDate dueDate;
    
    @NotNull(message = "Subtotal is required")
    @DecimalMin(value = "0.00", message = "Subtotal must be non-negative")
    private BigDecimal subtotal;
    
    @DecimalMin(value = "0.00", message = "Tax amount must be non-negative")
    private BigDecimal taxAmount = BigDecimal.ZERO;
    
    @DecimalMin(value = "0.00", message = "Discount amount must be non-negative")
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.00", message = "Total amount must be non-negative")
    private BigDecimal totalAmount;
    
    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    private String description;
    
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;
    
    // Constructors
    public InvoiceRequest() {}
    
    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    
    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }
    
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    
    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}