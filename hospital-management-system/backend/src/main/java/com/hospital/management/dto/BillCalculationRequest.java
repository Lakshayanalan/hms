package com.hospital.management.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BillCalculationRequest {
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    @NotNull(message = "Items list is required")
    @Valid
    private List<BillingItemRequest> items;
    
    private Boolean hasInsurance = false;
    
    @Size(max = 100, message = "Insurance provider name cannot exceed 100 characters")
    private String insuranceProvider;
    
    @Size(max = 50, message = "Insurance policy number cannot exceed 50 characters")
    private String insurancePolicyNumber;
    
    @Size(max = 500, message = "Notes cannot exceed 500 characters")
    private String notes;
    
    // Constructors
    public BillCalculationRequest() {}
    
    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public List<BillingItemRequest> getItems() { return items; }
    public void setItems(List<BillingItemRequest> items) { this.items = items; }
    
    public Boolean getHasInsurance() { return hasInsurance; }
    public void setHasInsurance(Boolean hasInsurance) { this.hasInsurance = hasInsurance; }
    
    public String getInsuranceProvider() { return insuranceProvider; }
    public void setInsuranceProvider(String insuranceProvider) { this.insuranceProvider = insuranceProvider; }
    
    public String getInsurancePolicyNumber() { return insurancePolicyNumber; }
    public void setInsurancePolicyNumber(String insurancePolicyNumber) { this.insurancePolicyNumber = insurancePolicyNumber; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}