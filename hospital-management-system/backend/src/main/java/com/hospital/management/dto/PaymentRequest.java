package com.hospital.management.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.hospital.management.entity.PaymentMethod;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PaymentRequest {
    
    @NotNull(message = "Invoice ID is required")
    private Long invoiceId;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Payment amount must be positive")
    private BigDecimal amount;
    
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    
    @NotNull(message = "Payment date is required")
    private LocalDateTime paymentDate;
    
    @Size(max = 100, message = "Reference number cannot exceed 100 characters")
    private String referenceNumber;
    
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;
    
    // Constructors
    public PaymentRequest() {}
    
    // Getters and Setters
    public Long getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Long invoiceId) { this.invoiceId = invoiceId; }
    
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
    
    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) { this.referenceNumber = referenceNumber; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}