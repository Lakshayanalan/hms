package com.hospital.management.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.PaymentRequest;
import com.hospital.management.dto.PaymentResponse;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.User;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.service.PaymentService;
import com.hospital.management.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @Autowired
    private PatientRepository patientRepository;
    
    /**
     * Process a new payment
     */
    @PostMapping
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<PaymentResponse> processPayment(
            @Valid @RequestBody PaymentRequest request,
            Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            PaymentResponse payment = paymentService.processPayment(request, currentUser);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get payment by ID
     */
    @GetMapping("/{paymentId}")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR')")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long paymentId) {
        try {
            PaymentResponse payment = paymentService.getPaymentById(paymentId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get all payments with pagination
     */
    @GetMapping
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<Page<PaymentResponse>> getAllPayments(Pageable pageable) {
        try {
            Page<PaymentResponse> payments = paymentService.getAllPayments(pageable);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get payments for an invoice
     */
    @GetMapping("/invoice/{invoiceId}")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR')")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByInvoice(@PathVariable Long invoiceId) {
        try {
            List<PaymentResponse> payments = paymentService.getPaymentsByInvoice(invoiceId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get payment history for a patient
     */
    @GetMapping("/patient/{patientId}/history")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR')")
    public ResponseEntity<List<PaymentResponse>> getPatientPaymentHistory(@PathVariable Long patientId) {
        try {
            List<PaymentResponse> payments = paymentService.getPatientPaymentHistory(patientId);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Get payment history for the currently logged-in patient
     */
    @GetMapping("/my-history")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<PaymentResponse>> getMyPaymentHistory(Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            if (currentUser == null) {
                return ResponseEntity.status(401).build();
            }
            Patient patient = patientRepository.findByUser_UserId(currentUser.getUserId()).orElse(null);
            if (patient == null) {
                return ResponseEntity.ok(List.of());
            }
            List<PaymentResponse> payments = paymentService.getPatientPaymentHistory(patient.getPatientId());
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Process refund
     */
    @PostMapping("/{paymentId}/refund")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<PaymentResponse> refundPayment(
            @PathVariable Long paymentId,
            @RequestParam BigDecimal refundAmount,
            @RequestParam(required = false) String reason,
            Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            PaymentResponse refund = paymentService.refundPayment(paymentId, refundAmount, reason, currentUser);
            return ResponseEntity.ok(refund);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get recent payments for dashboard
     */
    @GetMapping("/recent")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<List<PaymentResponse>> getRecentPayments(@RequestParam(defaultValue = "10") int limit) {
        try {
            List<PaymentResponse> payments = paymentService.getRecentPayments(limit);
            return ResponseEntity.ok(payments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}