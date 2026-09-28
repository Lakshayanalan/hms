package com.hospital.management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.management.entity.MedicalDocument;

@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, Long> {
    
    List<MedicalDocument> findByMedicalRecordRecordIdOrderByUploadedAtDesc(Long medicalRecordId);
    
    List<MedicalDocument> findByMedicalRecordPatientPatientIdOrderByUploadedAtDesc(Long patientId);
    
    List<MedicalDocument> findByDocumentCategoryOrderByUploadedAtDesc(String documentCategory);
    
    List<MedicalDocument> findByUploadedByUserIdOrderByUploadedAtDesc(Long uploadedBy);
    
    @Query("SELECT md FROM MedicalDocument md WHERE md.medicalRecord.patient.patientId = :patientId AND md.documentCategory = :category ORDER BY md.uploadedAt DESC")
    List<MedicalDocument> findByPatientAndCategoryOrderByUploadedAtDesc(@Param("patientId") Long patientId, @Param("category") String category);
    
    @Query("SELECT md FROM MedicalDocument md WHERE md.originalFileName LIKE %:fileName% ORDER BY md.uploadedAt DESC")
    List<MedicalDocument> findByFileNameContainingOrderByUploadedAtDesc(@Param("fileName") String fileName);
    
    @Query("SELECT COUNT(md) FROM MedicalDocument md WHERE md.medicalRecord.patient.patientId = :patientId")
    Long countByPatientId(@Param("patientId") Long patientId);
    
    @Query("SELECT COUNT(md) FROM MedicalDocument md WHERE md.medicalRecord.recordId = :medicalRecordId")
    Long countByMedicalRecordId(@Param("medicalRecordId") Long medicalRecordId);
}