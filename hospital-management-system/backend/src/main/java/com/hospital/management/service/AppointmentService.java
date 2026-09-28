package com.hospital.management.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.AppointmentRequest;
import com.hospital.management.dto.AppointmentResponse;
import com.hospital.management.dto.DoctorAvailabilityResponse;
import com.hospital.management.dto.DoctorStatsResponse;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.AppointmentStatus;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Role;
import com.hospital.management.entity.User;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;

@Service
@Transactional
public class AppointmentService {
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private com.hospital.management.service.PaymentService paymentService;
    
    @Autowired
    private com.hospital.management.repository.InvoiceRepository invoiceRepository;

    public AppointmentResponse createAppointment(AppointmentRequest request) {
        // Validate patient exists
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Validate doctor exists and has DOCTOR role
        User doctor = userRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("User is not a doctor");
        }

        // Check for appointment conflicts
        if (hasAppointmentConflict(request.getDoctorId(), request.getAppointmentDateTime(), 
                                   request.getDurationMinutes())) {
            throw new RuntimeException("Doctor has a conflicting appointment at this time");
        }

        // Create appointment
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setDurationMinutes(request.getDurationMinutes());
        appointment.setAppointmentType(request.getAppointmentType());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(AppointmentStatus.REQUESTED);
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(savedAppointment);
    }

    public AppointmentResponse updateAppointment(Long appointmentId, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // If changing doctor or time, validate the new doctor and check conflicts
        if (!appointment.getDoctor().getUserId().equals(request.getDoctorId()) ||
            !appointment.getAppointmentDateTime().equals(request.getAppointmentDateTime())) {
            
            User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            if (doctor.getRole() != Role.DOCTOR) {
                throw new RuntimeException("User is not a doctor");
            }

            // Check for conflicts (excluding current appointment)
            if (hasAppointmentConflictExcluding(request.getDoctorId(), request.getAppointmentDateTime(),
                                                request.getDurationMinutes(), appointmentId)) {
                throw new RuntimeException("Doctor has a conflicting appointment at this time");
            }

            appointment.setDoctor(doctor);
        }

        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setDurationMinutes(request.getDurationMinutes());
        appointment.setAppointmentType(request.getAppointmentType());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setUpdatedAt(LocalDateTime.now());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        return mapToResponse(savedAppointment);
    }

    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setUpdatedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
    }

    public void completeAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointment.setUpdatedAt(LocalDateTime.now());
        appointmentRepository.save(appointment);
    }

    public AppointmentResponse getAppointmentById(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        return mapToResponse(appointment);
    }

    public Page<AppointmentResponse> getAppointmentsByPatient(Long patientId, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        Page<Appointment> appointments = appointmentRepository.findByPatient_PatientId(patientId, pageable);
        return appointments.map(this::mapToResponse);
    }

    public Page<AppointmentResponse> getAppointmentsByDoctor(Long doctorId, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, sortBy));
        Page<Appointment> appointments = appointmentRepository.findByDoctor_UserId(doctorId, pageable);
        return appointments.map(this::mapToResponse);
    }

    public Page<AppointmentResponse> getAllAppointments(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        Page<Appointment> appointments = appointmentRepository.findAll(pageable);
        return appointments.map(this::mapToResponse);
    }

    public Page<AppointmentResponse> getAppointmentsByStatus(AppointmentStatus status, int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        Page<Appointment> appointments = appointmentRepository.findByStatus(status, pageable);
        return appointments.map(this::mapToResponse);
    }

    public List<AppointmentResponse> getTodaysAppointments() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        List<Appointment> appointments = appointmentRepository.findByAppointmentDateTimeBetween(startOfDay, endOfDay);
        return appointments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getUpcomingAppointments(int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime future = now.plusDays(days);
        List<Appointment> appointments = appointmentRepository.findByAppointmentDateTimeBetween(now, future);
        return appointments.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<User> getAvailableDoctors() {
        return userRepository.findByRole(Role.DOCTOR);
    }

    public DoctorAvailabilityResponse getDoctorAvailability(Long doctorId, LocalDate date) {
        User doctor = userRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("User is not a doctor");
        }

        LocalDateTime startOfDay = date.atTime(9, 0); // 9 AM start
        LocalDateTime endOfDay = date.atTime(17, 0); // 5 PM end

        // Get existing appointments for the doctor on this date
        List<Appointment> existingAppointments = appointmentRepository.findByDoctor_UserIdAndAppointmentDateTimeBetween(
            doctorId, startOfDay, endOfDay.plusMinutes(1));

        // Generate 30-minute time slots
        List<DoctorAvailabilityResponse.TimeSlot> slots = new ArrayList<>();
        LocalDateTime current = startOfDay;

        while (current.isBefore(endOfDay)) {
            LocalDateTime slotEnd = current.plusMinutes(30);
            
            // Create final variables for lambda
            final LocalDateTime slotStart = current;
            final LocalDateTime slotEndTime = slotEnd;
            
            boolean isAvailable = existingAppointments.stream()
                .noneMatch(appointment -> appointment.isConflictsWith(slotStart, slotEndTime));
            
            slots.add(new DoctorAvailabilityResponse.TimeSlot(current, slotEnd, isAvailable));
            current = slotEnd;
        }

        return new DoctorAvailabilityResponse(doctor.getUserId(), doctor.getFullName(), "Doctor", slots);
    }

    private boolean hasAppointmentConflict(Long doctorId, LocalDateTime appointmentTime, Integer durationMinutes) {
        return hasAppointmentConflictExcluding(doctorId, appointmentTime, durationMinutes, null);
    }

    private boolean hasAppointmentConflictExcluding(Long doctorId, LocalDateTime appointmentTime, 
                                                    Integer durationMinutes, Long excludeAppointmentId) {
        LocalDateTime endTime = appointmentTime.plusMinutes(durationMinutes);
        
        // Get appointments for the doctor on the same date
        LocalDateTime startOfDay = appointmentTime.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = appointmentTime.toLocalDate().atTime(23, 59, 59);
        
        List<Appointment> dayAppointments = appointmentRepository.findByDoctor_UserIdAndAppointmentDateTimeBetween(
            doctorId, startOfDay, endOfDay);
        
        // Check for conflicts manually
        for (Appointment existing : dayAppointments) {
            if (excludeAppointmentId != null && existing.getAppointmentId().equals(excludeAppointmentId)) {
                continue; // Skip the appointment we're updating
            }
            
            if (existing.isConflictsWith(appointmentTime, endTime)) {
                return true;
            }
        }
        
        return false;
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        String createdByName = appointment.getCreatedBy() != null ? 
                              appointment.getCreatedBy().getFullName() : null;
        
        return new AppointmentResponse(
            appointment.getAppointmentId(),
            appointment.getPatient().getPatientId(),
            appointment.getPatient().getFullName(),
            appointment.getPatient().getPatientNumber(),
            appointment.getDoctor().getUserId(),
            appointment.getDoctor().getFullName(),
            appointment.getAppointmentDateTime(),
            appointment.getDurationMinutes(),
            appointment.getAppointmentType(),
            appointment.getStatus(),
            appointment.getReason(),
            appointment.getNotes(),
            createdByName,
            appointment.getCreatedAt(),
            appointment.getUpdatedAt()
        );
    }
    
    // Appointment workflow methods
    
    /**
     * Doctor approves an appointment request
     */
    public AppointmentResponse approveAppointment(Long appointmentId, User approver) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        // Verify the approver is the assigned doctor or an admin
        if (!appointment.getDoctor().getUserId().equals(approver.getUserId()) && 
            approver.getRole() != Role.HOSPITAL_MANAGER) {
            throw new RuntimeException("Only the assigned doctor or admin can approve this appointment");
        }
        
        // Verify appointment can be approved
        if (!appointment.canBeApproved()) {
            throw new RuntimeException("Appointment cannot be approved in its current status: " + appointment.getStatus());
        }
        
        // Check for conflicts one more time before approval (excluding this appointment)
        if (hasAppointmentConflictExcluding(appointment.getDoctor().getUserId(), 
                                           appointment.getAppointmentDateTime(), 
                                           appointment.getDurationMinutes(),
                                           appointmentId)) {
            throw new RuntimeException("Doctor now has a conflicting appointment at this time");
        }
        
        appointment.approve(approver);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Send notification to patient
        notificationService.notifyAppointmentResponse(appointment, true, null);
        
        return mapToResponse(savedAppointment);
    }
    
    /**
     * Doctor rejects an appointment request with reason
     */
    public AppointmentResponse rejectAppointment(Long appointmentId, User rejector, String reason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        // Verify the rejector is the assigned doctor or an admin
        if (!appointment.getDoctor().getUserId().equals(rejector.getUserId()) && 
            rejector.getRole() != Role.HOSPITAL_MANAGER) {
            throw new RuntimeException("Only the assigned doctor or admin can reject this appointment");
        }
        
        // Verify appointment can be rejected
        if (!appointment.canBeRejected()) {
            throw new RuntimeException("Appointment cannot be rejected in its current status: " + appointment.getStatus());
        }
        
        // Validate rejection reason
        if (reason == null || reason.trim().isEmpty()) {
            throw new RuntimeException("Rejection reason is required");
        }
        
        appointment.reject(rejector, reason);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Send notification to patient
        notificationService.notifyAppointmentResponse(appointment, false, reason);
        
        return mapToResponse(savedAppointment);
    }
    
    /**
     * Mark appointment as completed by doctor
     */
    public AppointmentResponse completeAppointment(Long appointmentId, User completedBy) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        // Verify the completer is the assigned doctor or an admin
        if (!appointment.getDoctor().getUserId().equals(completedBy.getUserId()) && 
            completedBy.getRole() != Role.HOSPITAL_MANAGER) {
            throw new RuntimeException("Only the assigned doctor or admin can complete this appointment");
        }
        
        // Verify appointment can be completed
        if (appointment.getStatus() != AppointmentStatus.APPROVED && 
            appointment.getStatus() != AppointmentStatus.CONFIRMED &&
            appointment.getStatus() != AppointmentStatus.IN_PROGRESS) {
            throw new RuntimeException("Appointment cannot be completed in its current status: " + appointment.getStatus());
        }
        
        appointment.complete();
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Send notification to patient (will be integrated with NotificationService)
        notificationService.notifyAppointmentCompletion(appointment);
        
        return mapToResponse(savedAppointment);
    }
    
    /**
     * Get pending appointments for a doctor (awaiting approval)
     */
    public List<AppointmentResponse> getPendingAppointmentsForDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctor_UserIdAndStatusIn(
            doctorId, List.of(AppointmentStatus.REQUESTED, AppointmentStatus.PENDING_APPROVAL)
        );
        
        return appointments.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * Get appointments by status for admin dashboard
     */
    public List<AppointmentResponse> getAppointmentsByStatus(AppointmentStatus status) {
        List<Appointment> appointments = appointmentRepository.findByStatus(status);
        return appointments.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * Reschedule an appointment (can be done by patient or doctor)
     */
    public AppointmentResponse rescheduleAppointment(Long appointmentId, LocalDateTime newDateTime, 
                                                   Integer newDuration, User requestedBy) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        // Check permissions - patient, doctor, or admin can reschedule
        boolean canReschedule = appointment.getPatient().getUser().getUserId().equals(requestedBy.getUserId()) ||
                               appointment.getDoctor().getUserId().equals(requestedBy.getUserId()) ||
                               requestedBy.getRole() == Role.HOSPITAL_MANAGER;
        
        if (!canReschedule) {
            throw new RuntimeException("You don't have permission to reschedule this appointment");
        }
        
        // Check if appointment can be rescheduled
        if (appointment.getStatus() == AppointmentStatus.COMPLETED ||
            appointment.getStatus() == AppointmentStatus.CANCELLED ||
            appointment.getStatus() == AppointmentStatus.NO_SHOW) {
            throw new RuntimeException("Cannot reschedule appointment in status: " + appointment.getStatus());
        }
        
        // Check for conflicts with new time
        if (hasAppointmentConflictExcluding(appointment.getDoctor().getUserId(), newDateTime, 
                                           newDuration, appointmentId)) {
            throw new RuntimeException("Doctor has a conflicting appointment at the new time");
        }
        
        appointment.setAppointmentDateTime(newDateTime);
        appointment.setDurationMinutes(newDuration);
        appointment.setStatus(AppointmentStatus.RESCHEDULED);
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        return mapToResponse(savedAppointment);
    }
    
    /**
     * Get statistics for a specific doctor
     */
    public DoctorStatsResponse getDoctorStats(Long doctorId) {
        Optional<User> doctorOpt = userRepository.findById(doctorId);
        if (!doctorOpt.isPresent()) {
            throw new RuntimeException("Doctor not found");
        }
        User doctor = doctorOpt.get();
        
        DoctorStatsResponse stats = new DoctorStatsResponse(doctorId, 
            doctor.getFirstName() + " " + doctor.getLastName());
        
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.minusDays(today.getDayOfWeek().getValue() - 1);
        LocalDate startOfMonth = today.withDayOfMonth(1);
        
        // Today's appointments
        List<Appointment> todaysAppointments = appointmentRepository
            .findByDoctor_UserIdAndAppointmentDateTimeBetween(doctorId, 
                today.atStartOfDay(), today.plusDays(1).atStartOfDay());
        stats.setTodaysAppointments(todaysAppointments.size());
        
        // Completed today
        long completedToday = todaysAppointments.stream()
            .filter(apt -> apt.getStatus() == AppointmentStatus.COMPLETED)
            .count();
        stats.setCompletedToday((int) completedToday);
        
        // Pending reviews (appointments that need doctor attention - IN_PROGRESS status)
        List<Appointment> monthAppointments = appointmentRepository
            .findByDoctor_UserIdAndAppointmentDateTimeBetween(doctorId, 
                startOfMonth.atStartOfDay(), today.plusDays(1).atStartOfDay());
        long pendingReviews = monthAppointments.stream()
            .filter(apt -> apt.getStatus() == AppointmentStatus.IN_PROGRESS || apt.getStatus() == AppointmentStatus.CONFIRMED)
            .count();
        stats.setPendingReviews((int) pendingReviews);
        
        // Total unique patients - get all appointments for this doctor
        List<Appointment> allDoctorAppointments = appointmentRepository
            .findByDoctor_UserIdAndAppointmentDateTimeBetween(doctorId, 
                LocalDate.of(2020, 1, 1).atStartOfDay(), 
                LocalDate.now().plusYears(1).atStartOfDay());
        int uniquePatients = (int) allDoctorAppointments.stream()
            .map(apt -> apt.getPatient().getPatientId())
            .distinct()
            .count();
        stats.setTotalPatients(uniquePatients);
        
        // Week statistics
        List<Appointment> weekAppointments = appointmentRepository
            .findByDoctor_UserIdAndAppointmentDateTimeBetween(doctorId, 
                startOfWeek.atStartOfDay(), today.plusDays(1).atStartOfDay());
        stats.setWeekAppointments(weekAppointments.size());
        
        long weekCompleted = weekAppointments.stream()
            .filter(apt -> apt.getStatus() == AppointmentStatus.COMPLETED)
            .count();
        stats.setWeekCompleted((int) weekCompleted);
        
        // Month statistics (reuse monthAppointments from above)
        stats.setMonthAppointments(monthAppointments.size());
        
        long monthCompleted = monthAppointments.stream()
            .filter(apt -> apt.getStatus() == AppointmentStatus.COMPLETED)
            .count();
        stats.setMonthCompleted((int) monthCompleted);
        
        // Overall completion rate
        long totalCompleted = allDoctorAppointments.stream()
            .filter(apt -> apt.getStatus() == AppointmentStatus.COMPLETED)
            .count();
        stats.setTotalCompletedAppointments((int) totalCompleted);
        
        if (!allDoctorAppointments.isEmpty()) {
            double completionRate = (double) totalCompleted / allDoctorAppointments.size() * 100;
            stats.setCompletionRate(completionRate);
        } else {
            stats.setCompletionRate(0.0);
        }
        
        return stats;
    }
    
    /**
     * Update appointment status (generic method for all status changes)
     */
    public AppointmentResponse updateAppointmentStatus(Long appointmentId, AppointmentStatus status, User currentUser) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        // Validate permissions
        if (currentUser.getRole() == Role.DOCTOR) {
            // Doctor can only modify their own appointments
            if (!appointment.getDoctor().getUserId().equals(currentUser.getUserId())) {
                throw new RuntimeException("You can only modify your own appointments");
            }
        } else if (currentUser.getRole() == Role.PATIENT) {
            // Patient can only modify their own appointments and only certain statuses
            if (!appointment.getPatient().getUser().getUserId().equals(currentUser.getUserId())) {
                throw new RuntimeException("You can only modify your own appointments");
            }
            // Patients can only cancel their appointments
            if (status != AppointmentStatus.CANCELLED) {
                throw new RuntimeException("Patients can only cancel appointments");
            }
        }
        // ADMIN can modify any appointment
        
        AppointmentStatus oldStatus = appointment.getStatus();
        appointment.setStatus(status);
        appointment.setUpdatedAt(LocalDateTime.now());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Send notifications based on status change (simplified)
        try {
            String message = getStatusChangeMessage(oldStatus, status, appointment);
            // For now, just log the notification - can be enhanced later
            System.out.println("Notification: " + message);
        } catch (Exception e) {
            // Don't fail the update if notification fails
            System.err.println("Failed to send notification: " + e.getMessage());
        }
        
        return mapToResponse(savedAppointment);
    }
    
    private String getStatusChangeMessage(AppointmentStatus oldStatus, AppointmentStatus newStatus, Appointment appointment) {
        switch (newStatus) {
            case APPROVED:
                return String.format("Your appointment on %s has been approved by Dr. %s", 
                    appointment.getAppointmentDateTime().toString(), 
                    appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName());
            case REJECTED:
                return String.format("Your appointment on %s has been rejected by Dr. %s", 
                    appointment.getAppointmentDateTime().toString(), 
                    appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName());
            case CANCELLED:
                return String.format("Appointment on %s has been cancelled", 
                    appointment.getAppointmentDateTime().toString());
            case COMPLETED:
                return String.format("Appointment on %s has been completed", 
                    appointment.getAppointmentDateTime().toString());
            case CONFIRMED:
                return String.format("Appointment on %s has been confirmed", 
                    appointment.getAppointmentDateTime().toString());
            default:
                return String.format("Appointment status changed from %s to %s", 
                    oldStatus.toString(), newStatus.toString());
        }
    }
    
    /**
     * Creates an appointment with immediate payment processing
     * If payment is successful, appointment is automatically confirmed
     */
    @Transactional
    public com.hospital.management.dto.AppointmentPaymentResponse createAppointmentWithPayment(
            com.hospital.management.dto.AppointmentPaymentRequest request) {
        
        // Validate patient exists
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Validate doctor exists and has DOCTOR role
        User doctor = userRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("User is not a doctor");
        }

        // Check for appointment conflicts
        if (hasAppointmentConflict(request.getDoctorId(), request.getAppointmentDateTime(), 
                                   request.getDurationMinutes())) {
            throw new RuntimeException("Doctor has a conflicting appointment at this time");
        }

        // Create appointment initially with REQUESTED status
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDateTime(request.getAppointmentDateTime());
        appointment.setDurationMinutes(request.getDurationMinutes());
        appointment.setAppointmentType(request.getAppointmentType());
        appointment.setReason(request.getReason());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(AppointmentStatus.REQUESTED);
        appointment.setCreatedAt(LocalDateTime.now());
        appointment.setUpdatedAt(LocalDateTime.now());

        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        // Create response object
        com.hospital.management.dto.AppointmentPaymentResponse response = 
            new com.hospital.management.dto.AppointmentPaymentResponse();
        
        // Set appointment details
        response.setAppointmentId(savedAppointment.getAppointmentId());
        response.setPatientId(savedAppointment.getPatient().getPatientId());
        response.setPatientName(savedAppointment.getPatient().getUser().getFirstName() + " " + 
                               savedAppointment.getPatient().getUser().getLastName());
        response.setDoctorId(savedAppointment.getDoctor().getUserId());
        response.setDoctorName("Dr. " + savedAppointment.getDoctor().getFirstName() + " " + 
                              savedAppointment.getDoctor().getLastName());
        response.setAppointmentDateTime(savedAppointment.getAppointmentDateTime());
        response.setDurationMinutes(savedAppointment.getDurationMinutes());
        response.setAppointmentType(savedAppointment.getAppointmentType());
        response.setReason(savedAppointment.getReason());
        response.setNotes(savedAppointment.getNotes());
        response.setStatus(savedAppointment.getStatus());
        response.setCreatedAt(savedAppointment.getCreatedAt());
        
        try {
            // Create an invoice for the appointment
            com.hospital.management.entity.Invoice invoice = createAppointmentInvoice(
                savedAppointment, request.getPaymentAmount());
            
            // Process the payment
            com.hospital.management.dto.PaymentRequest paymentRequest = 
                new com.hospital.management.dto.PaymentRequest();
            paymentRequest.setInvoiceId(invoice.getInvoiceId());
            paymentRequest.setAmount(request.getPaymentAmount());
            paymentRequest.setPaymentMethod(request.getPaymentMethod());
            paymentRequest.setPaymentDate(LocalDateTime.now());
            paymentRequest.setReferenceNumber(request.getPaymentReferenceNumber());
            paymentRequest.setNotes(request.getPaymentNotes());
            
            com.hospital.management.dto.PaymentResponse paymentResponse = 
                paymentService.processPayment(paymentRequest, null);
            
            // If payment successful, confirm the appointment
            if (paymentResponse != null) {
                savedAppointment.setStatus(AppointmentStatus.CONFIRMED);
                savedAppointment.setUpdatedAt(LocalDateTime.now());
                savedAppointment = appointmentRepository.save(savedAppointment);
                
                // Set response payment details
                response.setPaymentId(paymentResponse.getPaymentId());
                response.setInvoiceId(invoice.getInvoiceId());
                response.setPaymentAmount(paymentResponse.getAmount());
                response.setPaymentMethod(paymentResponse.getPaymentMethod());
                response.setPaymentReferenceNumber(paymentResponse.getReferenceNumber());
                response.setPaymentNotes(paymentResponse.getNotes());
                response.setPaymentDate(paymentResponse.getPaymentDate());
                response.setPaymentSuccessful(true);
                response.setAppointmentConfirmed(true);
                response.setStatus(AppointmentStatus.CONFIRMED);
                response.setMessage("Appointment booked and payment processed successfully");
                
            } else {
                response.setPaymentSuccessful(false);
                response.setAppointmentConfirmed(false);
                response.setMessage("Payment processing failed. Appointment created but not confirmed.");
            }
            
        } catch (Exception e) {
            // Payment failed, keep appointment as REQUESTED
            response.setPaymentSuccessful(false);
            response.setAppointmentConfirmed(false);
            response.setMessage("Payment processing failed: " + e.getMessage() + 
                              ". Appointment created but requires manual payment.");
        }
        
        return response;
    }
    
    /**
     * Helper method to create an invoice for an appointment
     */
    private com.hospital.management.entity.Invoice createAppointmentInvoice(
            Appointment appointment, java.math.BigDecimal amount) {
        
        com.hospital.management.entity.Invoice invoice = new com.hospital.management.entity.Invoice();
        invoice.setPatient(appointment.getPatient());
        invoice.setInvoiceNumber("INV-APT-" + appointment.getAppointmentId() + "-" + 
                                System.currentTimeMillis());
        invoice.setInvoiceDate(LocalDate.now());
        invoice.setDueDate(LocalDate.now()); // Due immediately for appointment booking
        invoice.setDescription("Appointment booking - " + appointment.getAppointmentType().toString() + 
                              " with Dr. " + appointment.getDoctor().getFirstName() + " " + 
                              appointment.getDoctor().getLastName());
        invoice.setSubtotal(amount);
        invoice.setTaxAmount(java.math.BigDecimal.ZERO);
        invoice.setDiscountAmount(java.math.BigDecimal.ZERO);
        invoice.setTotalAmount(amount);
        invoice.setPaymentStatus(com.hospital.management.entity.PaymentStatus.PENDING);
        invoice.setCreatedAt(LocalDateTime.now());
        invoice.setUpdatedAt(LocalDateTime.now());
        
        return invoiceRepository.save(invoice);
    }
}