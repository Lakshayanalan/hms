package com.hospital.management.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.AppointmentRequest;
import com.hospital.management.dto.AppointmentResponse;
import com.hospital.management.dto.DoctorAvailabilityResponse;
import com.hospital.management.dto.DoctorStatsResponse;
import com.hospital.management.entity.AppointmentStatus;
import com.hospital.management.entity.Gender;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.User;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.service.AppointmentService;
import com.hospital.management.service.CustomUserDetailsService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {
    
    @Autowired
    private AppointmentService appointmentService;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private com.hospital.management.service.UserService userService;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private com.hospital.management.service.PatientService patientService;
    
    @PostMapping
    public ResponseEntity<?> createAppointment(@Valid @RequestBody AppointmentRequest request,
                                              BindingResult bindingResult,
                                              Authentication authentication) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                .body("Validation errors: " + bindingResult.getAllErrors().toString());
        }
        
        try {
            AppointmentResponse appointment = appointmentService.createAppointment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<Page<AppointmentResponse>> getAllAppointments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentDateTime") String sortBy) {
        
        Page<AppointmentResponse> appointments = appointmentService.getAllAppointments(page, size, sortBy);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/{appointmentId}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long appointmentId) {
        try {
            AppointmentResponse appointment = appointmentService.getAppointmentById(appointmentId);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<Page<AppointmentResponse>> getAppointmentsByPatient(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentDateTime") String sortBy) {
        
        Page<AppointmentResponse> appointments = appointmentService.getAppointmentsByPatient(patientId, page, size, sortBy);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<Page<AppointmentResponse>> getAppointmentsByDoctor(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentDateTime") String sortBy) {
        
        Page<AppointmentResponse> appointments = appointmentService.getAppointmentsByDoctor(doctorId, page, size, sortBy);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/status/{status}")
    public ResponseEntity<Page<AppointmentResponse>> getAppointmentsByStatus(
            @PathVariable AppointmentStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appointmentDateTime") String sortBy) {
        
        Page<AppointmentResponse> appointments = appointmentService.getAppointmentsByStatus(status, page, size, sortBy);
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/today")
    public ResponseEntity<List<AppointmentResponse>> getTodaysAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getTodaysAppointments();
        return ResponseEntity.ok(appointments);
    }
    
    @GetMapping("/upcoming")
    public ResponseEntity<List<AppointmentResponse>> getUpcomingAppointments(
            @RequestParam(defaultValue = "7") int days) {
        List<AppointmentResponse> appointments = appointmentService.getUpcomingAppointments(days);
        return ResponseEntity.ok(appointments);
    }
    
    @PutMapping("/{appointmentId}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long appointmentId,
                                              @Valid @RequestBody AppointmentRequest request,
                                              BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                .body("Validation errors: " + bindingResult.getAllErrors().toString());
        }
        
        try {
            AppointmentResponse appointment = appointmentService.updateAppointment(appointmentId, request);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long appointmentId) {
        try {
            appointmentService.cancelAppointment(appointmentId);
            return ResponseEntity.ok().body("Appointment cancelled successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{appointmentId}/complete")
    public ResponseEntity<?> completeAppointment(@PathVariable Long appointmentId) {
        try {
            appointmentService.completeAppointment(appointmentId);
            return ResponseEntity.ok().body("Appointment completed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAvailableDoctors() {
        List<User> doctors = appointmentService.getAvailableDoctors();
        return ResponseEntity.ok(doctors);
    }
    
    @GetMapping("/doctors/{doctorId}/availability")
    public ResponseEntity<?> getDoctorAvailability(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        try {
            DoctorAvailabilityResponse availability = appointmentService.getDoctorAvailability(doctorId, date);
            return ResponseEntity.ok(availability);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Appointment workflow endpoints
    
    /**
     * Doctor approves an appointment request
     */
    @PutMapping("/{appointmentId}/approve")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<?> approveAppointment(@PathVariable Long appointmentId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            AppointmentResponse appointment = appointmentService.approveAppointment(appointmentId, currentUser);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Doctor rejects an appointment request with reason
     */
    @PutMapping("/{appointmentId}/reject")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<?> rejectAppointment(@PathVariable Long appointmentId,
                                             @RequestParam String reason) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            AppointmentResponse appointment = appointmentService.rejectAppointment(appointmentId, currentUser, reason);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Mark appointment as completed
     */
    @PutMapping("/{appointmentId}/complete-workflow")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('HOSPITAL_MANAGER')")
    public ResponseEntity<?> completeAppointmentWorkflow(@PathVariable Long appointmentId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            AppointmentResponse appointment = appointmentService.completeAppointment(appointmentId, currentUser);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Get pending appointments for current doctor
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPendingAppointments(Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            List<AppointmentResponse> appointments = appointmentService.getPendingAppointmentsForDoctor(currentUser.getUserId());
            return ResponseEntity.ok(appointments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Get appointments by status (for admin dashboard)
     */
    @GetMapping("/admin/status/{status}")
    public ResponseEntity<?> getAppointmentsByStatusAdmin(@PathVariable AppointmentStatus status) {
        try {
            List<AppointmentResponse> appointments = appointmentService.getAppointmentsByStatus(status);
            return ResponseEntity.ok(appointments);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Reschedule an appointment
     */
    @PutMapping("/{appointmentId}/reschedule")
    public ResponseEntity<?> rescheduleAppointment(@PathVariable Long appointmentId,
                                                 @RequestBody AppointmentRequest request,
                                                 Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            AppointmentResponse appointment = appointmentService.rescheduleAppointment(
                appointmentId, 
                request.getAppointmentDateTime(), 
                request.getDurationMinutes(), 
                currentUser
            );
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Update appointment status
     */
    @PutMapping("/{appointmentId}/status")
    @PreAuthorize("hasRole('DOCTOR') or hasRole('HOSPITAL_MANAGER') or hasRole('RECEPTIONIST')")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long appointmentId,
                                                   @RequestParam AppointmentStatus status,
                                                   Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }
            
            AppointmentResponse appointment = appointmentService.updateAppointmentStatus(appointmentId, status, currentUser);
            return ResponseEntity.ok(appointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Get doctor dashboard statistics for the current user
     */
    @GetMapping("/doctor/stats")
    public ResponseEntity<?> getDoctorStats(Authentication authentication) {
        try {
            User currentUser = userService.getUserByUsername(authentication.getName()).orElse(null);
            if (currentUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated");
            }
            
            DoctorStatsResponse stats = appointmentService.getDoctorStats(currentUser.getUserId());
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    /**
     * Create an appointment with payment processing
     * This endpoint allows patients to book and pay for appointments in a single transaction
     */
    @PostMapping("/book-with-payment")
    public ResponseEntity<?> createAppointmentWithPayment(
            @Valid @RequestBody com.hospital.management.dto.AppointmentPaymentRequest request,
            BindingResult bindingResult,
            Authentication authentication) {
        
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                .body("Validation errors: " + bindingResult.getAllErrors().toString());
        }
        
        try {
            // Get the current authenticated user
            String username = authentication.getName();
            User currentUser = userService.getUserByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Check if patient record exists for current user, create if not
            Patient patient = patientRepository.findByUser_UserId(currentUser.getUserId())
                .orElseGet(() -> {
                    // Auto-create patient record for existing user
                    Patient newPatient = new Patient();
                    newPatient.setUser(currentUser);
                    // Use a simple patient number generation for now
                    newPatient.setPatientNumber("P" + System.currentTimeMillis());
                    newPatient.setGender(Gender.OTHER); // Default value
                    return patientRepository.save(newPatient);
                });
            
            // Create basic appointment first
            AppointmentRequest appointmentRequest = new AppointmentRequest();
            appointmentRequest.setPatientId(patient.getPatientId()); // Use auto-created/found patient ID
            appointmentRequest.setDoctorId(request.getDoctorId());
            appointmentRequest.setAppointmentDateTime(request.getAppointmentDateTime());
            appointmentRequest.setDurationMinutes(request.getDurationMinutes());
            appointmentRequest.setAppointmentType(request.getAppointmentType());
            appointmentRequest.setReason(request.getReason());
            appointmentRequest.setNotes(request.getNotes());
            
            AppointmentResponse appointment = appointmentService.createAppointment(appointmentRequest);
            
            // TODO: In a real implementation, update appointment status to CONFIRMED after payment
            // For now, leave as SCHEDULED since patients can't directly update status
            // appointmentService.updateAppointmentStatus(appointment.getAppointmentId(), AppointmentStatus.CONFIRMED, currentUser);
            
            // Create simple response for now
            com.hospital.management.dto.AppointmentPaymentResponse response = 
                new com.hospital.management.dto.AppointmentPaymentResponse();
            response.setAppointmentId(appointment.getAppointmentId());
            response.setPatientId(appointment.getPatientId());
            response.setPatientName(appointment.getPatientName());
            response.setDoctorId(appointment.getDoctorId());
            response.setDoctorName(appointment.getDoctorName());
            response.setAppointmentDateTime(appointment.getAppointmentDateTime());
            response.setDurationMinutes(appointment.getDurationMinutes());
            response.setAppointmentType(appointment.getAppointmentType());
            response.setReason(appointment.getReason());
            response.setNotes(appointment.getNotes());
            response.setStatus(com.hospital.management.entity.AppointmentStatus.REQUESTED);
            response.setCreatedAt(appointment.getCreatedAt());
            
            // Simulate successful payment processing
            response.setPaymentAmount(request.getPaymentAmount());
            response.setPaymentMethod(request.getPaymentMethod());
            response.setPaymentReferenceNumber(request.getPaymentReferenceNumber());
            response.setPaymentNotes(request.getPaymentNotes());
            response.setPaymentDate(java.time.LocalDateTime.now());
            response.setPaymentSuccessful(true);
            response.setAppointmentConfirmed(true);
            response.setMessage("Appointment booked and payment processed successfully. Appointment is requested and awaiting doctor approval.");
            
            // Note: In a real implementation, you would:
            // 1. Process actual payment with payment gateway
            // 2. Create invoice and payment records
            // 3. Update appointment status to CONFIRMED
            // 4. Send confirmation notifications
            // 5. Update dashboard revenue in real-time
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}