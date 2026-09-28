package com.hospital.management.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.AppointmentStatsResponse;
import com.hospital.management.dto.FinancialReportResponse;
import com.hospital.management.dto.PatientReportResponse;
import com.hospital.management.service.ReportingService;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportingController {
    
    @Autowired
    private ReportingService reportingService;
    
    /**
     * Generate comprehensive patient report
     */
    @GetMapping("/patient/{patientId}")
    // // @PreAuthorize("hasRole('DOCTOR') or hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<PatientReportResponse> generatePatientReport(@PathVariable Long patientId) {
        try {
            PatientReportResponse report = reportingService.generatePatientReport(patientId);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Generate appointment statistics report
     */
    @GetMapping("/appointments/stats")
    // // @PreAuthorize("hasRole('DOCTOR') or hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<AppointmentStatsResponse> generateAppointmentStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            AppointmentStatsResponse stats = reportingService.generateAppointmentStats(startDate, endDate);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Generate financial report
     */
    @GetMapping("/financial")
    // @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('RECEPTIONIST')")
    public ResponseEntity<FinancialReportResponse> generateFinancialReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            FinancialReportResponse report = reportingService.generateFinancialReport(startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Generate appointment stats for current month (convenience method)
     */
    @GetMapping("/appointments/stats/current-month")
    // @PreAuthorize("hasRole('DOCTOR') or hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<AppointmentStatsResponse> getCurrentMonthAppointmentStats() {
        try {
            LocalDate startDate = LocalDate.now().withDayOfMonth(1);
            LocalDate endDate = LocalDate.now();
            AppointmentStatsResponse stats = reportingService.generateAppointmentStats(startDate, endDate);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Generate financial report for current month (convenience method)
     */
    @GetMapping("/financial/current-month")
    // @PreAuthorize("hasRole('HOSPITAL_MANAGER') or hasRole('RECEPTIONIST')")
    public ResponseEntity<FinancialReportResponse> getCurrentMonthFinancialReport() {
        try {
            LocalDate startDate = LocalDate.now().withDayOfMonth(1);
            LocalDate endDate = LocalDate.now();
            FinancialReportResponse report = reportingService.generateFinancialReport(startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Generate financial report for current year (convenience method)
     */
    @GetMapping("/financial/current-year")
    // @PreAuthorize("hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<FinancialReportResponse> getCurrentYearFinancialReport() {
        try {
            LocalDate startDate = LocalDate.now().withDayOfYear(1);
            LocalDate endDate = LocalDate.now();
            FinancialReportResponse report = reportingService.generateFinancialReport(startDate, endDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}