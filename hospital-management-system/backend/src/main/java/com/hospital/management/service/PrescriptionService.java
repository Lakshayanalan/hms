package com.hospital.management.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Prescription;
import com.hospital.management.entity.User;
import com.hospital.management.entity.Visit;
import com.hospital.management.repository.PrescriptionRepository;

@Service
@Transactional
public class PrescriptionService {
    
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    
    @Autowired
    private ChargeService chargeService;
    
    // Create prescription
    public Prescription createPrescription(Patient patient, User doctor, Visit visit,
                                         String medicationName, String dosage, 
                                         String frequency, String duration,
                                         String instructions) {
        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setVisit(visit);
        prescription.setMedicationName(medicationName);
        prescription.setDosage(dosage);
        prescription.setFrequency(frequency);
        prescription.setDuration(duration);
        prescription.setInstructions(instructions);
        
        Prescription savedPrescription = prescriptionRepository.save(prescription);
        
        // Automatically create charge for this prescription
        BigDecimal medicationCost = calculateMedicationCost(medicationName, duration);
        chargeService.createPrescriptionCharge(patient, savedPrescription, medicationCost, doctor);
        
        return savedPrescription;
    }
    
    // Get prescriptions
    public List<Prescription> getPrescriptionsByPatient(Patient patient) {
        return prescriptionRepository.findByPatientOrderByCreatedAtDesc(patient);
    }
    
    public Page<Prescription> getPrescriptionsByPatientId(Long patientId, Pageable pageable) {
        return prescriptionRepository.findByPatientIdOrderByCreatedAtDesc(patientId, pageable);
    }
    
    public List<Prescription> getPrescriptionsByDoctorId(Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }
    
    public List<Prescription> getPrescriptionsByVisitId(Long visitId) {
        return prescriptionRepository.findByVisitId(visitId);
    }
    
    public List<Prescription> getPrescriptionsByPatientAndDateRange(Long patientId, 
                                                                   LocalDateTime startDate,
                                                                   LocalDateTime endDate) {
        return prescriptionRepository.findByPatientIdAndDateRange(patientId, startDate, endDate);
    }
    
    public List<Prescription> getPrescriptionsByDoctorAndDateRange(Long doctorId,
                                                                  LocalDateTime startDate,
                                                                  LocalDateTime endDate) {
        return prescriptionRepository.findByDoctorIdAndDateRange(doctorId, startDate, endDate);
    }
    
    // Statistics
    public Long getPrescriptionCountByDoctorId(Long doctorId) {
        return prescriptionRepository.countByDoctorId(doctorId);
    }
    
    public Long getPrescriptionCountByPatientId(Long patientId) {
        return prescriptionRepository.countByPatientId(patientId);
    }
    
    public List<Prescription> getPrescriptionsBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return prescriptionRepository.findPrescriptionsBetweenDates(startDate, endDate);
    }
    
    // Helper methods
    private BigDecimal calculateMedicationCost(String medicationName, String duration) {
        // Simple cost calculation - in real world this would be based on medication database
        BigDecimal baseCost = new BigDecimal("25.00"); // Base cost per prescription
        
        // Parse duration to get number of days (assume format like "7 days", "2 weeks", etc.)
        int days = 7; // Default
        if (duration != null) {
            try {
                String[] parts = duration.toLowerCase().split(" ");
                int number = Integer.parseInt(parts[0]);
                if (duration.contains("week")) {
                    days = number * 7;
                } else if (duration.contains("month")) {
                    days = number * 30;
                } else {
                    days = number; // Assume days
                }
            } catch (Exception e) {
                days = 7; // Default if parsing fails
            }
        }
        
        BigDecimal durationMultiplier = new BigDecimal(days);
        
        // Some common medications with different costs
        if (medicationName.toLowerCase().contains("antibiotic")) {
            baseCost = new BigDecimal("35.00");
        } else if (medicationName.toLowerCase().contains("pain")) {
            baseCost = new BigDecimal("15.00");
        } else if (medicationName.toLowerCase().contains("insulin")) {
            baseCost = new BigDecimal("75.00");
        }
        
        return baseCost.multiply(durationMultiplier.divide(new BigDecimal("7"))); // Weekly basis
    }
}