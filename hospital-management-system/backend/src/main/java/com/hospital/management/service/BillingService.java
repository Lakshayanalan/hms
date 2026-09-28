package com.hospital.management.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.entity.Invoice;
import com.hospital.management.entity.InvoiceItem;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.User;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.ServiceRepository;

@Service
@Transactional
public class BillingService {
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    private static final BigDecimal DEFAULT_TAX_RATE = new BigDecimal("0.08"); // 8% tax
    private static final BigDecimal INSURANCE_DISCOUNT_RATE = new BigDecimal("0.20"); // 20% insurance discount
    
    /**
     * Calculate bill for services with insurance consideration
     */
    public Invoice calculateBill(Long patientId, List<BillingItem> billingItems, 
                                Boolean hasInsurance, String insuranceProvider, 
                                String policyNumber, User createdBy) {
        
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        
        Invoice invoice = new Invoice();
        invoice.setPatient(patient);
        invoice.setHasInsurance(hasInsurance);
        invoice.setInsuranceProvider(insuranceProvider);
        invoice.setInsurancePolicyNumber(policyNumber);
        invoice.setCreatedBy(createdBy);
        
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        BigDecimal totalDiscount = BigDecimal.ZERO;
        BigDecimal totalInsuranceCoverage = BigDecimal.ZERO;
        
        for (BillingItem billingItem : billingItems) {
            com.hospital.management.entity.Service service = null;
            if (billingItem.getServiceId() != null) {
                service = serviceRepository.findById(billingItem.getServiceId())
                        .orElse(null);
            }
            
            InvoiceItem invoiceItem = new InvoiceItem();
            invoiceItem.setInvoice(invoice);
            invoiceItem.setService(service);
            invoiceItem.setServiceName(billingItem.getServiceName());
            invoiceItem.setServiceCode(billingItem.getServiceCode());
            invoiceItem.setDescription(billingItem.getDescription());
            invoiceItem.setQuantity(billingItem.getQuantity());
            
            // Determine unit price based on service and insurance
            BigDecimal unitPrice = billingItem.getUnitPrice();
            if (service != null) {
                unitPrice = service.getEffectivePrice(hasInsurance);
            }
            invoiceItem.setUnitPrice(unitPrice);
            
            // Calculate line subtotal
            BigDecimal lineSubtotal = unitPrice.multiply(new BigDecimal(billingItem.getQuantity()));
            subtotal = subtotal.add(lineSubtotal);
            
            // Apply item-specific discount
            BigDecimal itemDiscount = billingItem.getDiscountAmount() != null ? 
                    billingItem.getDiscountAmount() : BigDecimal.ZERO;
            
            // Apply insurance discount if applicable
            if (hasInsurance && billingItem.getIsInsuranceCovered()) {
                BigDecimal insuranceDiscount = lineSubtotal.multiply(INSURANCE_DISCOUNT_RATE);
                totalInsuranceCoverage = totalInsuranceCoverage.add(insuranceDiscount);
                itemDiscount = itemDiscount.add(insuranceDiscount);
            }
            
            invoiceItem.setDiscountAmount(itemDiscount);
            invoiceItem.setIsInsuranceCovered(billingItem.getIsInsuranceCovered());
            totalDiscount = totalDiscount.add(itemDiscount);
            
            // Calculate tax
            BigDecimal taxableAmount = lineSubtotal.subtract(itemDiscount);
            BigDecimal itemTax = BigDecimal.ZERO;
            if (service != null && service.getIsTaxable()) {
                itemTax = service.calculateTaxAmount(taxableAmount);
            } else {
                // Default tax calculation
                itemTax = taxableAmount.multiply(DEFAULT_TAX_RATE);
            }
            invoiceItem.setTaxAmount(itemTax);
            totalTax = totalTax.add(itemTax);
            
            // Set total amount for this item
            BigDecimal itemTotal = taxableAmount.add(itemTax);
            invoiceItem.setTotalAmount(itemTotal);
            
            invoice.addInvoiceItem(invoiceItem);
        }
        
        // Set invoice totals
        invoice.setSubtotal(subtotal);
        invoice.setTaxAmount(totalTax);
        invoice.setDiscountAmount(totalDiscount);
        invoice.setInsuranceCoverageAmount(totalInsuranceCoverage);
        
        BigDecimal grandTotal = subtotal.subtract(totalDiscount).add(totalTax);
        invoice.setTotalAmount(grandTotal.setScale(2, RoundingMode.HALF_UP));
        
        return invoice;
    }
    
    /**
     * Apply additional discount to invoice
     */
    public void applyDiscount(Invoice invoice, BigDecimal discountAmount, String reason) {
        BigDecimal currentDiscount = invoice.getDiscountAmount();
        BigDecimal newDiscount = currentDiscount.add(discountAmount);
        
        invoice.setDiscountAmount(newDiscount);
        
        // Recalculate total
        BigDecimal newTotal = invoice.getSubtotal().subtract(newDiscount).add(invoice.getTaxAmount());
        invoice.setTotalAmount(newTotal.setScale(2, RoundingMode.HALF_UP));
        
        // Add note about discount
        String currentNotes = invoice.getNotes() != null ? invoice.getNotes() : "";
        String discountNote = "\nDiscount applied: $" + discountAmount + " - " + reason;
        invoice.setNotes(currentNotes + discountNote);
    }
    
    /**
     * Calculate insurance benefits
     */
    public InsuranceBenefit calculateInsuranceBenefit(Invoice invoice) {
        if (!invoice.getHasInsurance()) {
            return new InsuranceBenefit(BigDecimal.ZERO, BigDecimal.ZERO, 
                    invoice.getTotalAmount(), "No insurance coverage");
        }
        
        BigDecimal totalCoverage = invoice.getInsuranceCoverageAmount();
        BigDecimal patientResponsibility = invoice.getTotalAmount();
        
        return new InsuranceBenefit(totalCoverage, BigDecimal.ZERO, 
                patientResponsibility, "Insurance discount applied");
    }
    
    // Helper classes
    public static class BillingItem {
        private Long serviceId;
        private String serviceName;
        private String serviceCode;
        private String description;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal discountAmount = BigDecimal.ZERO;
        private Boolean isInsuranceCovered = false;
        
        // Constructors, getters, setters
        public BillingItem() {}
        
        public BillingItem(Long serviceId, String serviceName, Integer quantity, BigDecimal unitPrice) {
            this.serviceId = serviceId;
            this.serviceName = serviceName;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
        }
        
        // Getters and setters
        public Long getServiceId() { return serviceId; }
        public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
        
        public String getServiceName() { return serviceName; }
        public void setServiceName(String serviceName) { this.serviceName = serviceName; }
        
        public String getServiceCode() { return serviceCode; }
        public void setServiceCode(String serviceCode) { this.serviceCode = serviceCode; }
        
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
        
        public BigDecimal getDiscountAmount() { return discountAmount; }
        public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }
        
        public Boolean getIsInsuranceCovered() { return isInsuranceCovered; }
        public void setIsInsuranceCovered(Boolean isInsuranceCovered) { this.isInsuranceCovered = isInsuranceCovered; }
    }
    
    public static class InsuranceBenefit {
        private BigDecimal coveredAmount;
        private BigDecimal deductible;
        private BigDecimal patientResponsibility;
        private String explanation;
        
        public InsuranceBenefit(BigDecimal coveredAmount, BigDecimal deductible, 
                                BigDecimal patientResponsibility, String explanation) {
            this.coveredAmount = coveredAmount;
            this.deductible = deductible;
            this.patientResponsibility = patientResponsibility;
            this.explanation = explanation;
        }
        
        // Getters
        public BigDecimal getCoveredAmount() { return coveredAmount; }
        public BigDecimal getDeductible() { return deductible; }
        public BigDecimal getPatientResponsibility() { return patientResponsibility; }
        public String getExplanation() { return explanation; }
    }
}