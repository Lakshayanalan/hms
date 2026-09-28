package com.hospital.management.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Visit;
import com.hospital.management.entity.VisitStatus;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    
    List<Visit> findByPatient(Patient patient);
    
    List<Visit> findByPatientOrderByCheckInTimeDesc(Patient patient);
    
    @Query("SELECT v FROM Visit v WHERE v.patient.patientId = :patientId ORDER BY v.checkInTime DESC")
    Page<Visit> findByPatientIdOrderByCheckInTimeDesc(@Param("patientId") Long patientId, 
                                                   Pageable pageable);
    
    List<Visit> findByStatus(VisitStatus status);
    
    @Query("SELECT v FROM Visit v WHERE v.status = :status ORDER BY v.checkInTime DESC")
    Page<Visit> findByStatusOrderByCheckInTimeDesc(@Param("status") VisitStatus status, 
                                                Pageable pageable);
    
    @Query("SELECT v FROM Visit v WHERE v.appointment.appointmentId = :appointmentId")
    Optional<Visit> findByAppointmentId(@Param("appointmentId") Long appointmentId);
    
    @Query("SELECT v FROM Visit v WHERE v.doctor.userId = :doctorId AND v.checkInTime BETWEEN :startDate AND :endDate")
    List<Visit> findByDoctorIdAndDateRange(@Param("doctorId") Long doctorId,
                                          @Param("startDate") LocalDateTime startDate,
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT v FROM Visit v WHERE v.checkInTime BETWEEN :startDate AND :endDate")
    List<Visit> findVisitsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                      @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT v FROM Visit v WHERE v.status = 'IN_PROGRESS'")
    List<Visit> findActiveVisits();
    
    @Query("SELECT COUNT(v) FROM Visit v WHERE v.status = :status")
    Long countByStatus(@Param("status") VisitStatus status);
    
    @Query("SELECT v FROM Visit v WHERE v.patient.patientId = :patientId AND v.status = 'COMPLETED' ORDER BY v.checkInTime DESC")
    List<Visit> findCompletedVisitsForPatient(@Param("patientId") Long patientId);
    
    @Query("SELECT v FROM Visit v WHERE v.doctor.userId = :doctorId AND v.status IN ('SCHEDULED', 'IN_PROGRESS') ORDER BY v.checkInTime ASC")
    List<Visit> findUpcomingVisitsForDoctor(@Param("doctorId") Long doctorId);
}