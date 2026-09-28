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
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "services")
public class Service {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "service_id")
    private Long serviceId;
    
    @NotNull
    @Size(max = 100)
    @Column(name = "service_name")
    private String serviceName;
    
    @Size(max = 20)
    @Column(name = "service_code", unique = true)
    private String serviceCode;
    
    @Size(max = 500)
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "category")
    private ServiceCategory category;
    
    @NotNull
    @DecimalMin(value = "0.00", message = "Base price must be non-negative")
    @Column(name = "base_price", precision = 10, scale = 2)
    private BigDecimal basePrice;
    
    @DecimalMin(value = "0.00", message = "Insurance price must be non-negative")
    @Column(name = "insurance_price", precision = 10, scale = 2)
    private BigDecimal insurancePrice;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "is_taxable")
    private Boolean isTaxable = false;
    
    @DecimalMin(value = "0.00", message = "Tax rate must be non-negative")
    @Column(name = "tax_rate", precision = 5, scale = 2)
    private BigDecimal taxRate = BigDecimal.ZERO;
    
    @Size(max = 50)
    @Column(name = "unit")
    private String unit = "Each";
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Service() {}
    
    public Service(String serviceName, String serviceCode, ServiceCategory category, 
                   BigDecimal basePrice, String description) {
        this.serviceName = serviceName;
        this.serviceCode = serviceCode;
        this.category = category;
        this.basePrice = basePrice;
        this.description = description;
        this.insurancePrice = basePrice.multiply(new BigDecimal("0.8")); // 20% discount for insurance
    }
    
    // Getters and Setters
    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    
    public String getServiceCode() { return serviceCode; }
    public void setServiceCode(String serviceCode) { this.serviceCode = serviceCode; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ServiceCategory getCategory() { return category; }
    public void setCategory(ServiceCategory category) { this.category = category; }
    
    public BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(BigDecimal basePrice) { this.basePrice = basePrice; }
    
    public BigDecimal getInsurancePrice() { return insurancePrice; }
    public void setInsurancePrice(BigDecimal insurancePrice) { this.insurancePrice = insurancePrice; }
    
    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    
    public Boolean getIsTaxable() { return isTaxable; }
    public void setIsTaxable(Boolean isTaxable) { this.isTaxable = isTaxable; }
    
    public BigDecimal getTaxRate() { return taxRate; }
    public void setTaxRate(BigDecimal taxRate) { this.taxRate = taxRate; }
    
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Helper methods
    public BigDecimal getEffectivePrice(boolean hasInsurance) {
        return hasInsurance && insurancePrice != null ? insurancePrice : basePrice;
    }
    
    public BigDecimal calculateTaxAmount(BigDecimal baseAmount) {
        return isTaxable ? baseAmount.multiply(taxRate.divide(new BigDecimal("100"))) : BigDecimal.ZERO;
    }
}