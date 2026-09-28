package com.hospital.management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.management.entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    Optional<Patient> findByPatientNumber(String patientNumber);
    
    Optional<Patient> findByUser_UserId(Long userId);
    
    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.user.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.user.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.patientNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.user.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Patient> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT p FROM Patient p WHERE p.user.isActive = true")
    List<Patient> findAllActivePatients();
    
    @Query("SELECT COUNT(p) FROM Patient p WHERE p.user.isActive = true")
    Long countActivePatients();
    
    boolean existsByPatientNumber(String patientNumber);
    
    // For recent activity
    List<Patient> findTop3ByOrderByCreatedAtDesc();
}