package com.hospital.management.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "medical_documents")
public class MedicalDocument {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "document_id")
    private Long documentId;
    
    @ManyToOne
    @JoinColumn(name = "medical_record_id", nullable = false)
    @NotNull
    private MedicalRecord medicalRecord;
    
    @NotBlank
    @Size(max = 255)
    @Column(name = "file_name")
    private String fileName;
    
    @NotBlank
    @Size(max = 255)
    @Column(name = "original_file_name")
    private String originalFileName;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "file_type")
    private String fileType;
    
    @NotNull
    @Column(name = "file_size")
    private Long fileSize;
    
    @NotBlank
    @Size(max = 500)
    @Column(name = "file_path")
    private String filePath;
    
    @Size(max = 500)
    @Column(name = "description")
    private String description;
    
    @Column(name = "document_category")
    private String documentCategory; // LAB_RESULT, X_RAY, CT_SCAN, MRI, PRESCRIPTION, OTHER
    
    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;
    
    @CreationTimestamp
    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt;
    
    // Constructors
    public MedicalDocument() {}
    
    public MedicalDocument(MedicalRecord medicalRecord, String fileName, String originalFileName, 
                          String fileType, Long fileSize, String filePath, User uploadedBy) {
        this.medicalRecord = medicalRecord;
        this.fileName = fileName;
        this.originalFileName = originalFileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.filePath = filePath;
        this.uploadedBy = uploadedBy;
    }
    
    // Getters and Setters
    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) { this.documentId = documentId; }
    
    public MedicalRecord getMedicalRecord() { return medicalRecord; }
    public void setMedicalRecord(MedicalRecord medicalRecord) { this.medicalRecord = medicalRecord; }
    
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
    
    public User getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }
    
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}