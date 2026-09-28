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

import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Charge;
import com.hospital.management.entity.ChargeStatus;
import com.hospital.management.entity.ChargeType;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Prescription;
import com.hospital.management.entity.Visit;
import com.hospital.management.entity.User;
import com.hospital.management.entity.ServiceCategory;
import com.hospital.management.repository.ChargeRepository;
import com.hospital.management.repository.ServiceRepository;

@Service
@Transactional
public class ChargeService {
    
    @Autowired
    private ChargeRepository chargeRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    // Create charges
    public Charge createCharge(Patient patient, com.hospital.management.entity.Service service,
                              Integer quantity, BigDecimal unitPrice, ChargeType type, User createdBy) {
        Charge charge = new Charge();
        charge.setPatient(patient);
        charge.setService(service);
        charge.setQuantity(quantity);
        charge.setUnitPrice(unitPrice);
        charge.setChargeType(type);
        charge.setCreatedBy(createdBy);
        charge.setStatus(ChargeStatus.PENDING);
        
        return chargeRepository.save(charge);
    }
    
    public Charge createConsultationCharge(Patient patient, Appointment appointment, 
                                         BigDecimal amount, User createdBy) {
        // Find or create consultation service
        Optional<com.hospital.management.entity.Service> serviceOpt = 
            serviceRepository.findByServiceCode("CONSULTATION");
        
        com.hospital.management.entity.Service consultationService;
        if (serviceOpt.isPresent()) {
            consultationService = serviceOpt.get();
        } else {
            // Create default consultation service
            consultationService = new com.hospital.management.entity.Service();
            consultationService.setServiceName("Consultation");
            consultationService.setServiceCode("CONSULTATION");
            consultationService.setCategory(ServiceCategory.CONSULTATION);
            consultationService.setBasePrice(amount);
            consultationService.setDescription("Doctor consultation fee");
            consultationService = serviceRepository.save(consultationService);
        }
        
        Charge charge = new Charge();
        charge.setPatient(patient);
        charge.setAppointment(appointment);
        charge.setService(consultationService);
        charge.setQuantity(1);
        charge.setUnitPrice(amount);
        charge.setChargeType(ChargeType.CONSULTATION);
        charge.setCreatedBy(createdBy);
        charge.setStatus(ChargeStatus.PENDING);
        charge.setReferenceId("APPT-" + appointment.getAppointmentId());
        
        return chargeRepository.save(charge);
    }
    
    public Charge createPrescriptionCharge(Patient patient, Prescription prescription, 
                                         BigDecimal amount, User createdBy) {
        // Find or create medication service
        Optional<com.hospital.management.entity.Service> serviceOpt = 
            serviceRepository.findByServiceCode("MEDICATION");
        
        com.hospital.management.entity.Service medicationService;
        if (serviceOpt.isPresent()) {
            medicationService = serviceOpt.get();
        } else {
            medicationService = new com.hospital.management.entity.Service();
            medicationService.setServiceName("Medication");
            medicationService.setServiceCode("MEDICATION");
            medicationService.setCategory(ServiceCategory.PHARMACY);
            medicationService.setBasePrice(amount);
            medicationService.setDescription("Prescription medication");
            medicationService = serviceRepository.save(medicationService);
        }
        
        Charge charge = new Charge();
        charge.setPatient(patient);
        charge.setService(medicationService);
        charge.setQuantity(1);
        charge.setUnitPrice(amount);
        charge.setChargeType(ChargeType.MEDICATION);
        charge.setCreatedBy(createdBy);
        charge.setStatus(ChargeStatus.PENDING);
        charge.setReferenceId("PRESC-" + prescription.getPrescriptionId());
        charge.setNotes("Medication: " + prescription.getMedicationName());
        
        return chargeRepository.save(charge);
    }
    
    public Charge createServiceCharge(Patient patient, Visit visit, String serviceName, 
                                    BigDecimal amount, User createdBy) {
        // Find or create service
        Optional<com.hospital.management.entity.Service> serviceOpt = 
            serviceRepository.findByServiceName(serviceName);
        
        com.hospital.management.entity.Service medicalService;
        if (serviceOpt.isPresent()) {
            medicalService = serviceOpt.get();
        } else {
            medicalService = new com.hospital.management.entity.Service();
            medicalService.setServiceName(serviceName);
            medicalService.setServiceCode(serviceName.toUpperCase().replace(" ", "_"));
            medicalService.setCategory(ServiceCategory.TREATMENT);
            medicalService.setBasePrice(amount);
            medicalService.setDescription("Medical service: " + serviceName);
            medicalService = serviceRepository.save(medicalService);
        }
        
        Charge charge = new Charge();
        charge.setPatient(patient);
        charge.setService(medicalService);
        charge.setQuantity(1);
        charge.setUnitPrice(amount);
        charge.setChargeType(ChargeType.SERVICE);
        charge.setCreatedBy(createdBy);
        charge.setStatus(ChargeStatus.PENDING);
        charge.setReferenceId("VISIT-" + visit.getVisitId());
        charge.setNotes("Medical service: " + serviceName);
        
        return chargeRepository.save(charge);
    }
    
    // Update charge status
    public Charge updateChargeStatus(Long chargeId, ChargeStatus status) {
        Optional<Charge> optionalCharge = chargeRepository.findById(chargeId);
        if (optionalCharge.isPresent()) {
            Charge charge = optionalCharge.get();
            charge.setStatus(status);
            return chargeRepository.save(charge);
        }
        throw new RuntimeException("Charge not found with ID: " + chargeId);
    }
    
    // Get charges
    public List<Charge> getChargesByPatient(Patient patient) {
        return chargeRepository.findByPatientAndStatusOrderByCreatedAtDesc(patient, ChargeStatus.PENDING);
    }
    
    public List<Charge> getChargesByPatientAndStatus(Patient patient, ChargeStatus status) {
        return chargeRepository.findByPatientAndStatus(patient, status);
    }
    
    public Page<Charge> getChargesByPatientId(Long patientId, ChargeStatus status, Pageable pageable) {
        return chargeRepository.findByPatientIdAndStatus(patientId, status, pageable);
    }
    
    public List<Charge> getPendingChargesForPatient(Long patientId) {
        return chargeRepository.findPendingChargesForPatient(patientId);
    }
    
    public List<Charge> getPendingChargesNotBilled() {
        return chargeRepository.findPendingChargesNotBilled();
    }
    
    public List<Charge> getChargesByAppointmentId(Long appointmentId) {
        return chargeRepository.findByAppointmentId(appointmentId);
    }
    
    public List<Charge> getChargesByIds(List<Long> chargeIds) {
        return chargeRepository.findAllById(chargeIds);
    }
    
    // Billing operations
    public void markChargesAsBilled(List<Charge> charges) {
        for (Charge charge : charges) {
            charge.setStatus(ChargeStatus.BILLED);
        }
        chargeRepository.saveAll(charges);
    }
    
    public void markChargeAsPaid(Long chargeId) {
        updateChargeStatus(chargeId, ChargeStatus.PAID);
    }
    
    public void markChargeAsCancelled(Long chargeId) {
        updateChargeStatus(chargeId, ChargeStatus.CANCELLED);
    }
    
    // Calculate totals
    public BigDecimal calculateTotalCharges(List<Charge> charges) {
        return charges.stream()
                .map(Charge::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public BigDecimal calculatePendingChargesForPatient(Long patientId) {
        List<Charge> pendingCharges = getPendingChargesForPatient(patientId);
        return calculateTotalCharges(pendingCharges);
    }
    
    // Statistics
    public Long getChargeCountByStatus(ChargeStatus status) {
        return chargeRepository.countByStatus(status);
    }
    
    public List<Charge> getChargesBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return chargeRepository.findChargesBetweenDates(startDate, endDate);
    }
    
    // Automatic charge capture
    @Transactional
    public void captureAutomaticCharges(Appointment appointment, Visit visit, User currentUser) {
        // Create consultation charge
        BigDecimal consultationFee = new BigDecimal("50.00"); // Default consultation fee
        createConsultationCharge(appointment.getPatient(), appointment, consultationFee, currentUser);
        
        // Additional automatic charges can be added here based on visit type
        if (visit != null && visit.getVisitType() != null) {
            switch (visit.getVisitType()) {
                case EMERGENCY:
                    createServiceCharge(appointment.getPatient(), visit, "Emergency Fee", 
                                      new BigDecimal("100.00"), currentUser);
                    break;
                case FOLLOW_UP:
                    createServiceCharge(appointment.getPatient(), visit, "Follow-up Fee", 
                                      new BigDecimal("30.00"), currentUser);
                    break;
                default:
                    break;
            }
        }
    }
}