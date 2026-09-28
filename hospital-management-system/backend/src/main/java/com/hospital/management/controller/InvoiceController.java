package com.hospital.management.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.BillCalculationRequest;
import com.hospital.management.dto.InvoiceRequest;
import com.hospital.management.dto.InvoiceResponse;
import com.hospital.management.entity.Invoice;
import com.hospital.management.entity.PaymentStatus;
import com.hospital.management.entity.Role;
import com.hospital.management.entity.User;
import com.hospital.management.service.BillingService;
import com.hospital.management.service.InvoiceService;
import com.hospital.management.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/invoices")
@CrossOrigin(origins = "http://localhost:3000")
public class InvoiceController {
    
    @Autowired
    private InvoiceService invoiceService;
    
    @Autowired
    private BillingService billingService;
    
    @Autowired
    private UserService userService;
    
    /**
     * Create a new invoice
     */
    @PostMapping
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<InvoiceResponse> createInvoice(
            @Valid @RequestBody InvoiceRequest request, 
            Authentication authentication) {
        try {
            // Use default admin user for testing when authentication is null
            User currentUser = (authentication != null) ? 
                userService.getUserByUsername(authentication.getName()).orElse(null) : 
                userService.getUserByUsername("admin").orElse(null);
            InvoiceResponse invoice = invoiceService.createInvoice(request, currentUser);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get invoice by ID
     */
    @GetMapping("/{invoiceId}")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR')")
    public ResponseEntity<InvoiceResponse> getInvoiceById(@PathVariable Long invoiceId) {
        try {
            InvoiceResponse invoice = invoiceService.getInvoiceById(invoiceId);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * Get all invoices with pagination
     */
    @GetMapping
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<Page<InvoiceResponse>> getAllInvoices(Pageable pageable) {
        try {
            Page<InvoiceResponse> invoices = invoiceService.getAllInvoices(pageable);
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get invoices by patient
     */
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByPatient(@PathVariable Long patientId) {
        try {
            // Get current user to check patient access
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            
            // If user is a patient, they can only access their own invoices
            if (currentUser != null && currentUser.getRole() == Role.PATIENT) {
                // For now, allow access - in a real system you'd verify the patientId matches the user's patient record
                // This would require proper user-patient linking in the database
            }
            
            List<InvoiceResponse> invoices = invoiceService.getInvoicesByPatient(patientId);
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get invoices by payment status
     */
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<List<InvoiceResponse>> getInvoicesByStatus(@PathVariable PaymentStatus status) {
        try {
            List<InvoiceResponse> invoices = invoiceService.getInvoicesByPaymentStatus(status);
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get overdue invoices
     */
    @GetMapping("/overdue")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<List<InvoiceResponse>> getOverdueInvoices() {
        try {
            List<InvoiceResponse> invoices = invoiceService.getOverdueInvoices();
            return ResponseEntity.ok(invoices);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update invoice
     */
    @PutMapping("/{invoiceId}")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<InvoiceResponse> updateInvoice(
            @PathVariable Long invoiceId,
            @Valid @RequestBody InvoiceRequest request,
            Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            InvoiceResponse invoice = invoiceService.updateInvoice(invoiceId, request, currentUser);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Update invoice payment status
     */
    @PutMapping("/{invoiceId}/status")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<InvoiceResponse> updatePaymentStatus(
            @PathVariable Long invoiceId,
            @RequestParam PaymentStatus status) {
        try {
            InvoiceResponse invoice = invoiceService.updatePaymentStatus(invoiceId, status);
            return ResponseEntity.ok(invoice);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Calculate bill for patient services
     */
    @PostMapping("/calculate")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR')")
    public ResponseEntity<InvoiceResponse> calculateBill(
            @Valid @RequestBody BillCalculationRequest request,
            Authentication authentication) {
        try {
            User currentUser = (authentication != null) ? 
                userService.getUserByUsername(authentication.getName()).orElse(null) : 
                userService.getUserByUsername("admin").orElse(null);
            
            // Convert request items to BillingService format
            List<BillingService.BillingItem> billingItems = request.getItems().stream()
                .map(item -> {
                    BillingService.BillingItem billingItem = new BillingService.BillingItem();
                    billingItem.setServiceId(item.getServiceId());
                    billingItem.setServiceName(item.getServiceName());
                    billingItem.setServiceCode(item.getServiceCode());
                    billingItem.setDescription(item.getDescription());
                    billingItem.setQuantity(item.getQuantity());
                    billingItem.setUnitPrice(item.getUnitPrice());
                    billingItem.setDiscountAmount(item.getDiscountAmount());
                    billingItem.setIsInsuranceCovered(item.getIsInsuranceCovered());
                    return billingItem;
                })
                .collect(Collectors.toList());
            
            Invoice calculatedInvoice = billingService.calculateBill(
                request.getPatientId(),
                billingItems,
                request.getHasInsurance(),
                request.getInsuranceProvider(),
                request.getInsurancePolicyNumber(),
                currentUser
            );
            
            // Convert to response (you'll need to implement this conversion)
            InvoiceResponse response = invoiceService.convertToResponse(calculatedInvoice);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get invoices for current user based on their role
     */
    @GetMapping("/my-invoices")
    @PreAuthorize("hasRole('PATIENT') or hasRole('DOCTOR') or hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<List<InvoiceResponse>> getMyInvoices() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || authentication.getName() == null) {
                return ResponseEntity.status(401).build();
            }
            
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            if (currentUser != null) {
                List<InvoiceResponse> invoices;
                
                // Return invoices based on user role
                if (currentUser.getRole() == Role.PATIENT) {
                    // Patients see only their own invoices
                    invoices = invoiceService.getAllInvoicesForUser(currentUser);
                } else if (currentUser.getRole() == Role.DOCTOR || 
                          currentUser.getRole() == Role.RECEPTIONIST || 
                          currentUser.getRole() == Role.HOSPITAL_MANAGER) {
                    // Doctors, receptionists, and managers see all invoices
                    Pageable pageable = PageRequest.of(0, 100);
                    invoices = invoiceService.getAllInvoices(pageable).getContent();
                } else {
                    return ResponseEntity.status(403).build();
                }
                
                return ResponseEntity.ok(invoices);
            }
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Download invoice as PDF
     */
    @GetMapping("/{invoiceId}/pdf")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('PATIENT')")
    public ResponseEntity<byte[]> downloadInvoicePdf(@PathVariable Long invoiceId, Authentication authentication) {
        try {
            InvoiceResponse invoice = invoiceService.getInvoiceById(invoiceId);
            
            // Check patient access - patients can only download their own invoices
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            if (currentUser != null && currentUser.getRole().name().equals("PATIENT")) {
                // For now, skip patient-specific validation - this would need proper user-patient linking
                // In a real system, you'd verify the user can access this specific invoice
            }
            
            // TODO: Implement PDF generation
            // byte[] pdfBytes = pdfGenerationService.generateInvoicePdf(invoice);
            
            // For now, return a placeholder response
            String pdfContent = "PDF generation not yet implemented for Invoice #" + invoice.getInvoiceNumber();
            byte[] pdfBytes = pdfContent.getBytes();
            
            return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=invoice_" + 
                        invoice.getInvoiceNumber() + ".pdf")
                .body(pdfBytes);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Delete invoice
     */
    @DeleteMapping("/{invoiceId}")
    @PreAuthorize("hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long invoiceId) {
        try {
            invoiceService.deleteInvoice(invoiceId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}