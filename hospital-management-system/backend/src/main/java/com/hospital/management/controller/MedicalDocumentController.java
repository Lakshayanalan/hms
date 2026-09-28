package com.hospital.management.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hospital.management.dto.MedicalDocumentResponse;
import com.hospital.management.service.MedicalDocumentService;

@RestController
@RequestMapping("/medical-documents")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalDocumentController {
    
    @Autowired
    private MedicalDocumentService medicalDocumentService;
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("medicalRecordId") Long medicalRecordId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "documentCategory", required = false, defaultValue = "OTHER") String documentCategory,
            @RequestParam("uploadedByUserId") Long uploadedByUserId) {
        
        try {
            MedicalDocumentResponse document = medicalDocumentService.uploadDocument(
                file, medicalRecordId, description, documentCategory, uploadedByUserId);
            return ResponseEntity.status(HttpStatus.CREATED).body(document);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to upload file: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{documentId}")
    public ResponseEntity<?> getDocumentById(@PathVariable Long documentId) {
        return medicalDocumentService.getDocumentById(documentId)
                .map(document -> ResponseEntity.ok().body(document))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/medical-record/{medicalRecordId}")
    public ResponseEntity<List<MedicalDocumentResponse>> getDocumentsByMedicalRecord(@PathVariable Long medicalRecordId) {
        List<MedicalDocumentResponse> documents = medicalDocumentService.getDocumentsByMedicalRecord(medicalRecordId);
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalDocumentResponse>> getDocumentsByPatient(@PathVariable Long patientId) {
        List<MedicalDocumentResponse> documents = medicalDocumentService.getDocumentsByPatient(patientId);
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<MedicalDocumentResponse>> getDocumentsByCategory(@PathVariable String category) {
        List<MedicalDocumentResponse> documents = medicalDocumentService.getDocumentsByCategory(category);
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/patient/{patientId}/category/{category}")
    public ResponseEntity<List<MedicalDocumentResponse>> getDocumentsByPatientAndCategory(
            @PathVariable Long patientId, @PathVariable String category) {
        List<MedicalDocumentResponse> documents = medicalDocumentService.getDocumentsByPatientAndCategory(patientId, category);
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/{documentId}/download")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long documentId) {
        try {
            Resource resource = medicalDocumentService.downloadDocument(documentId);
            
            // Get the document details for the filename
            MedicalDocumentResponse document = medicalDocumentService.getDocumentById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + document.getOriginalFileName() + "\"")
                .header(HttpHeaders.CONTENT_TYPE, document.getFileType())
                .body(resource);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{documentId}")
    public ResponseEntity<?> updateDocumentDetails(
            @PathVariable Long documentId,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "documentCategory", required = false) String documentCategory) {
        
        try {
            MedicalDocumentResponse document = medicalDocumentService.updateDocumentDetails(
                documentId, description, documentCategory);
            return ResponseEntity.ok(document);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{documentId}")
    public ResponseEntity<?> deleteDocument(@PathVariable Long documentId) {
        try {
            medicalDocumentService.deleteDocument(documentId);
            return ResponseEntity.ok().body("Document deleted successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to delete file: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/stats/patient/{patientId}")
    public ResponseEntity<Long> getDocumentCountByPatient(@PathVariable Long patientId) {
        Long count = medicalDocumentService.getDocumentCountByPatient(patientId);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/medical-record/{medicalRecordId}")
    public ResponseEntity<Long> getDocumentCountByMedicalRecord(@PathVariable Long medicalRecordId) {
        Long count = medicalDocumentService.getDocumentCountByMedicalRecord(medicalRecordId);
        return ResponseEntity.ok(count);
    }
}