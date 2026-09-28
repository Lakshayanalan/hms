package com.hospital.management.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.entity.Charge;
import com.hospital.management.entity.ChargeStatus;
import com.hospital.management.entity.ChargeType;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.User;
import com.hospital.management.service.ChargeService;
import com.hospital.management.service.PatientService;
import com.hospital.management.service.ServiceService;
import com.hospital.management.service.UserService;

@RestController
@RequestMapping("/charges")
public class ChargeController {
    
    @Autowired
    private ChargeService chargeService;
    
    @Autowired
    private PatientService patientService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ServiceService serviceService;
    
    // Create manual charge
    @PostMapping("/manual")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('RECEPTIONIST') or hasRole('DOCTOR')")
    public ResponseEntity<?> createManualCharge(@RequestBody CreateChargeRequest request, 
                                               Authentication authentication) {
        try {
            Optional<Patient> patientOpt = patientService.getPatientEntityById(request.getPatientId());
            if (!patientOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Patient not found");
            }
            Patient patient = patientOpt.get();
            
            Optional<com.hospital.management.entity.Service> serviceOpt = 
                serviceService.findById(request.getServiceId());
            if (!serviceOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Service not found");
            }
            com.hospital.management.entity.Service service = serviceOpt.get();
            
            Optional<User> userOpt = userService.getUserByUsername(authentication.getName());
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            User currentUser = userOpt.get();
            
            Charge charge = chargeService.createCharge(
                patient, service, request.getQuantity(), request.getUnitPrice(),
                ChargeType.MANUAL, currentUser
            );
            
            return ResponseEntity.ok(charge);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating charge: " + e.getMessage());
        }
    }
    
    // Get charges by patient
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('RECEPTIONIST') or hasRole('DOCTOR')")
    public ResponseEntity<?> getChargesByPatient(@PathVariable Long patientId,
                                               @RequestParam(defaultValue = "PENDING") String status,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int size) {
        try {
            ChargeStatus chargeStatus = ChargeStatus.valueOf(status.toUpperCase());
            Pageable pageable = PageRequest.of(page, size);
            Page<Charge> charges = chargeService.getChargesByPatientId(patientId, chargeStatus, pageable);
            return ResponseEntity.ok(charges);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving charges: " + e.getMessage());
        }
    }
    
    // Get pending charges for billing
    @GetMapping("/pending")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('RECEPTIONIST')")
    public ResponseEntity<?> getPendingCharges() {
        try {
            List<Charge> pendingCharges = chargeService.getPendingChargesNotBilled();
            return ResponseEntity.ok(pendingCharges);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving pending charges: " + e.getMessage());
        }
    }
    
    // Update charge status
    @PutMapping("/{chargeId}/status")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('RECEPTIONIST')")
    public ResponseEntity<?> updateChargeStatus(@PathVariable Long chargeId,
                                              @RequestParam String status) {
        try {
            ChargeStatus chargeStatus = ChargeStatus.valueOf(status.toUpperCase());
            Charge updatedCharge = chargeService.updateChargeStatus(chargeId, chargeStatus);
            return ResponseEntity.ok(updatedCharge);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating charge status: " + e.getMessage());
        }
    }
    
    // Mark charges as billed
    @PutMapping("/mark-billed")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('RECEPTIONIST')")
    public ResponseEntity<?> markChargesAsBilled(@RequestBody List<Long> chargeIds) {
        try {
            List<Charge> charges = chargeService.getChargesByIds(chargeIds);
            chargeService.markChargesAsBilled(charges);
            return ResponseEntity.ok("Charges marked as billed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error marking charges as billed: " + e.getMessage());
        }
    }
    
    // Get charge statistics
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('RECEPTIONIST')")
    public ResponseEntity<?> getChargeStatistics() {
        try {
            ChargeStatistics stats = new ChargeStatistics();
            stats.pendingCount = chargeService.getChargeCountByStatus(ChargeStatus.PENDING);
            stats.billedCount = chargeService.getChargeCountByStatus(ChargeStatus.BILLED);
            stats.paidCount = chargeService.getChargeCountByStatus(ChargeStatus.PAID);
            stats.cancelledCount = chargeService.getChargeCountByStatus(ChargeStatus.CANCELLED);
            
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving statistics: " + e.getMessage());
        }
    }
    
    // Calculate total pending charges for patient
    @GetMapping("/patient/{patientId}/total-pending")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('RECEPTIONIST') or hasRole('DOCTOR')")
    public ResponseEntity<?> getTotalPendingCharges(@PathVariable Long patientId) {
        try {
            BigDecimal total = chargeService.calculatePendingChargesForPatient(patientId);
            return ResponseEntity.ok(new TotalChargesResponse(total));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error calculating total charges: " + e.getMessage());
        }
    }
    
    // Inner classes for request/response DTOs
    public static class CreateChargeRequest {
        private Long patientId;
        private Long serviceId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private String notes;
        
        // Getters and setters
        public Long getPatientId() { return patientId; }
        public void setPatientId(Long patientId) { this.patientId = patientId; }
        
        public Long getServiceId() { return serviceId; }
        public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
        
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
        
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }
    
    public static class ChargeStatistics {
        public Long pendingCount;
        public Long billedCount;
        public Long paidCount;
        public Long cancelledCount;
    }
    
    public static class TotalChargesResponse {
        private BigDecimal total;
        
        public TotalChargesResponse(BigDecimal total) {
            this.total = total;
        }
        
        public BigDecimal getTotal() { return total; }
        public void setTotal(BigDecimal total) { this.total = total; }
    }
}