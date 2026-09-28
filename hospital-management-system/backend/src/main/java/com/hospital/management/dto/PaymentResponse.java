package com.hospital.management.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.hospital.management.entity.PaymentMethod;

public class PaymentResponse {
    
    private Long paymentId;
    private Long invoiceId;
    private String invoiceNumber;
    private String paymentNumber;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private LocalDateTime paymentDate;
    private String referenceNumber;
    private String notes;
    private String processedByName;
    private LocalDateTime createdAt;
    
    // Constructors
    public PaymentResponse() {}
    
    // Getters and Setters
    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }
    
    public Long getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Long invoiceId) { this.invoiceId = invoiceId; }
    
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    
    public String getPaymentNumber() { return paymentNumber; }
    public void setPaymentNumber(String paymentNumber) { this.paymentNumber = paymentNumber; }
    
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
    
    public String getProcessedByName() { return processedByName; }
    public void setProcessedByName(String processedByName) { this.processedByName = processedByName; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}