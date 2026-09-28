package com.hospital.management.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class DocumentUploadRequest {
    
    @NotNull(message = "Medical record ID is required")
    private Long medicalRecordId;
    
    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;
    
    @Size(max = 50, message = "Document category cannot exceed 50 characters")
    private String documentCategory; // LAB_RESULT, X_RAY, CT_SCAN, MRI, PRESCRIPTION, OTHER
    
    // Constructors
    public DocumentUploadRequest() {}
    
    public DocumentUploadRequest(Long medicalRecordId, String description, String documentCategory) {
        this.medicalRecordId = medicalRecordId;
        this.description = description;
        this.documentCategory = documentCategory;
    }
    
    // Getters and Setters
    public Long getMedicalRecordId() { return medicalRecordId; }
    public void setMedicalRecordId(Long medicalRecordId) { this.medicalRecordId = medicalRecordId; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDocumentCategory() { return documentCategory; }
    public void setDocumentCategory(String documentCategory) { this.documentCategory = documentCategory; }
}