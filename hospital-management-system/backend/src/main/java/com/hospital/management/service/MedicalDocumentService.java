package com.hospital.management.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hospital.management.dto.MedicalDocumentResponse;
import com.hospital.management.entity.MedicalDocument;
import com.hospital.management.entity.MedicalRecord;
import com.hospital.management.entity.User;
import com.hospital.management.repository.MedicalDocumentRepository;
import com.hospital.management.repository.MedicalRecordRepository;
import com.hospital.management.repository.UserRepository;

@Service
public class MedicalDocumentService {
    
    @Autowired
    private MedicalDocumentRepository medicalDocumentRepository;
    
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Value("${file.upload-dir:./uploads/medical-documents}")
    private String uploadDir;
    
    public MedicalDocumentResponse uploadDocument(MultipartFile file, Long medicalRecordId, 
                                                 String description, String documentCategory, 
                                                 Long uploadedByUserId) throws IOException {
        
        // Validate medical record exists
        MedicalRecord medicalRecord = medicalRecordRepository.findById(medicalRecordId)
            .orElseThrow(() -> new RuntimeException("Medical record not found with id: " + medicalRecordId));
        
        // Validate user exists
        User uploadedBy = userRepository.findById(uploadedByUserId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + uploadedByUserId));
        
        // Validate file
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload empty file");
        }
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFileName = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
        
        // Save file to disk
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Create document entity
        MedicalDocument document = new MedicalDocument(
            medicalRecord,
            uniqueFileName,
            originalFileName,
            file.getContentType(),
            file.getSize(),
            filePath.toString(),
            uploadedBy
        );
        document.setDescription(description);
        document.setDocumentCategory(documentCategory);
        
        // Save to database
        MedicalDocument savedDocument = medicalDocumentRepository.save(document);
        
        return convertToResponse(savedDocument);
    }
    
    public Optional<MedicalDocumentResponse> getDocumentById(Long documentId) {
        return medicalDocumentRepository.findById(documentId)
            .map(this::convertToResponse);
    }
    
    public List<MedicalDocumentResponse> getDocumentsByMedicalRecord(Long medicalRecordId) {
        return medicalDocumentRepository.findByMedicalRecordRecordIdOrderByUploadedAtDesc(medicalRecordId)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public List<MedicalDocumentResponse> getDocumentsByPatient(Long patientId) {
        return medicalDocumentRepository.findByMedicalRecordPatientPatientIdOrderByUploadedAtDesc(patientId)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public List<MedicalDocumentResponse> getDocumentsByCategory(String category) {
        return medicalDocumentRepository.findByDocumentCategoryOrderByUploadedAtDesc(category)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public List<MedicalDocumentResponse> getDocumentsByPatientAndCategory(Long patientId, String category) {
        return medicalDocumentRepository.findByPatientAndCategoryOrderByUploadedAtDesc(patientId, category)
            .stream()
            .map(this::convertToResponse)
            .collect(Collectors.toList());
    }
    
    public Resource downloadDocument(Long documentId) throws IOException {
        MedicalDocument document = medicalDocumentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));
        
        Path filePath = Paths.get(document.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        
        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new IOException("Could not read file: " + document.getFileName());
        }
    }
    
    public void deleteDocument(Long documentId) throws IOException {
        MedicalDocument document = medicalDocumentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));
        
        // Delete file from disk
        Path filePath = Paths.get(document.getFilePath());
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
        
        // Delete from database
        medicalDocumentRepository.delete(document);
    }
    
    public MedicalDocumentResponse updateDocumentDetails(Long documentId, String description, String documentCategory) {
        MedicalDocument document = medicalDocumentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found with id: " + documentId));
        
        document.setDescription(description);
        document.setDocumentCategory(documentCategory);
        
        MedicalDocument updatedDocument = medicalDocumentRepository.save(document);
        return convertToResponse(updatedDocument);
    }
    
    public Long getDocumentCountByPatient(Long patientId) {
        return medicalDocumentRepository.countByPatientId(patientId);
    }
    
    public Long getDocumentCountByMedicalRecord(Long medicalRecordId) {
        return medicalDocumentRepository.countByMedicalRecordId(medicalRecordId);
    }
    
    private MedicalDocumentResponse convertToResponse(MedicalDocument document) {
        return new MedicalDocumentResponse(
            document.getDocumentId(),
            document.getMedicalRecord().getRecordId(),
            document.getFileName(),
            document.getOriginalFileName(),
            document.getFileType(),
            document.getFileSize(),
            document.getFilePath(),
            document.getDescription(),
            document.getDocumentCategory(),
            document.getUploadedBy().getUsername(),
            document.getUploadedBy().getUserId(),
            document.getUploadedAt()
        );
    }
}