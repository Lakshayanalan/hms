package com.hospital.management.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public class FinancialReportResponse {
    
    private LocalDate startDate;
    private LocalDate endDate;
    
    // Revenue metrics
    private BigDecimal totalRevenue;
    private BigDecimal totalInvoiced;
    private BigDecimal totalPaid;
    private BigDecimal outstandingAmount;
    private BigDecimal overdueAmount;
    
    // Volume metrics
    private int totalInvoices;
    private int paidInvoices;
    private int pendingInvoices;
    private int overdueInvoices;
    
    // Payment method breakdown
    private Map<String, BigDecimal> paymentMethodBreakdown;
    
    // Monthly breakdown
    private Map<String, BigDecimal> monthlyRevenue;
    private Map<String, Integer> monthlyInvoices;
    
    // Top patients by revenue
    private Map<String, BigDecimal> topPatientsByRevenue;
    
    // Department/Service breakdown (if applicable)
    private Map<String, BigDecimal> serviceBreakdown;
    
    // Collection rates
    private Double collectionRate; // Percentage of invoiced amount that's been paid
    private Double overdueRate; // Percentage of total outstanding that's overdue
    
    // Average metrics
    private BigDecimal averageInvoiceAmount;
    private BigDecimal averagePaymentAmount;
    private Double averageDaysToPayment;
    
    // Constructors
    public FinancialReportResponse() {}
    
    // Getters and Setters
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
    
    public BigDecimal getTotalInvoiced() { return totalInvoiced; }
    public void setTotalInvoiced(BigDecimal totalInvoiced) { this.totalInvoiced = totalInvoiced; }
    
    public BigDecimal getTotalPaid() { return totalPaid; }
    public void setTotalPaid(BigDecimal totalPaid) { this.totalPaid = totalPaid; }
    
    public BigDecimal getOutstandingAmount() { return outstandingAmount; }
    public void setOutstandingAmount(BigDecimal outstandingAmount) { this.outstandingAmount = outstandingAmount; }
    
    public BigDecimal getOverdueAmount() { return overdueAmount; }
    public void setOverdueAmount(BigDecimal overdueAmount) { this.overdueAmount = overdueAmount; }
    
    public int getTotalInvoices() { return totalInvoices; }
    public void setTotalInvoices(int totalInvoices) { this.totalInvoices = totalInvoices; }
    
    public int getPaidInvoices() { return paidInvoices; }
    public void setPaidInvoices(int paidInvoices) { this.paidInvoices = paidInvoices; }
    
    public int getPendingInvoices() { return pendingInvoices; }
    public void setPendingInvoices(int pendingInvoices) { this.pendingInvoices = pendingInvoices; }
    
    public int getOverdueInvoices() { return overdueInvoices; }
    public void setOverdueInvoices(int overdueInvoices) { this.overdueInvoices = overdueInvoices; }
    
    public Map<String, BigDecimal> getPaymentMethodBreakdown() { return paymentMethodBreakdown; }
    public void setPaymentMethodBreakdown(Map<String, BigDecimal> paymentMethodBreakdown) { this.paymentMethodBreakdown = paymentMethodBreakdown; }
    
    public Map<String, BigDecimal> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(Map<String, BigDecimal> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }
    
    public Map<String, Integer> getMonthlyInvoices() { return monthlyInvoices; }
    public void setMonthlyInvoices(Map<String, Integer> monthlyInvoices) { this.monthlyInvoices = monthlyInvoices; }
    
    public Map<String, BigDecimal> getTopPatientsByRevenue() { return topPatientsByRevenue; }
    public void setTopPatientsByRevenue(Map<String, BigDecimal> topPatientsByRevenue) { this.topPatientsByRevenue = topPatientsByRevenue; }
    
    public Map<String, BigDecimal> getServiceBreakdown() { return serviceBreakdown; }
    public void setServiceBreakdown(Map<String, BigDecimal> serviceBreakdown) { this.serviceBreakdown = serviceBreakdown; }
    
    public Double getCollectionRate() { return collectionRate; }
    public void setCollectionRate(Double collectionRate) { this.collectionRate = collectionRate; }
    
    public Double getOverdueRate() { return overdueRate; }
    public void setOverdueRate(Double overdueRate) { this.overdueRate = overdueRate; }
    
    public BigDecimal getAverageInvoiceAmount() { return averageInvoiceAmount; }
    public void setAverageInvoiceAmount(BigDecimal averageInvoiceAmount) { this.averageInvoiceAmount = averageInvoiceAmount; }
    
    public BigDecimal getAveragePaymentAmount() { return averagePaymentAmount; }
    public void setAveragePaymentAmount(BigDecimal averagePaymentAmount) { this.averagePaymentAmount = averagePaymentAmount; }
    
    public Double getAverageDaysToPayment() { return averageDaysToPayment; }
    public void setAverageDaysToPayment(Double averageDaysToPayment) { this.averageDaysToPayment = averageDaysToPayment; }
}