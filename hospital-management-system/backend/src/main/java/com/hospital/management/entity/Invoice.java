package com.hospital.management.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "invoices")
public class Invoice {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invoice_id")
    private Long invoiceId;
    
    @NotNull
    @Size(max = 20)
    @Column(name = "invoice_number", unique = true)
    private String invoiceNumber;
    
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @NotNull
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @NotNull
    @Column(name = "invoice_date")
    private LocalDate invoiceDate;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @NotNull
    @DecimalMin(value = "0.00", message = "Subtotal must be non-negative")
    @Column(name = "subtotal", precision = 10, scale = 2)
    private BigDecimal subtotal;
    
    @DecimalMin(value = "0.00", message = "Tax amount must be non-negative")
    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;
    
    @DecimalMin(value = "0.00", message = "Discount amount must be non-negative")
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @NotNull
    @DecimalMin(value = "0.00", message = "Total amount must be non-negative")
    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    @Size(max = 1000)
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Size(max = 500)
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InvoiceItem> invoiceItems = new ArrayList<>();
    
    @Column(name = "has_insurance")
    private Boolean hasInsurance = false;
    
    @Size(max = 100)
    @Column(name = "insurance_provider")
    private String insuranceProvider;
    
    @Size(max = 50)
    @Column(name = "insurance_policy_number")
    private String insurancePolicyNumber;
    
    @DecimalMin(value = "0.00", message = "Insurance coverage must be non-negative")
    @Column(name = "insurance_coverage_amount", precision = 10, scale = 2)
    private BigDecimal insuranceCoverageAmount = BigDecimal.ZERO;
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Invoice() {}
    
    public Invoice(String invoiceNumber, Patient patient, LocalDate invoiceDate,
                   BigDecimal subtotal, BigDecimal totalAmount, String description,
                   User createdBy) {
        this.invoiceNumber = invoiceNumber;
        this.patient = patient;
        this.invoiceDate = invoiceDate;
        this.subtotal = subtotal;
        this.totalAmount = totalAmount;
        this.description = description;
        this.createdBy = createdBy;
        // Set due date to 30 days from invoice date by default
        this.dueDate = invoiceDate.plusDays(30);
    }
    
    // Getters and Setters
    public Long getInvoiceId() { return invoiceId; }
    public void setInvoiceId(Long invoiceId) { this.invoiceId = invoiceId; }
    
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    
    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    
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
    
    public PaymentStatus getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    public List<InvoiceItem> getInvoiceItems() { return invoiceItems; }
    public void setInvoiceItems(List<InvoiceItem> invoiceItems) { this.invoiceItems = invoiceItems; }
    
    public Boolean getHasInsurance() { return hasInsurance; }
    public void setHasInsurance(Boolean hasInsurance) { this.hasInsurance = hasInsurance; }
    
    public String getInsuranceProvider() { return insuranceProvider; }
    public void setInsuranceProvider(String insuranceProvider) { this.insuranceProvider = insuranceProvider; }
    
    public String getInsurancePolicyNumber() { return insurancePolicyNumber; }
    public void setInsurancePolicyNumber(String insurancePolicyNumber) { this.insurancePolicyNumber = insurancePolicyNumber; }
    
    public BigDecimal getInsuranceCoverageAmount() { return insuranceCoverageAmount; }
    public void setInsuranceCoverageAmount(BigDecimal insuranceCoverageAmount) { this.insuranceCoverageAmount = insuranceCoverageAmount; }
    
    // Helper methods
    public boolean isOverdue() {
        return paymentStatus == PaymentStatus.PENDING && 
               dueDate != null && 
               LocalDate.now().isAfter(dueDate);
    }
    
    public BigDecimal getPaidAmount() {
        // This could be calculated from payment records
        return paymentStatus == PaymentStatus.PAID ? totalAmount : BigDecimal.ZERO;
    }
    
    public BigDecimal getOutstandingAmount() {
        return totalAmount.subtract(getPaidAmount());
    }
    
    public void addInvoiceItem(InvoiceItem item) {
        invoiceItems.add(item);
        item.setInvoice(this);
        recalculateTotals();
    }
    
    public void removeInvoiceItem(InvoiceItem item) {
        invoiceItems.remove(item);
        item.setInvoice(null);
        recalculateTotals();
    }
    
    public void recalculateTotals() {
        if (invoiceItems == null || invoiceItems.isEmpty()) {
            return;
        }
        
        BigDecimal newSubtotal = BigDecimal.ZERO;
        BigDecimal newTaxAmount = BigDecimal.ZERO;
        BigDecimal newDiscountAmount = BigDecimal.ZERO;
        BigDecimal newInsuranceCoverage = BigDecimal.ZERO;
        
        for (InvoiceItem item : invoiceItems) {
            newSubtotal = newSubtotal.add(item.getSubtotal());
            newTaxAmount = newTaxAmount.add(item.getTaxAmount());
            newDiscountAmount = newDiscountAmount.add(item.getDiscountAmount());
            newInsuranceCoverage = newInsuranceCoverage.add(item.getInsuranceCoverage());
        }
        
        this.subtotal = newSubtotal;
        this.taxAmount = newTaxAmount;
        this.discountAmount = newDiscountAmount;
        this.insuranceCoverageAmount = newInsuranceCoverage;
        this.totalAmount = newSubtotal.subtract(newDiscountAmount).add(newTaxAmount);
    }
}