package com.hospital.management.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.management.entity.Invoice;
import com.hospital.management.entity.Payment;
import com.hospital.management.entity.PaymentMethod;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    // Find payments by invoice
    List<Payment> findByInvoiceOrderByPaymentDateDesc(Invoice invoice);
    
    // Find by payment number
    Payment findByPaymentNumber(String paymentNumber);
    
    // Find payments by payment method
    List<Payment> findByPaymentMethod(PaymentMethod paymentMethod);
    
    // Find payments by date range
    @Query("SELECT p FROM Payment p WHERE p.paymentDate BETWEEN :startDate AND :endDate ORDER BY p.paymentDate DESC")
    List<Payment> findByPaymentDateBetween(@Param("startDate") LocalDateTime startDate, 
                                           @Param("endDate") LocalDateTime endDate);
    
    // Get total paid amount for an invoice
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.invoice = :invoice")
    BigDecimal getTotalPaidForInvoice(@Param("invoice") Invoice invoice);
    
    // Financial reporting queries
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE CAST(p.paymentDate AS date) BETWEEN :startDate AND :endDate")
    BigDecimal getTotalPaymentsInDateRange(@Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    // Payment method breakdown
    @Query("SELECT p.paymentMethod, SUM(p.amount) FROM Payment p " +
           "WHERE CAST(p.paymentDate AS date) BETWEEN :startDate AND :endDate " +
           "GROUP BY p.paymentMethod")
    List<Object[]> getPaymentMethodBreakdown(@Param("startDate") LocalDate startDate, 
                                            @Param("endDate") LocalDate endDate);
    
    // Monthly payments breakdown
    @Query("SELECT FUNCTION('YEAR', p.paymentDate) as year, FUNCTION('MONTH', p.paymentDate) as month, SUM(p.amount) as total " +
           "FROM Payment p WHERE CAST(p.paymentDate AS date) BETWEEN :startDate AND :endDate " +
           "GROUP BY FUNCTION('YEAR', p.paymentDate), FUNCTION('MONTH', p.paymentDate) " +
           "ORDER BY year, month")
    List<Object[]> getMonthlyPayments(@Param("startDate") LocalDate startDate, 
                                      @Param("endDate") LocalDate endDate);
    
    // Average payment amount
    @Query("SELECT AVG(p.amount) FROM Payment p WHERE CAST(p.paymentDate AS date) BETWEEN :startDate AND :endDate")
    BigDecimal getAveragePaymentAmount(@Param("startDate") LocalDate startDate, 
                                       @Param("endDate") LocalDate endDate);
    
    // Average days to payment (from invoice date to payment date)
    // Temporarily disabled due to H2 compatibility issues
    // @Query("SELECT AVG(p.paymentDate - p.invoice.invoiceDate) " +
    //        "FROM Payment p WHERE DATE(p.paymentDate) BETWEEN :startDate AND :endDate")
    // Double getAverageDaysToPayment(@Param("startDate") LocalDate startDate, 
    //                                @Param("endDate") LocalDate endDate);
    
    // Check if payment number already exists
    boolean existsByPaymentNumber(String paymentNumber);
    
    // Get recent payments (for dashboard, etc.)
    @Query("SELECT p FROM Payment p ORDER BY p.createdAt DESC")
    List<Payment> findRecentPayments();
}