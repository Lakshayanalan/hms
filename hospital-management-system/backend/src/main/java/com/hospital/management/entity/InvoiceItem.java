package com.hospital.management.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "invoice_items")
public class InvoiceItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;
    
    @ManyToOne
    @JoinColumn(name = "invoice_id", nullable = false)
    @NotNull
    private Invoice invoice;
    
    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;
    
    @Size(max = 100)
    @Column(name = "service_name")
    private String serviceName;
    
    @Size(max = 20)
    @Column(name = "service_code")
    private String serviceCode;
    
    @Size(max = 500)
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
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
    
    @NotNull
    @DecimalMin(value = "0.00", message = "Total amount must be non-negative")
    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "is_insurance_covered")
    private Boolean isInsuranceCovered = false;
    
    @DecimalMin(value = "0.00", message = "Insurance coverage amount must be non-negative")
    @Column(name = "insurance_coverage", precision = 10, scale = 2)
    private BigDecimal insuranceCoverage = BigDecimal.ZERO;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public InvoiceItem() {}
    
    public InvoiceItem(Invoice invoice, Service service, Integer quantity, 
                       BigDecimal unitPrice, String description) {
        this.invoice = invoice;
        this.service = service;
        this.serviceName = service.getServiceName();
        this.serviceCode = service.getServiceCode();
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.description = description;
        calculateTotals();
    }
    
    // Getters and Setters
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    
    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }
    
    public Service getService() { return service; }
    public void setService(Service service) { 
        this.service = service;
        if (service != null) {
            this.serviceName = service.getServiceName();
            this.serviceCode = service.getServiceCode();
        }
    }
    
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    
    public String getServiceCode() { return serviceCode; }
    public void setServiceCode(String serviceCode) { this.serviceCode = serviceCode; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { 
        this.quantity = quantity;
        calculateTotals();
    }
    
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { 
        this.unitPrice = unitPrice;
        calculateTotals();
    }
    
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { 
        this.discountAmount = discountAmount;
        calculateTotals();
    }
    
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal taxAmount) { this.taxAmount = taxAmount; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public Boolean getIsInsuranceCovered() { return isInsuranceCovered; }
    public void setIsInsuranceCovered(Boolean isInsuranceCovered) { 
        this.isInsuranceCovered = isInsuranceCovered;
        calculateTotals();
    }
    
    public BigDecimal getInsuranceCoverage() { return insuranceCoverage; }
    public void setInsuranceCoverage(BigDecimal insuranceCoverage) { this.insuranceCoverage = insuranceCoverage; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public BigDecimal getSubtotal() {
        return unitPrice.multiply(new BigDecimal(quantity));
    }
    
    public BigDecimal getLineTotal() {
        BigDecimal subtotal = getSubtotal();
        BigDecimal afterDiscount = subtotal.subtract(discountAmount);
        return afterDiscount.add(taxAmount);
    }
    
    public void calculateTotals() {
        if (unitPrice != null && quantity != null) {
            BigDecimal subtotal = getSubtotal();
            
            // Apply insurance discount if covered
            if (isInsuranceCovered && service != null) {
                BigDecimal insuranceDiscount = subtotal.multiply(new BigDecimal("0.2")); // 20% insurance discount
                this.insuranceCoverage = insuranceDiscount;
                this.discountAmount = this.discountAmount.add(insuranceDiscount);
            }
            
            // Calculate tax if service is taxable
            if (service != null && service.getIsTaxable()) {
                BigDecimal taxableAmount = subtotal.subtract(discountAmount);
                this.taxAmount = service.calculateTaxAmount(taxableAmount);
            }
            
            this.totalAmount = getLineTotal();
        }
    }
}