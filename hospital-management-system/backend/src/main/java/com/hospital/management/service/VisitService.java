package com.hospital.management.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.User;
import com.hospital.management.entity.Visit;
import com.hospital.management.entity.VisitStatus;
import com.hospital.management.entity.VisitType;
import com.hospital.management.repository.VisitRepository;

@Service
@Transactional
public class VisitService {
    
    @Autowired
    private VisitRepository visitRepository;
    
    @Autowired
    private ChargeService chargeService;
    
    // Create visit
    public Visit createVisit(Patient patient, User doctor, Appointment appointment, 
                           VisitType visitType, String notes) {
        Visit visit = new Visit();
        visit.setPatient(patient);
        visit.setDoctor(doctor);
        visit.setAppointment(appointment);
        visit.setVisitType(visitType);
        visit.setNotes(notes);
        visit.setStatus(VisitStatus.SCHEDULED);
        visit.setCheckInTime(appointment.getAppointmentDateTime());
        
        Visit savedVisit = visitRepository.save(visit);
        
        // Automatically create charges for this visit
        chargeService.captureAutomaticCharges(appointment, savedVisit, doctor);
        
        return savedVisit;
    }
    
    public Visit createVisitFromAppointment(Appointment appointment) {
        // Determine visit type based on appointment
        VisitType visitType = determineVisitType(appointment);
        
        return createVisit(
            appointment.getPatient(),
            appointment.getDoctor(),
            appointment,
            visitType,
            appointment.getReason()
        );
    }
    
    // Update visit
    public Visit updateVisitStatus(Long visitId, VisitStatus status) {
        Optional<Visit> optionalVisit = visitRepository.findById(visitId);
        if (optionalVisit.isPresent()) {
            Visit visit = optionalVisit.get();
            visit.setStatus(status);
            
            if (status == VisitStatus.IN_PROGRESS) {
                visit.setCheckInTime(LocalDateTime.now());
            } else if (status == VisitStatus.COMPLETED) {
                visit.setCheckOutTime(LocalDateTime.now());
            }
            
            return visitRepository.save(visit);
        }
        throw new RuntimeException("Visit not found with ID: " + visitId);
    }
    
    public Visit updateVisitNotes(Long visitId, String notes) {
        Optional<Visit> optionalVisit = visitRepository.findById(visitId);
        if (optionalVisit.isPresent()) {
            Visit visit = optionalVisit.get();
            visit.setNotes(notes);
            return visitRepository.save(visit);
        }
        throw new RuntimeException("Visit not found with ID: " + visitId);
    }
    
    public Visit updateVisitDiagnosis(Long visitId, String diagnosis) {
        Optional<Visit> optionalVisit = visitRepository.findById(visitId);
        if (optionalVisit.isPresent()) {
            Visit visit = optionalVisit.get();
            visit.setDiagnosis(diagnosis);
            return visitRepository.save(visit);
        }
        throw new RuntimeException("Visit not found with ID: " + visitId);
    }
    
    // Get visits
    public List<Visit> getVisitsByPatient(Patient patient) {
        return visitRepository.findByPatientOrderByCheckInTimeDesc(patient);
    }
    
    public Page<Visit> getVisitsByPatientId(Long patientId, Pageable pageable) {
        return visitRepository.findByPatientIdOrderByCheckInTimeDesc(patientId, pageable);
    }
    
    public List<Visit> getVisitsByStatus(VisitStatus status) {
        return visitRepository.findByStatus(status);
    }
    
    public Page<Visit> getVisitsByStatus(VisitStatus status, Pageable pageable) {
        return visitRepository.findByStatusOrderByCheckInTimeDesc(status, pageable);
    }
    
    public Optional<Visit> getVisitByAppointmentId(Long appointmentId) {
        return visitRepository.findByAppointmentId(appointmentId);
    }
    
    public List<Visit> getVisitsByDoctorAndDateRange(Long doctorId, LocalDateTime startDate, LocalDateTime endDate) {
        return visitRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);
    }
    
    public List<Visit> getActiveVisits() {
        return visitRepository.findActiveVisits();
    }
    
    public List<Visit> getUpcomingVisitsForDoctor(Long doctorId) {
        return visitRepository.findUpcomingVisitsForDoctor(doctorId);
    }
    
    public List<Visit> getCompletedVisitsForPatient(Long patientId) {
        return visitRepository.findCompletedVisitsForPatient(patientId);
    }
    
    // Statistics
    public Long getVisitCountByStatus(VisitStatus status) {
        return visitRepository.countByStatus(status);
    }
    
    public List<Visit> getVisitsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return visitRepository.findVisitsBetweenDates(startDate, endDate);
    }
    
    // Business logic
    public void startVisit(Long visitId) {
        updateVisitStatus(visitId, VisitStatus.IN_PROGRESS);
    }
    
    public void completeVisit(Long visitId, String diagnosis, String notes) {
        Visit visit = updateVisitStatus(visitId, VisitStatus.COMPLETED);
        if (diagnosis != null && !diagnosis.trim().isEmpty()) {
            updateVisitDiagnosis(visitId, diagnosis);
        }
        if (notes != null && !notes.trim().isEmpty()) {
            updateVisitNotes(visitId, notes);
        }
    }
    
    public void cancelVisit(Long visitId, String reason) {
        Visit visit = updateVisitStatus(visitId, VisitStatus.CANCELLED);
        if (reason != null && !reason.trim().isEmpty()) {
            updateVisitNotes(visitId, "Cancelled: " + reason);
        }
    }
    
    // Helper methods
    private VisitType determineVisitType(Appointment appointment) {
        // Logic to determine visit type based on appointment details
        if (appointment.getReason() != null) {
            String reason = appointment.getReason().toLowerCase();
            if (reason.contains("emergency") || reason.contains("urgent")) {
                return VisitType.EMERGENCY;
            } else if (reason.contains("follow") || reason.contains("check")) {
                return VisitType.FOLLOW_UP;
            } else if (reason.contains("routine") || reason.contains("checkup")) {
                return VisitType.ROUTINE_CHECKUP;
            } else if (reason.contains("diagnostic") || reason.contains("test")) {
                return VisitType.DIAGNOSTIC;
            } else if (reason.contains("treatment")) {
                return VisitType.TREATMENT;
            }
        }
        return VisitType.CONSULTATION; // Default
    }
}