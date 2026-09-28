package com.hospital.management.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Prescription;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    
    List<Prescription> findByPatient(Patient patient);
    
    List<Prescription> findByPatientOrderByCreatedAtDesc(Patient patient);
    
    @Query("SELECT p FROM Prescription p WHERE p.patient.patientId = :patientId ORDER BY p.createdAt DESC")
    Page<Prescription> findByPatientIdOrderByCreatedAtDesc(@Param("patientId") Long patientId, 
                                                              Pageable pageable);
    
    @Query("SELECT p FROM Prescription p WHERE p.doctor.userId = :doctorId ORDER BY p.createdAt DESC")
    List<Prescription> findByDoctorId(@Param("doctorId") Long doctorId);
    
    @Query("SELECT p FROM Prescription p WHERE p.visit.visitId = :visitId")
    List<Prescription> findByVisitId(@Param("visitId") Long visitId);
    
    @Query("SELECT p FROM Prescription p WHERE p.patient.patientId = :patientId AND p.createdAt BETWEEN :startDate AND :endDate")
    List<Prescription> findByPatientIdAndDateRange(@Param("patientId") Long patientId,
                                                  @Param("startDate") LocalDateTime startDate,
                                                  @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Prescription p WHERE p.doctor.userId = :doctorId AND p.createdAt BETWEEN :startDate AND :endDate")
    List<Prescription> findByDoctorIdAndDateRange(@Param("doctorId") Long doctorId,
                                                 @Param("startDate") LocalDateTime startDate,
                                                 @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Prescription p WHERE p.createdAt BETWEEN :startDate AND :endDate ORDER BY p.createdAt DESC")
    List<Prescription> findPrescriptionsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                                    @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.doctor.userId = :doctorId")
    Long countByDoctorId(@Param("doctorId") Long doctorId);
    
    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.patient.patientId = :patientId")
    Long countByPatientId(@Param("patientId") Long patientId);
}