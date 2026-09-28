package com.hospital.management.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.AppointmentStatus;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.User;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    // Find appointments by patient
    List<Appointment> findByPatientOrderByAppointmentDateTimeDesc(Patient patient);
    
    // Find appointments by doctor
    List<Appointment> findByDoctorOrderByAppointmentDateTimeAsc(User doctor);
    
    // Find appointments by doctor and date
    List<Appointment> findByDoctorAndAppointmentDateTimeBetween(
        User doctor, LocalDateTime startDate, LocalDateTime endDate);
    
    // Find appointments by patient and status
    List<Appointment> findByPatientAndStatus(Patient patient, AppointmentStatus status);
    
    // Find appointments by doctor and status
    List<Appointment> findByDoctorAndStatus(User doctor, AppointmentStatus status);
    
    // Find appointments by status
    Page<Appointment> findByStatus(AppointmentStatus status, Pageable pageable);
    
    // Find appointments for a specific date
    @Query("SELECT a FROM Appointment a WHERE DATE(a.appointmentDateTime) = :date ORDER BY a.appointmentDateTime")
    List<Appointment> findAppointmentsByDate(@Param("date") LocalDate date);
    
    // Find appointments in date range
    List<Appointment> findByAppointmentDateTimeBetween(LocalDateTime start, LocalDateTime end);
    
    // Find appointments in date range with specific status
    List<Appointment> findByAppointmentDateTimeBetweenAndStatus(LocalDateTime start, LocalDateTime end, AppointmentStatus status);
    

    
    // Search appointments by patient name or doctor name
    @Query("SELECT a FROM Appointment a WHERE " +
           "LOWER(CONCAT(a.patient.user.firstName, ' ', a.patient.user.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(CONCAT(a.doctor.firstName, ' ', a.doctor.lastName)) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.patient.patientNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Appointment> searchAppointments(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    // Count appointments by status
    long countByStatus(AppointmentStatus status);
    
    // Find upcoming appointments (next 7 days)
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDateTime BETWEEN CURRENT_TIMESTAMP AND :endDate " +
           "AND a.status IN ('SCHEDULED', 'CONFIRMED') ORDER BY a.appointmentDateTime")
    List<Appointment> findUpcomingAppointments(@Param("endDate") LocalDateTime endDate);
    
    // Additional methods needed by AppointmentService
    Page<Appointment> findByPatient_PatientId(Long patientId, Pageable pageable);
    Page<Appointment> findByDoctor_UserId(Long doctorId, Pageable pageable);
    List<Appointment> findByDoctor_UserIdAndAppointmentDateTimeBetween(Long doctorId, LocalDateTime start, LocalDateTime end);
    
    // Updated conflicting appointments query to use doctor ID
    @Query("SELECT a FROM Appointment a WHERE a.doctor.userId = :doctorId AND " +
           "((a.appointmentDateTime < :endTime AND " +
           "TIMESTAMPADD(MINUTE, a.durationMinutes, a.appointmentDateTime) > :startTime)) AND " +
           "a.status IN ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS')")
    List<Appointment> findConflictingAppointments(@Param("doctorId") Long doctorId,
                                                 @Param("startTime") LocalDateTime startTime,
                                                 @Param("endTime") LocalDateTime endTime);
    
    // For recent activity
    List<Appointment> findTop3ByOrderByCreatedAtDesc();
    
    // Workflow-specific methods
    List<Appointment> findByDoctor_UserIdAndStatusIn(Long doctorId, List<AppointmentStatus> statuses);
    List<Appointment> findByStatus(AppointmentStatus status);
}