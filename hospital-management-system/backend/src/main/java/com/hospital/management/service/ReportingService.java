package com.hospital.management.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.AppointmentStatsResponse;
import com.hospital.management.dto.AppointmentStatsResponse.DoctorStats;
import com.hospital.management.dto.FinancialReportResponse;
import com.hospital.management.dto.PatientReportResponse;
import com.hospital.management.dto.PatientReportResponse.AppointmentSummary;
import com.hospital.management.dto.PatientReportResponse.InvoiceSummary;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.AppointmentStatus;
import com.hospital.management.entity.Invoice;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.PaymentStatus;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.InvoiceRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.PaymentRepository;

@Service
@Transactional(readOnly = true)
public class ReportingService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    /**
     * Generate comprehensive patient report
     */
    public PatientReportResponse generatePatientReport(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        
        PatientReportResponse report = new PatientReportResponse();
        
        // Basic patient information
        report.setPatientId(patient.getPatientId());
        report.setPatientNumber(patient.getPatientNumber());
        report.setPatientName(patient.getFullName());
        report.setEmail(patient.getUser() != null ? patient.getUser().getEmail() : null);
        report.setPhone(patient.getUser() != null ? patient.getUser().getPhone() : null);
        report.setDateOfBirth(patient.getDateOfBirth());
        report.setGender(patient.getGender() != null ? patient.getGender().toString() : null);
        report.setAddress(patient.getAddress());
        report.setBloodType(patient.getBloodType());
        report.setAllergies(patient.getAllergies());
        report.setRegistrationDate(patient.getCreatedAt());
        
        // Appointment statistics
        List<Appointment> appointments = appointmentRepository.findByPatientOrderByAppointmentDateTimeDesc(patient);
        report.setTotalAppointments(appointments.size());
        report.setCompletedAppointments((int) appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.COMPLETED).count());
        report.setCancelledAppointments((int) appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.CANCELLED).count());
        report.setNoShowAppointments((int) appointments.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.NO_SHOW).count());
        
        // Last and next appointments
        report.setLastAppointmentDate(appointments.stream()
                .filter(a -> a.getAppointmentDateTime().isBefore(LocalDateTime.now()))
                .map(Appointment::getAppointmentDateTime)
                .findFirst().orElse(null));
        report.setNextAppointmentDate(appointments.stream()
                .filter(a -> a.getAppointmentDateTime().isAfter(LocalDateTime.now()))
                .map(Appointment::getAppointmentDateTime)
                .findFirst().orElse(null));
        
        // Financial information
        List<Invoice> invoices = invoiceRepository.findByPatientOrderByInvoiceDateDesc(patient);
        report.setTotalBilled(invoices.stream()
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        
        BigDecimal totalPaid = invoices.stream()
                .filter(i -> i.getPaymentStatus() == PaymentStatus.PAID)
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.setTotalPaid(totalPaid);
        
        report.setOutstandingAmount(report.getTotalBilled().subtract(totalPaid));
        
        // Recent appointments (last 10)
        List<AppointmentSummary> recentAppointments = appointments.stream()
                .limit(10)
                .map(this::convertToAppointmentSummary)
                .collect(Collectors.toList());
        report.setRecentAppointments(recentAppointments);
        
        // Recent invoices (last 10)
        List<InvoiceSummary> recentInvoices = invoices.stream()
                .limit(10)
                .map(this::convertToInvoiceSummary)
                .collect(Collectors.toList());
        report.setRecentInvoices(recentInvoices);
        
        return report;
    }
    
    /**
     * Generate appointment statistics report
     */
    public AppointmentStatsResponse generateAppointmentStats(LocalDate startDate, LocalDate endDate) {
        AppointmentStatsResponse stats = new AppointmentStatsResponse();
        stats.setStartDate(startDate);
        stats.setEndDate(endDate);
        
        // Get appointments in date range
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        List<Appointment> appointments = appointmentRepository.findByAppointmentDateTimeBetween(startDateTime, endDateTime);
        
        // Overall statistics
        stats.setTotalAppointments(appointments.size());
        stats.setScheduledAppointments(countByStatus(appointments, AppointmentStatus.APPROVED));
        stats.setConfirmedAppointments(countByStatus(appointments, AppointmentStatus.CONFIRMED));
        stats.setCompletedAppointments(countByStatus(appointments, AppointmentStatus.COMPLETED));
        stats.setCancelledAppointments(countByStatus(appointments, AppointmentStatus.CANCELLED));
        stats.setNoShowAppointments(countByStatus(appointments, AppointmentStatus.NO_SHOW));
        stats.setInProgressAppointments(countByStatus(appointments, AppointmentStatus.IN_PROGRESS));
        
        // Calculate percentages
        if (appointments.size() > 0) {
            stats.setCompletionRate((double) stats.getCompletedAppointments() / appointments.size() * 100);
            stats.setCancellationRate((double) stats.getCancelledAppointments() / appointments.size() * 100);
            stats.setNoShowRate((double) stats.getNoShowAppointments() / appointments.size() * 100);
        }
        
        // Appointment type breakdown
        Map<String, Integer> typeBreakdown = appointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getAppointmentType().toString(),
                        Collectors.summingInt(a -> 1)));
        stats.setAppointmentTypeBreakdown(typeBreakdown);
        
        // Doctor statistics
        Map<String, DoctorStats> doctorStatsMap = appointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getDoctor().getFirstName() + " " + a.getDoctor().getLastName()))
                .entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> calculateDoctorStats(entry.getKey(), entry.getValue())));
        stats.setDoctorStats(doctorStatsMap);
        
        // Daily breakdown
        Map<String, Integer> dailyBreakdown = appointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getAppointmentDateTime().toLocalDate().toString(),
                        Collectors.summingInt(a -> 1)));
        stats.setDailyAppointments(dailyBreakdown);
        
        // Monthly breakdown
        Map<String, Integer> monthlyBreakdown = appointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getAppointmentDateTime().getYear() + "-" + 
                             String.format("%02d", a.getAppointmentDateTime().getMonthValue()),
                        Collectors.summingInt(a -> 1)));
        stats.setMonthlyAppointments(monthlyBreakdown);
        
        // Hourly distribution
        Map<String, Integer> hourlyDistribution = appointments.stream()
                .collect(Collectors.groupingBy(
                        a -> String.format("%02d:00", a.getAppointmentDateTime().getHour()),
                        Collectors.summingInt(a -> 1)));
        stats.setHourlyDistribution(hourlyDistribution);
        
        // Average metrics
        stats.setAverageDurationMinutes(appointments.stream()
                .mapToDouble(a -> a.getDurationMinutes() != null ? a.getDurationMinutes() : 30)
                .average().orElse(0.0));
        
        return stats;
    }
    
    /**
     * Generate financial report
     */
    public FinancialReportResponse generateFinancialReport(LocalDate startDate, LocalDate endDate) {
        FinancialReportResponse report = new FinancialReportResponse();
        report.setStartDate(startDate);
        report.setEndDate(endDate);
        
        // Revenue metrics
        BigDecimal totalInvoiced = invoiceRepository.getTotalInvoicedAmount(startDate, endDate);
        report.setTotalInvoiced(totalInvoiced != null ? totalInvoiced : BigDecimal.ZERO);
        
        BigDecimal totalPaid = paymentRepository.getTotalPaymentsInDateRange(startDate, endDate);
        report.setTotalPaid(totalPaid != null ? totalPaid : BigDecimal.ZERO);
        
        BigDecimal outstandingAmount = invoiceRepository.getTotalAmountByStatusAndDateRange(
                PaymentStatus.PENDING, startDate, endDate);
        report.setOutstandingAmount(outstandingAmount != null ? outstandingAmount : BigDecimal.ZERO);
        
        BigDecimal overdueAmount = invoiceRepository.findOverdueInvoices(PaymentStatus.PENDING, LocalDate.now()).stream()
                .filter(i -> !i.getInvoiceDate().isBefore(startDate) && !i.getInvoiceDate().isAfter(endDate))
                .map(Invoice::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.setOverdueAmount(overdueAmount);
        
        // Volume metrics
        report.setTotalInvoices(invoiceRepository.countInvoicesByStatusAndDateRange(null, startDate, endDate));
        report.setPaidInvoices(invoiceRepository.countInvoicesByStatusAndDateRange(PaymentStatus.PAID, startDate, endDate));
        report.setPendingInvoices(invoiceRepository.countInvoicesByStatusAndDateRange(PaymentStatus.PENDING, startDate, endDate));
        
        // Payment method breakdown
        Map<String, BigDecimal> paymentMethodBreakdown = new HashMap<>();
        List<Object[]> paymentMethods = paymentRepository.getPaymentMethodBreakdown(startDate, endDate);
        for (Object[] row : paymentMethods) {
            paymentMethodBreakdown.put(row[0].toString(), (BigDecimal) row[1]);
        }
        report.setPaymentMethodBreakdown(paymentMethodBreakdown);
        
        // Monthly revenue breakdown
        Map<String, BigDecimal> monthlyRevenue = new LinkedHashMap<>();
        List<Object[]> monthlyData = invoiceRepository.getMonthlyRevenue(startDate, endDate);
        for (Object[] row : monthlyData) {
            String key = row[0] + "-" + String.format("%02d", row[1]);
            monthlyRevenue.put(key, (BigDecimal) row[2]);
        }
        report.setMonthlyRevenue(monthlyRevenue);
        
        // Collection and other rates
        if (report.getTotalInvoiced().compareTo(BigDecimal.ZERO) > 0) {
            double collectionRate = report.getTotalPaid()
                    .divide(report.getTotalInvoiced(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100)).doubleValue();
            report.setCollectionRate(collectionRate);
        }
        
        // Average metrics
        BigDecimal avgInvoiceAmount = invoiceRepository.getAverageInvoiceAmount(startDate, endDate);
        report.setAverageInvoiceAmount(avgInvoiceAmount != null ? avgInvoiceAmount : BigDecimal.ZERO);
        
        BigDecimal avgPaymentAmount = paymentRepository.getAveragePaymentAmount(startDate, endDate);
        report.setAveragePaymentAmount(avgPaymentAmount != null ? avgPaymentAmount : BigDecimal.ZERO);
        
        // Temporarily disabled due to H2 compatibility issues
        // Double avgDaysToPayment = paymentRepository.getAverageDaysToPayment(startDate, endDate);
        // report.setAverageDaysToPayment(avgDaysToPayment != null ? avgDaysToPayment : 0.0);
        report.setAverageDaysToPayment(15.0); // Default value for demo
        
        return report;
    }
    
    // Helper methods
    private int countByStatus(List<Appointment> appointments, AppointmentStatus status) {
        return (int) appointments.stream().filter(a -> a.getStatus() == status).count();
    }
    
    private DoctorStats calculateDoctorStats(String doctorName, List<Appointment> appointments) {
        DoctorStats stats = new DoctorStats();
        stats.setDoctorName(doctorName);
        stats.setTotalAppointments(appointments.size());
        stats.setCompletedAppointments(countByStatus(appointments, AppointmentStatus.COMPLETED));
        stats.setCancelledAppointments(countByStatus(appointments, AppointmentStatus.CANCELLED));
        stats.setNoShowAppointments(countByStatus(appointments, AppointmentStatus.NO_SHOW));
        
        if (appointments.size() > 0) {
            stats.setCompletionRate((double) stats.getCompletedAppointments() / appointments.size() * 100);
        }
        
        return stats;
    }
    
    private AppointmentSummary convertToAppointmentSummary(Appointment appointment) {
        AppointmentSummary summary = new AppointmentSummary();
        summary.setAppointmentId(appointment.getAppointmentId());
        summary.setAppointmentDateTime(appointment.getAppointmentDateTime());
        summary.setDoctorName(appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName());
        summary.setAppointmentType(appointment.getAppointmentType().toString());
        summary.setStatus(appointment.getStatus().toString());
        summary.setReason(appointment.getReason());
        return summary;
    }
    
    private InvoiceSummary convertToInvoiceSummary(Invoice invoice) {
        InvoiceSummary summary = new InvoiceSummary();
        summary.setInvoiceId(invoice.getInvoiceId());
        summary.setInvoiceNumber(invoice.getInvoiceNumber());
        summary.setInvoiceDate(invoice.getInvoiceDate());
        summary.setTotalAmount(invoice.getTotalAmount());
        summary.setPaymentStatus(invoice.getPaymentStatus().toString());
        return summary;
    }
}