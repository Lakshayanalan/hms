package com.hospital.management.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.management.entity.Charge;
import com.hospital.management.entity.ChargeStatus;
import com.hospital.management.entity.Patient;

@Repository
public interface ChargeRepository extends JpaRepository<Charge, Long> {
    
    List<Charge> findByPatientAndStatus(Patient patient, ChargeStatus status);
    
    List<Charge> findByPatientAndStatusOrderByCreatedAtDesc(Patient patient, ChargeStatus status);
    
    @Query("SELECT c FROM Charge c WHERE c.patient.patientId = :patientId AND c.status = :status")
    Page<Charge> findByPatientIdAndStatus(@Param("patientId") Long patientId, 
                                        @Param("status") ChargeStatus status, 
                                        Pageable pageable);
    
    @Query("SELECT c FROM Charge c WHERE c.status = :status ORDER BY c.createdAt DESC")
    Page<Charge> findByStatusOrderByCreatedAtDesc(@Param("status") ChargeStatus status, 
                                                 Pageable pageable);
    
    @Query("SELECT c FROM Charge c WHERE c.appointment.appointmentId = :appointmentId")
    List<Charge> findByAppointmentId(@Param("appointmentId") Long appointmentId);
    
    @Query("SELECT c FROM Charge c WHERE c.invoice IS NULL AND c.status = 'PENDING'")
    List<Charge> findPendingChargesNotBilled();
    
    @Query("SELECT c FROM Charge c WHERE c.patient.patientId = :patientId AND c.invoice IS NULL AND c.status = 'PENDING'")
    List<Charge> findPendingChargesForPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT COUNT(c) FROM Charge c WHERE c.status = :status")
    Long countByStatus(@Param("status") ChargeStatus status);
    
    @Query("SELECT c FROM Charge c WHERE c.createdAt BETWEEN :startDate AND :endDate")
    List<Charge> findChargesBetweenDates(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
}