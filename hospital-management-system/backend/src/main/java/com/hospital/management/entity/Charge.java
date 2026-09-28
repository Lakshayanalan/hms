package com.hospital.management.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "charges")
public class Charge {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "charge_id")
    private Long chargeId;
    
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @NotNull
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    @NotNull
    private Service service;
    
    @NotNull
    @Min(value = 1, message = "Quantity must be at least 1")
    @Column(name = "quantity")
    private Integer quantity;
    
    @NotNull
    @DecimalMin(value = "0.00", message = "Unit price must be non-negative")
    @Column(name = "unit_price", precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @DecimalMin(value = "0.00", message = "Discount amount must be non-negative")
    @Column(name = "discount_amount", precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    @DecimalMin(value = "0.00", message = "Tax amount must be non-negative")
    @Column(name = "tax_amount", precision = 10, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;
    
    @DecimalMin(value = "0.00", message = "Insurance coverage must be non-negative")
    @Column(name = "insurance_coverage", precision = 10, scale = 2)
    private BigDecimal insuranceCoverage = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ChargeStatus status = ChargeStatus.PENDING;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "charge_type")
    private ChargeType chargeType = ChargeType.MANUAL;
    
    @Size(max = 500)
    @Column(name = "notes")
    private String notes;
    
    @Size(max = 100)
    @Column(name = "reference_id")
    private String referenceId; // Reference to prescription, lab order, etc.
    
    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;
    
    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice; // Null until billed
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Charge() {}
    
    public Charge(Patient patient, Service service, Integer quantity, BigDecimal unitPrice, 
                  ChargeType chargeType, User createdBy) {
        this.patient = patient;
        this.service = service;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.chargeType = chargeType;
        this.createdBy = createdBy;
    }
    
    // Getters and Setters
    public Long getChargeId() { return chargeId; }
    public void setChargeId(Long chargeId) { this.chargeId = chargeId; }
    
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    
    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    
    public Service getService() { return service; }
    public void setService(Service service) { this.service = service; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    
    public BigDecimal getInsuranceCoverage() { return insuranceCoverage; }
    public void setInsuranceCoverage(BigDecimal insuranceCoverage) { this.insuranceCoverage = insuranceCoverage; }
    
    public ChargeStatus getStatus() { return status; }
    public void setStatus(ChargeStatus status) { this.status = status; }
    
    public ChargeType getChargeType() { return chargeType; }
    public void setChargeType(ChargeType chargeType) { this.chargeType = chargeType; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getReferenceId() { return referenceId; }
    public void setReferenceId(String referenceId) { this.referenceId = referenceId; }
    
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
    
    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Business methods
    public BigDecimal getSubtotal() {
        return unitPrice.multiply(BigDecimal.valueOf(quantity));
    }
    
    public BigDecimal getTotal() {
        return getSubtotal()
            .subtract(discountAmount)
            .subtract(insuranceCoverage)
            .add(taxAmount);
    }
    
    public boolean canBeBilled() {
        return status == ChargeStatus.PENDING && invoice == null;
    }
    
    public void markAsBilled(Invoice invoice) {
        this.invoice = invoice;
        this.status = ChargeStatus.BILLED;
    }
    
    public void markAsPaid() {
        this.status = ChargeStatus.PAID;
    }
    
    public void markAsCancelled() {
        this.status = ChargeStatus.CANCELLED;
    }
}