package com.hospital.management.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.MedicalRecord;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.User;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
    // Find medical records by patient
    List<MedicalRecord> findByPatientOrderByRecordDateDesc(Patient patient);
    
    // Find medical records by doctor
    List<MedicalRecord> findByDoctorOrderByRecordDateDesc(User doctor);
    
    // Find medical records by appointment
    List<MedicalRecord> findByAppointment(Appointment appointment);
    
    // Find medical records by patient and date range
    List<MedicalRecord> findByPatientAndRecordDateBetween(Patient patient, 
                                                         LocalDateTime startDate, 
                                                         LocalDateTime endDate);
    
    // Find medical records by doctor and date range
    List<MedicalRecord> findByDoctorAndRecordDateBetween(User doctor, 
                                                        LocalDateTime startDate, 
                                                        LocalDateTime endDate);
    
    // Search medical records by patient name, doctor name, or diagnosis
    @Query("SELECT mr FROM MedicalRecord mr WHERE " +
           "LOWER(CONCAT(mr.patient.user.firstName, ' ', mr.patient.user.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(CONCAT(mr.doctor.firstName, ' ', mr.doctor.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mr.patient.patientNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mr.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(mr.diagnosis) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<MedicalRecord> searchMedicalRecords(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Find recent medical records (last 30 days)
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.recordDate >= :thirtyDaysAgo ORDER BY mr.recordDate DESC")
    List<MedicalRecord> findRecentMedicalRecords(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);
    
    // Count medical records by patient
    long countByPatient(Patient patient);
    
    // Count medical records by doctor
    long countByDoctor(User doctor);
    
    // Find medical records with specific diagnosis
    @Query("SELECT mr FROM MedicalRecord mr WHERE LOWER(mr.diagnosis) LIKE LOWER(CONCAT('%', :diagnosis, '%'))")
    List<MedicalRecord> findByDiagnosisContaining(@Param("diagnosis") String diagnosis);
    
    // Find medical records by patient with pagination
    Page<MedicalRecord> findByPatientOrderByRecordDateDesc(Patient patient, Pageable pageable);
    
    // Find medical records by doctor with pagination  
    Page<MedicalRecord> findByDoctorOrderByRecordDateDesc(User doctor, Pageable pageable);
    
    // Get patient's medical history summary
    @Query("SELECT mr FROM MedicalRecord mr WHERE mr.patient = :patient AND mr.diagnosis IS NOT NULL AND mr.diagnosis != '' ORDER BY mr.recordDate DESC")
    List<MedicalRecord> findPatientMedicalHistory(@Param("patient") Patient patient);
}