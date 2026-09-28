package com.hospital.management.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.management.entity.Invoice;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.PaymentStatus;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    // Find by patient
    List<Invoice> findByPatientOrderByInvoiceDateDesc(Patient patient);
    
    // Find by invoice number
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    // Find by payment status
    List<Invoice> findByPaymentStatus(PaymentStatus paymentStatus);
    
    // Find overdue invoices
    @Query("SELECT i FROM Invoice i WHERE i.paymentStatus = :status AND i.dueDate < :currentDate")
    List<Invoice> findOverdueInvoices(@Param("status") PaymentStatus status, @Param("currentDate") LocalDate currentDate);
    
    // Find invoices by date range
    @Query("SELECT i FROM Invoice i WHERE i.invoiceDate BETWEEN :startDate AND :endDate ORDER BY i.invoiceDate DESC")
    List<Invoice> findByInvoiceDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    // Financial reporting queries
    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.invoiceDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalInvoicedAmount(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT COUNT(i) FROM Invoice i WHERE i.paymentStatus = :status AND i.invoiceDate BETWEEN :startDate AND :endDate")
    int countInvoicesByStatusAndDateRange(@Param("status") PaymentStatus status, 
                                          @Param("startDate") LocalDate startDate, 
                                          @Param("endDate") LocalDate endDate);
    
    @Query("SELECT SUM(i.totalAmount) FROM Invoice i WHERE i.paymentStatus = :status AND i.invoiceDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalAmountByStatusAndDateRange(@Param("status") PaymentStatus status,
                                                  @Param("startDate") LocalDate startDate, 
                                                  @Param("endDate") LocalDate endDate);
    
    // Get invoices for a specific patient by date range
    @Query("SELECT i FROM Invoice i WHERE i.patient = :patient AND i.invoiceDate BETWEEN :startDate AND :endDate ORDER BY i.invoiceDate DESC")
    List<Invoice> findByPatientAndDateRange(@Param("patient") Patient patient, 
                                           @Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    // Get top patients by total invoiced amount
    @Query("SELECT i.patient, SUM(i.totalAmount) as total FROM Invoice i " +
           "WHERE i.invoiceDate BETWEEN :startDate AND :endDate " +
           "GROUP BY i.patient ORDER BY total DESC")
    List<Object[]> getTopPatientsByRevenue(@Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    // Get monthly revenue breakdown
    @Query("SELECT FUNCTION('YEAR', i.invoiceDate) as year, FUNCTION('MONTH', i.invoiceDate) as month, SUM(i.totalAmount) as total " +
           "FROM Invoice i WHERE i.invoiceDate BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('YEAR', i.invoiceDate), FUNCTION('MONTH', i.invoiceDate) " +
           "ORDER BY year, month")
    List<Object[]> getMonthlyRevenue(@Param("startDate") LocalDate startDate, 
                                     @Param("endDate") LocalDate endDate);
    
    // Get average invoice amount
    @Query("SELECT AVG(i.totalAmount) FROM Invoice i WHERE i.invoiceDate BETWEEN :startDate AND :endDate")
    BigDecimal getAverageInvoiceAmount(@Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);
    
    // Check if invoice number already exists
    boolean existsByInvoiceNumber(String invoiceNumber);
    
    // For recent activity
    List<Invoice> findTop3ByOrderByCreatedAtDesc();
}