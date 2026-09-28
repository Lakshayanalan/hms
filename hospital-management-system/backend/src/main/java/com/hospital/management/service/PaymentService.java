package com.hospital.management.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.PaymentRequest;
import com.hospital.management.dto.PaymentResponse;
import com.hospital.management.entity.Invoice;
import com.hospital.management.entity.Payment;
import com.hospital.management.entity.PaymentStatus;
import com.hospital.management.entity.User;
import com.hospital.management.repository.InvoiceRepository;
import com.hospital.management.repository.PaymentRepository;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private InvoiceService invoiceService;
    
    /**
     * Process a new payment
     */
    public PaymentResponse processPayment(PaymentRequest request, User processedBy) {
        // Validate invoice exists and is not fully paid
        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + request.getInvoiceId()));
        
        if (invoice.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Invoice is already fully paid");
        }
        
        // Calculate total paid amount including this payment
        BigDecimal previouslyPaid = paymentRepository.getTotalPaidForInvoice(invoice);
        if (previouslyPaid == null) {
            previouslyPaid = BigDecimal.ZERO;
        }
        
        BigDecimal totalAfterPayment = previouslyPaid.add(request.getAmount());
        
        // Validate payment amount doesn't exceed outstanding amount
        if (totalAfterPayment.compareTo(invoice.getTotalAmount()) > 0) {
            throw new RuntimeException("Payment amount exceeds outstanding invoice amount");
        }
        
        // Generate payment number
        String paymentNumber = generatePaymentNumber();
        
        // Create payment entity
        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setPaymentNumber(paymentNumber);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentDate(request.getPaymentDate());
        payment.setReferenceNumber(request.getReferenceNumber());
        payment.setNotes(request.getNotes());
        payment.setProcessedBy(processedBy);
        
        // Save payment
        Payment savedPayment = paymentRepository.save(payment);
        
        // Update invoice payment status
        updateInvoicePaymentStatus(invoice, totalAfterPayment);
        
        return convertToResponse(savedPayment);
    }
    
    /**
     * Get payment by ID
     */
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        return convertToResponse(payment);
    }
    
    /**
     * Get payments for an invoice
     */
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByInvoice(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + invoiceId));
        
        List<Payment> payments = paymentRepository.findByInvoiceOrderByPaymentDateDesc(invoice);
        return payments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all payments with pagination
     */
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        Page<Payment> payments = paymentRepository.findAll(pageable);
        return payments.map(this::convertToResponse);
    }
    
    /**
     * Get payment history for a patient (through their invoices)
     */
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPatientPaymentHistory(Long patientId) {
        // Get all invoices for the patient
        List<Invoice> patientInvoices = invoiceRepository.findByPatientOrderByInvoiceDateDesc(
                new com.hospital.management.entity.Patient() {{ setPatientId(patientId); }});
        
        // Get all payments for those invoices
        return patientInvoices.stream()
                .flatMap(invoice -> paymentRepository.findByInvoiceOrderByPaymentDateDesc(invoice).stream())
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Refund a payment (create a negative payment)
     */
    public PaymentResponse refundPayment(Long paymentId, BigDecimal refundAmount, String reason, User processedBy) {
        Payment originalPayment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with id: " + paymentId));
        
        // Validate refund amount
        if (refundAmount.compareTo(originalPayment.getAmount()) > 0) {
            throw new RuntimeException("Refund amount cannot exceed original payment amount");
        }
        
        // Create refund payment (negative amount)
        Payment refund = new Payment();
        refund.setInvoice(originalPayment.getInvoice());
        refund.setPaymentNumber(generatePaymentNumber());
        refund.setAmount(refundAmount.negate()); // Negative amount for refund
        refund.setPaymentMethod(originalPayment.getPaymentMethod());
        refund.setPaymentDate(LocalDateTime.now());
        refund.setReferenceNumber("REFUND-" + originalPayment.getPaymentNumber());
        refund.setNotes(reason != null ? reason : "Refund for payment " + originalPayment.getPaymentNumber());
        refund.setProcessedBy(processedBy);
        
        Payment savedRefund = paymentRepository.save(refund);
        
        // Recalculate invoice payment status
        BigDecimal totalPaid = paymentRepository.getTotalPaidForInvoice(originalPayment.getInvoice());
        updateInvoicePaymentStatus(originalPayment.getInvoice(), totalPaid != null ? totalPaid : BigDecimal.ZERO);
        
        return convertToResponse(savedRefund);
    }
    
    /**
     * Get recent payments (for dashboard)
     */
    @Transactional(readOnly = true)
    public List<PaymentResponse> getRecentPayments(int limit) {
        List<Payment> payments = paymentRepository.findRecentPayments();
        return payments.stream()
                .limit(limit)
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Update invoice payment status based on total paid amount
     */
    private void updateInvoicePaymentStatus(Invoice invoice, BigDecimal totalPaid) {
        PaymentStatus newStatus;
        
        if (totalPaid.compareTo(BigDecimal.ZERO) == 0) {
            newStatus = PaymentStatus.PENDING;
        } else if (totalPaid.compareTo(invoice.getTotalAmount()) >= 0) {
            newStatus = PaymentStatus.PAID;
        } else {
            newStatus = PaymentStatus.PARTIAL;
        }
        
        if (invoice.getPaymentStatus() != newStatus) {
            invoiceService.updatePaymentStatus(invoice.getInvoiceId(), newStatus);
        }
    }
    
    /**
     * Generate unique payment number
     */
    private String generatePaymentNumber() {
        String prefix = "PAY";
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm"));
        
        // Find the next sequential number
        int counter = 1;
        String paymentNumber;
        do {
            paymentNumber = String.format("%s-%s-%04d", prefix, datePart, counter);
            counter++;
        } while (paymentRepository.existsByPaymentNumber(paymentNumber));
        
        return paymentNumber;
    }
    
    /**
     * Convert Payment entity to PaymentResponse DTO
     */
    private PaymentResponse convertToResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setPaymentId(payment.getPaymentId());
        response.setInvoiceId(payment.getInvoice().getInvoiceId());
        response.setInvoiceNumber(payment.getInvoice().getInvoiceNumber());
        response.setPaymentNumber(payment.getPaymentNumber());
        response.setAmount(payment.getAmount());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setPaymentDate(payment.getPaymentDate());
        response.setReferenceNumber(payment.getReferenceNumber());
        response.setNotes(payment.getNotes());
        response.setProcessedByName(payment.getProcessedBy() != null ? 
                payment.getProcessedBy().getFirstName() + " " + payment.getProcessedBy().getLastName() : null);
        response.setCreatedAt(payment.getCreatedAt());
        
        return response;
    }
}