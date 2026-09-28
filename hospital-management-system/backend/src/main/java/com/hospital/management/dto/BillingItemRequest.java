package com.hospital.management.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class BillingItemRequest {
    
    private Long serviceId;
    
    @NotNull(message = "Service name is required")
    @Size(min = 1, max = 200, message = "Service name must be between 1 and 200 characters")
    private String serviceName;
    
    @Size(max = 50, message = "Service code cannot exceed 50 characters")
    private String serviceCode;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;
    
    @NotNull(message = "Unit price is required")
    private BigDecimal unitPrice;
    
    private BigDecimal discountAmount = BigDecimal.ZERO;
    
    private Boolean isInsuranceCovered = false;
    
    // Constructors
    public BillingItemRequest() {}
    
    public BillingItemRequest(Long serviceId, String serviceName, String serviceCode, 
                             String description, Integer quantity, BigDecimal unitPrice,
                             BigDecimal discountAmount, Boolean isInsuranceCovered) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.serviceCode = serviceCode;
        this.description = description;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.discountAmount = discountAmount;
        this.isInsuranceCovered = isInsuranceCovered;
    }
    
    // Getters and setters
    public Long getServiceId() { 
        return serviceId; 
    }
    
    public void setServiceId(Long serviceId) { 
        this.serviceId = serviceId; 
    }
    
    public String getServiceName() { 
        return serviceName; 
    }
    
    public void setServiceName(String serviceName) { 
        this.serviceName = serviceName; 
    }
    
    public String getServiceCode() { 
        return serviceCode; 
    }
    
    public void setServiceCode(String serviceCode) { 
        this.serviceCode = serviceCode; 
    }
    
    public String getDescription() { 
        return description; 
    }
    
    public void setDescription(String description) { 
        this.description = description; 
    }
    
    public Integer getQuantity() { 
        return quantity; 
    }
    
    public void setQuantity(Integer quantity) { 
        this.quantity = quantity; 
    }
    
    public BigDecimal getUnitPrice() { 
        return unitPrice; 
    }
    
    public void setUnitPrice(BigDecimal unitPrice) { 
        this.unitPrice = unitPrice; 
    }
    
    public BigDecimal getDiscountAmount() { 
        return discountAmount; 
    }
    
    public void setDiscountAmount(BigDecimal discountAmount) { 
        this.discountAmount = discountAmount; 
    }
    
    public Boolean getIsInsuranceCovered() { 
        return isInsuranceCovered; 
    }
    
    public void setIsInsuranceCovered(Boolean isInsuranceCovered) { 
        this.isInsuranceCovered = isInsuranceCovered; 
    }
}