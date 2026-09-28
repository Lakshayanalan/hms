package com.hospital.management.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.InvoiceRequest;
import com.hospital.management.dto.InvoiceResponse;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Invoice;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.PaymentStatus;
import com.hospital.management.entity.User;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.InvoiceRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.PaymentRepository;

@Service
@Transactional
public class InvoiceService {
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    /**
     * Create a new invoice
     */
    public InvoiceResponse createInvoice(InvoiceRequest request, User createdBy) {
        // Validate patient exists
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + request.getPatientId()));
        
        // Validate appointment if provided
        Appointment appointment = null;
        if (request.getAppointmentId() != null) {
            appointment = appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + request.getAppointmentId()));
        }
        
        // Generate invoice number
        String invoiceNumber = generateInvoiceNumber();
        
        // Create invoice entity
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setPatient(patient);
        invoice.setAppointment(appointment);
        invoice.setInvoiceDate(request.getInvoiceDate());
        invoice.setDueDate(request.getDueDate() != null ? request.getDueDate() : request.getInvoiceDate().plusDays(30));
        invoice.setSubtotal(request.getSubtotal());
        invoice.setTaxAmount(request.getTaxAmount());
        invoice.setDiscountAmount(request.getDiscountAmount());
        invoice.setTotalAmount(request.getTotalAmount());
        invoice.setDescription(request.getDescription());
        invoice.setNotes(request.getNotes());
        invoice.setCreatedBy(createdBy);
        
        // Save invoice
        Invoice savedInvoice = invoiceRepository.save(invoice);
        
        // Convert to response and return
        return convertToResponse(savedInvoice);
    }
    
    /**
     * Get invoice by ID
     */
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceById(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + invoiceId));
        return convertToResponse(invoice);
    }
    
    /**
     * Get invoices by patient
     */
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        
        List<Invoice> invoices = invoiceRepository.findByPatientOrderByInvoiceDateDesc(patient);
        return invoices.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all invoices with pagination
     */
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getAllInvoices(Pageable pageable) {
        Page<Invoice> invoices = invoiceRepository.findAll(pageable);
        return invoices.map(this::convertToResponse);
    }
    
    /**
     * Get invoices by payment status
     */
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesByPaymentStatus(PaymentStatus status) {
        List<Invoice> invoices = invoiceRepository.findByPaymentStatus(status);
        return invoices.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get overdue invoices
     */
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getOverdueInvoices() {
        List<Invoice> invoices = invoiceRepository.findOverdueInvoices(PaymentStatus.PENDING, LocalDate.now());
        return invoices.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Update invoice
     */
    public InvoiceResponse updateInvoice(Long invoiceId, InvoiceRequest request, User updatedBy) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + invoiceId));
        
        // Only allow updates if invoice is still pending
        if (invoice.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new RuntimeException("Cannot update invoice with payment status: " + invoice.getPaymentStatus());
        }
        
        // Update invoice fields
        if (request.getDueDate() != null) {
            invoice.setDueDate(request.getDueDate());
        }
        invoice.setSubtotal(request.getSubtotal());
        invoice.setTaxAmount(request.getTaxAmount());
        invoice.setDiscountAmount(request.getDiscountAmount());
        invoice.setTotalAmount(request.getTotalAmount());
        invoice.setDescription(request.getDescription());
        invoice.setNotes(request.getNotes());
        
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return convertToResponse(savedInvoice);
    }
    
    /**
     * Update invoice payment status
     */
    public InvoiceResponse updatePaymentStatus(Long invoiceId, PaymentStatus newStatus) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + invoiceId));
        
        invoice.setPaymentStatus(newStatus);
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return convertToResponse(savedInvoice);
    }
    
    /**
     * Delete invoice (only if no payments have been made)
     */
    public void deleteInvoice(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found with id: " + invoiceId));
        
        // Check if any payments have been made
        BigDecimal totalPaid = paymentRepository.getTotalPaidForInvoice(invoice);
        if (totalPaid != null && totalPaid.compareTo(BigDecimal.ZERO) > 0) {
            throw new RuntimeException("Cannot delete invoice with payments");
        }
        
        invoiceRepository.delete(invoice);
    }
    
    /**
     * Generate unique invoice number
     */
    private String generateInvoiceNumber() {
        String prefix = "INV";
        String datePart = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // Find the next sequential number for today
        int counter = 1;
        String invoiceNumber;
        do {
            invoiceNumber = String.format("%s-%s-%04d", prefix, datePart, counter);
            counter++;
        } while (invoiceRepository.existsByInvoiceNumber(invoiceNumber));
        
        return invoiceNumber;
    }
    
    /**
     * Get all invoices for a user (patient portal)
     */
    public List<InvoiceResponse> getAllInvoicesForUser(User user) {
        // Find the patient record associated with this user
        Optional<Patient> patientOpt = patientRepository.findByUser_UserId(user.getUserId());
        
        if (patientOpt.isPresent()) {
            // Return invoices for this specific patient
            List<Invoice> invoices = invoiceRepository.findByPatientOrderByInvoiceDateDesc(patientOpt.get());
            return invoices.stream()
                    .map(this::convertToResponse)
                    .collect(Collectors.toList());
        } else {
            // If no patient record found for this user, return empty list
            return new ArrayList<>();
        }
    }
    
    /**
     * Convert Invoice entity to InvoiceResponse DTO
     */
    public InvoiceResponse convertToResponse(Invoice invoice) {
        InvoiceResponse response = new InvoiceResponse();
        response.setInvoiceId(invoice.getInvoiceId());
        response.setInvoiceNumber(invoice.getInvoiceNumber());
        response.setPatientId(invoice.getPatient().getPatientId());
        response.setPatientName(invoice.getPatient().getFullName());
        response.setPatientNumber(invoice.getPatient().getPatientNumber());
        response.setAppointmentId(invoice.getAppointment() != null ? invoice.getAppointment().getAppointmentId() : null);
        response.setInvoiceDate(invoice.getInvoiceDate());
        response.setDueDate(invoice.getDueDate());
        response.setSubtotal(invoice.getSubtotal());
        response.setTaxAmount(invoice.getTaxAmount());
        response.setDiscountAmount(invoice.getDiscountAmount());
        response.setTotalAmount(invoice.getTotalAmount());
        response.setPaymentStatus(invoice.getPaymentStatus());
        response.setDescription(invoice.getDescription());
        response.setNotes(invoice.getNotes());
        response.setCreatedByName(invoice.getCreatedBy() != null ? 
                invoice.getCreatedBy().getFirstName() + " " + invoice.getCreatedBy().getLastName() : null);
        response.setCreatedAt(invoice.getCreatedAt());
        response.setUpdatedAt(invoice.getUpdatedAt());
        
        return response;
    }
}