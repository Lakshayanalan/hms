package com.hospital.management.dto;

import java.time.LocalDateTime;

public class MedicalDocumentResponse {
    
    private Long documentId;
    private Long medicalRecordId;
    private String fileName;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private String filePath;
    private String description;
    private String documentCategory;
    private String uploadedByUsername;
    private Long uploadedById;
    private LocalDateTime uploadedAt;
    
    // Constructors
    public MedicalDocumentResponse() {}
    
    public MedicalDocumentResponse(Long documentId, Long medicalRecordId, String fileName, 
                                  String originalFileName, String fileType, Long fileSize, 
                                  String filePath, String description, String documentCategory,
                                  String uploadedByUsername, Long uploadedById, LocalDateTime uploadedAt) {
        this.documentId = documentId;
        this.medicalRecordId = medicalRecordId;
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.filePath = filePath;
        this.description = description;
        this.documentCategory = documentCategory;
        this.uploadedByUsername = uploadedByUsername;
        this.uploadedById = uploadedById;
        this.uploadedAt = uploadedAt;
    }
    
    // Getters and Setters
    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) { this.documentId = documentId; }
    
    public Long getMedicalRecordId() { return medicalRecordId; }
    public void setMedicalRecordId(Long medicalRecordId) { this.medicalRecordId = medicalRecordId; }
    
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getDocumentCategory() { return documentCategory; }
    public void setDocumentCategory(String documentCategory) { this.documentCategory = documentCategory; }
    
    public String getUploadedByUsername() { return uploadedByUsername; }
    public void setUploadedByUsername(String uploadedByUsername) { this.uploadedByUsername = uploadedByUsername; }
    
    public Long getUploadedById() { return uploadedById; }
    public void setUploadedById(Long uploadedById) { this.uploadedById = uploadedById; }
    
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}