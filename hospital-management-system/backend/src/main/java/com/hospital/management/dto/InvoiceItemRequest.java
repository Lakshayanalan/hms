package com.hospital.management.dto;

import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class InvoiceItemRequest {
    
    private Long serviceId;
    
    @Size(max = 100, message = "Service name cannot exceed 100 characters")
    private String serviceName;
    
    @Size(max = 20, message = "Service code cannot exceed 20 characters")
    private String serviceCode;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    
    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.00", message = "Unit price must be non-negative")
    private BigDecimal unitPrice;
    
    @DecimalMin(value = "0.00", message = "Discount amount must be non-negative")
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    private Boolean isInsuranceCovered = false;
    
    // Constructors
    public InvoiceItemRequest() {}
    
    // Getters and Setters
    public Long getServiceId() { return serviceId; }
    public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
    
    public String getServiceName() { return serviceName; }
    public void setServiceName(String serviceName) { this.serviceName = serviceName; }
    
    public String getServiceCode() { return serviceCode; }
    public void setServiceCode(String serviceCode) { this.serviceCode = serviceCode; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public BigDecimal getUnitPrice() { return unitPrice; }
    public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
    
    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
    
    public Boolean getIsInsuranceCovered() { return isInsuranceCovered; }
    public void setIsInsuranceCovered(Boolean isInsuranceCovered) { this.isInsuranceCovered = isInsuranceCovered; }
}