package com.hospital.management.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.ActivityLogResponse;
import com.hospital.management.repository.UserRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.InvoiceRepository;
import com.hospital.management.repository.AppointmentRepository;

@RestController
@RequestMapping("/activity")
@CrossOrigin(origins = "http://localhost:3000")
public class ActivityController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping("/recent")
    public ResponseEntity<List<ActivityLogResponse>> getRecentActivity(
            @RequestParam(defaultValue = "5") int limit) {
        
        List<ActivityLogResponse> activities = new ArrayList<>();
        
        try {
            // Get recent users (created in last 30 days)
            var recentUsers = userRepository.findTop5ByOrderByCreatedAtDesc();
            for (var user : recentUsers) {
                if (user.getCreatedAt().isAfter(LocalDateTime.now().minusDays(30))) {
                    activities.add(new ActivityLogResponse(
                        "USER_CREATED",
                        "New " + user.getRole().toString().toLowerCase() + " added: " + user.getFirstName() + " " + user.getLastName(),
                        user.getRole() + " account created",
                        user.getCreatedAt(),
                        getActivityIcon("USER_CREATED"),
                        getActivityColor("USER_CREATED")
                    ));
                }
            }

            // Get recent patients
            var recentPatients = patientRepository.findTop3ByOrderByCreatedAtDesc();
            for (var patient : recentPatients) {
                if (patient.getCreatedAt().isAfter(LocalDateTime.now().minusDays(30))) {
                    activities.add(new ActivityLogResponse(
                        "PATIENT_REGISTERED",
                        "New patient registered: " + patient.getUser().getFirstName() + " " + patient.getUser().getLastName(),
                        "Patient ID: " + patient.getPatientNumber(),
                        patient.getCreatedAt(),
                        getActivityIcon("PATIENT_REGISTERED"),
                        getActivityColor("PATIENT_REGISTERED")
                    ));
                }
            }

            // Get recent invoices
            var recentInvoices = invoiceRepository.findTop3ByOrderByCreatedAtDesc();
            for (var invoice : recentInvoices) {
                if (invoice.getCreatedAt().isAfter(LocalDateTime.now().minusDays(30))) {
                    activities.add(new ActivityLogResponse(
                        "INVOICE_CREATED",
                        "New invoice generated: " + invoice.getInvoiceNumber(),
                        "Amount: $" + invoice.getTotalAmount(),
                        invoice.getCreatedAt(),
                        getActivityIcon("INVOICE_CREATED"),
                        getActivityColor("INVOICE_CREATED")
                    ));
                }
            }

            // Get recent appointments
            var recentAppointments = appointmentRepository.findTop3ByOrderByCreatedAtDesc();
            for (var appointment : recentAppointments) {
                if (appointment.getCreatedAt() != null && appointment.getCreatedAt().isAfter(LocalDateTime.now().minusDays(30))) {
                    activities.add(new ActivityLogResponse(
                        "APPOINTMENT_SCHEDULED",
                        "Appointment scheduled with Dr. " + appointment.getDoctor().getLastName(),
                        "Patient: " + appointment.getPatient().getUser().getFirstName() + " " + appointment.getPatient().getUser().getLastName(),
                        appointment.getCreatedAt(),
                        getActivityIcon("APPOINTMENT_SCHEDULED"),
                        getActivityColor("APPOINTMENT_SCHEDULED")
                    ));
                }
            }

            // Sort by creation time (most recent first)
            activities.sort((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()));

            // Limit results
            if (activities.size() > limit) {
                activities = activities.subList(0, limit);
            }

            return ResponseEntity.ok(activities);

        } catch (Exception e) {
            // Return empty list if there's an error
            return ResponseEntity.ok(new ArrayList<>());
        }
    }

    private String getActivityIcon(String activityType) {
        switch (activityType) {
            case "USER_CREATED": return "PeopleIcon";
            case "PATIENT_REGISTERED": return "PersonAddIcon";
            case "INVOICE_CREATED": return "ReceiptIcon";
            case "APPOINTMENT_SCHEDULED": return "CalendarIcon";
            default: return "InfoIcon";
        }
    }

    private String getActivityColor(String activityType) {
        switch (activityType) {
            case "USER_CREATED": return "primary";
            case "PATIENT_REGISTERED": return "success";
            case "INVOICE_CREATED": return "warning";
            case "APPOINTMENT_SCHEDULED": return "info";
            default: return "default";
        }
    }
}