package com.hospital.management.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.AppointmentStatus;
import com.hospital.management.entity.Role;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.InvoiceRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "http://localhost:3000")
public class DashboardController {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @GetMapping("/receptionist/stats")
    public ResponseEntity<Map<String, Object>> getReceptionistStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Get today's date range
            LocalDate today = LocalDate.now();
            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
            
            // Today's Appointments
            List<Appointment> todaysAppointments = appointmentRepository.findByAppointmentDateTimeBetween(startOfDay, endOfDay);
            stats.put("todaysAppointments", todaysAppointments.size());
            
            // Walk-in Patients (appointments marked as walk-in in notes)
            long walkInPatients = todaysAppointments.stream()
                .filter(apt -> apt.getNotes() != null && apt.getNotes().toLowerCase().contains("walk-in"))
                .count();
            stats.put("walkInPatients", (int) walkInPatients);
            
            // Pending Check-ins (appointments with REQUESTED, APPROVED, or CONFIRMED status today)
            long pendingCheckIns = todaysAppointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.REQUESTED || 
                              apt.getStatus() == AppointmentStatus.APPROVED ||
                              apt.getStatus() == AppointmentStatus.CONFIRMED)
                .count();
            stats.put("pendingCheckIns", (int) pendingCheckIns);
            
            // Completed Today (appointments with COMPLETED status today)
            long completedToday = todaysAppointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.COMPLETED)
                .count();
            stats.put("completedToday", (int) completedToday);
            
            // Additional stats
            stats.put("totalPatients", (int) patientRepository.count());
            
            // Count staff by role
            Long doctorCount = userRepository.countActiveUsersByRole(Role.DOCTOR);
            Long nurseCount = userRepository.countActiveUsersByRole(Role.NURSE);
            stats.put("totalStaff", (doctorCount != null ? doctorCount.intValue() : 0) + 
                                   (nurseCount != null ? nurseCount.intValue() : 0));
            
            // Billing statistics for receptionists
            try {
                LocalDate startOfMonth = today.withDayOfMonth(1);
                
                // Count pending and overdue invoices
                int pendingInvoices = invoiceRepository.countInvoicesByStatusAndDateRange(
                    com.hospital.management.entity.PaymentStatus.PENDING, startOfMonth, today);
                int overdueInvoices = invoiceRepository.countInvoicesByStatusAndDateRange(
                    com.hospital.management.entity.PaymentStatus.OVERDUE, startOfMonth, today);
                
                stats.put("pendingInvoices", pendingInvoices);
                stats.put("overdueInvoices", overdueInvoices);
                
                // Total outstanding amount (pending + overdue)
                java.math.BigDecimal pendingAmount = invoiceRepository.getTotalAmountByStatusAndDateRange(
                    com.hospital.management.entity.PaymentStatus.PENDING, startOfMonth, today);
                java.math.BigDecimal overdueAmount = invoiceRepository.getTotalAmountByStatusAndDateRange(
                    com.hospital.management.entity.PaymentStatus.OVERDUE, startOfMonth, today);
                
                double totalOutstanding = (pendingAmount != null ? pendingAmount.doubleValue() : 0.0) +
                                        (overdueAmount != null ? overdueAmount.doubleValue() : 0.0);
                stats.put("outstandingAmount", totalOutstanding);
                
                // Today's revenue (all invoices created today)
                java.math.BigDecimal todaysRevenue = invoiceRepository.getTotalInvoicedAmount(today, today);
                
                // Add appointment revenue (confirmed appointments today)
                java.math.BigDecimal appointmentRevenue = getAppointmentRevenue(startOfDay, endOfDay);
                double totalTodaysRevenue = (todaysRevenue != null ? todaysRevenue.doubleValue() : 0.0) +
                                          (appointmentRevenue != null ? appointmentRevenue.doubleValue() : 0.0);
                
                stats.put("todaysRevenue", totalTodaysRevenue);
            } catch (Exception e) {
                // Billing stats not critical, continue without them
                stats.put("pendingInvoices", 0);
                stats.put("overdueInvoices", 0);
                stats.put("outstandingAmount", 0.0);
                stats.put("todaysRevenue", 0.0);
            }
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            // Return default values if there's an error
            stats.put("todaysAppointments", 0);
            stats.put("walkInPatients", 0);
            stats.put("pendingCheckIns", 0);
            stats.put("completedToday", 0);
            stats.put("totalPatients", (int) patientRepository.count());
            stats.put("totalStaff", 0);
            
            return ResponseEntity.ok(stats);
        }
    }
    
    @GetMapping("/doctor/stats")
    public ResponseEntity<Map<String, Object>> getDoctorStats() {
        Map<String, Object> stats = new HashMap<>();
        
        try {
            // Get today's date range
            LocalDate today = LocalDate.now();
            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
            
            // Today's Appointments
            List<Appointment> todaysAppointments = appointmentRepository.findByAppointmentDateTimeBetween(startOfDay, endOfDay);
            stats.put("todaysAppointments", todaysAppointments.size());
            
            // Total Patients
            stats.put("totalPatients", (int) patientRepository.count());
            
            // Pending Reviews (appointments with REQUESTED or APPROVED status)
            long pendingReviews = appointmentRepository.countByStatus(AppointmentStatus.REQUESTED) + 
                                 appointmentRepository.countByStatus(AppointmentStatus.APPROVED);
            stats.put("pendingReviews", (int) pendingReviews);
            
            // Completed Today
            long completedToday = todaysAppointments.stream()
                .filter(apt -> apt.getStatus() == AppointmentStatus.COMPLETED)
                .count();
            stats.put("completedToday", (int) completedToday);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            // Return default values if there's an error
            stats.put("todaysAppointments", 0);
            stats.put("totalPatients", (int) patientRepository.count());
            stats.put("pendingReviews", 0);
            stats.put("completedToday", 0);
            
            return ResponseEntity.ok(stats);
        }
    }
    
    @GetMapping("/appointments/today")
    public ResponseEntity<List<Appointment>> getTodaysAppointments() {
        try {
            LocalDate today = LocalDate.now();
            LocalDateTime startOfDay = today.atStartOfDay();
            LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
            
            List<Appointment> appointments = appointmentRepository.findByAppointmentDateTimeBetween(startOfDay, endOfDay);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.ok(List.of()); // Return empty list on error
        }
    }
    
    /**
     * Helper method to calculate appointment revenue for a given time period
     * This includes confirmed appointments that represent direct appointment booking revenue
     */
    private java.math.BigDecimal getAppointmentRevenue(LocalDateTime startDate, LocalDateTime endDate) {
        try {
            // Get all confirmed appointments in the date range
            List<Appointment> confirmedAppointments = appointmentRepository
                .findByAppointmentDateTimeBetweenAndStatus(startDate, endDate, AppointmentStatus.CONFIRMED);
            
            // For now, use a fixed appointment fee (in a real system, this would come from service pricing)
            java.math.BigDecimal appointmentFee = new java.math.BigDecimal("100.00"); // $100 per appointment
            
            return appointmentFee.multiply(new java.math.BigDecimal(confirmedAppointments.size()));
        } catch (Exception e) {
            return java.math.BigDecimal.ZERO;
        }
    }
}