package com.hospital.management.validator;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.hospital.management.dto.AppointmentRequest;
import com.hospital.management.entity.AppointmentType;
import com.hospital.management.exception.ValidationException;

/**
 * Validator for Appointment-related operations
 * Implements business rules for appointment scheduling
 */
@Component
public class AppointmentValidator {

    // Business hours configuration (can be moved to application.yml)
    @Value("${hospital.business.hours.start:08:00}")
    private String businessHoursStart;

    @Value("${hospital.business.hours.end:18:00}")
    private String businessHoursEnd;

    @Value("${hospital.business.min.advance.hours:2}")
    private int minAdvanceBookingHours;

    @Value("${hospital.business.max.advance.days:90}")
    private int maxAdvanceBookingDays;

    // Valid appointment durations in minutes
    private static final List<Integer> VALID_DURATIONS = Arrays.asList(15, 30, 45, 60, 90, 120);

    // Working days
    private static final List<DayOfWeek> WORKING_DAYS = Arrays.asList(
            DayOfWeek.MONDAY,
            DayOfWeek.TUESDAY,
            DayOfWeek.WEDNESDAY,
            DayOfWeek.THURSDAY,
            DayOfWeek.FRIDAY,
            DayOfWeek.SATURDAY);

    /**
     * Validates appointment request
     * 
     * @param request Appointment request data
     * @throws ValidationException if validation fails
     */
    public void validateAppointmentRequest(AppointmentRequest request) {
        validateAppointmentDateTime(request.getAppointmentDateTime());
        validateAppointmentDuration(request.getDurationMinutes());
        validateAppointmentType(request.getAppointmentType());
        validateReason(request.getReason());

        // Validate that patient ID and doctor ID are provided
        if (request.getPatientId() == null) {
            throw new ValidationException("Patient ID is required");
        }

        if (request.getDoctorId() == null) {
            throw new ValidationException("Doctor ID is required");
        }
    }

    /**
     * Validates appointment date and time
     * 
     * @param appointmentDateTime Date and time of appointment
     * @throws ValidationException if validation fails
     */
    public void validateAppointmentDateTime(LocalDateTime appointmentDateTime) {
        if (appointmentDateTime == null) {
            throw new ValidationException("Appointment date and time is required");
        }

        LocalDateTime now = LocalDateTime.now();

        // Check if appointment is in the past
        if (appointmentDateTime.isBefore(now)) {
            throw new ValidationException("Cannot book appointments in the past");
        }

        // Check minimum advance booking time
        long hoursUntilAppointment = ChronoUnit.HOURS.between(now, appointmentDateTime);
        if (hoursUntilAppointment < minAdvanceBookingHours) {
            throw new ValidationException(
                    String.format("Appointments must be booked at least %d hours in advance", minAdvanceBookingHours));
        }

        // Check maximum advance booking time
        long daysUntilAppointment = ChronoUnit.DAYS.between(now.toLocalDate(), appointmentDateTime.toLocalDate());
        if (daysUntilAppointment > maxAdvanceBookingDays) {
            throw new ValidationException(
                    String.format("Appointments cannot be booked more than %d days in advance", maxAdvanceBookingDays));
        }

        // Validate business hours
        validateBusinessHours(appointmentDateTime);

        // Validate working days
        validateWorkingDay(appointmentDateTime);
    }

    /**
     * Validates that appointment is within business hours
     * 
     * @param appointmentDateTime Appointment date and time
     * @throws ValidationException if outside business hours
     */
    public void validateBusinessHours(LocalDateTime appointmentDateTime) {
        LocalTime appointmentTime = appointmentDateTime.toLocalTime();
        LocalTime startTime = LocalTime.parse(businessHoursStart);
        LocalTime endTime = LocalTime.parse(businessHoursEnd);

        if (appointmentTime.isBefore(startTime) || appointmentTime.isAfter(endTime)) {
            throw new ValidationException(
                    String.format("Appointments must be scheduled between %s and %s",
                            businessHoursStart, businessHoursEnd));
        }
    }

    /**
     * Validates that appointment is on a working day
     * 
     * @param appointmentDateTime Appointment date and time
     * @throws ValidationException if not a working day
     */
    public void validateWorkingDay(LocalDateTime appointmentDateTime) {
        DayOfWeek dayOfWeek = appointmentDateTime.getDayOfWeek();

        if (!WORKING_DAYS.contains(dayOfWeek)) {
            throw new ValidationException(
                    String.format("Appointments cannot be scheduled on %s. Working days are Monday to Saturday",
                            dayOfWeek.toString()));
        }
    }

    /**
     * Validates appointment duration
     * 
     * @param durationMinutes Duration in minutes
     * @throws ValidationException if invalid duration
     */
    public void validateAppointmentDuration(Integer durationMinutes) {
        if (durationMinutes == null) {
            throw new ValidationException("Appointment duration is required");
        }

        if (!VALID_DURATIONS.contains(durationMinutes)) {
            throw new ValidationException(
                    String.format("Invalid appointment duration. Valid durations are: %s minutes",
                            VALID_DURATIONS.toString()));
        }
    }

    /**
     * Validates that appointment end time is within business hours
     * 
     * @param appointmentDateTime Appointment start time
     * @param durationMinutes     Appointment duration
     * @throws ValidationException if end time is outside business hours
     */
    public void validateAppointmentEndTime(LocalDateTime appointmentDateTime, Integer durationMinutes) {
        LocalDateTime endTime = appointmentDateTime.plusMinutes(durationMinutes);
        LocalTime endTimeOfDay = endTime.toLocalTime();
        LocalTime businessEnd = LocalTime.parse(businessHoursEnd);

        if (endTimeOfDay.isAfter(businessEnd)) {
            throw new ValidationException(
                    String.format("Appointment end time (%s) exceeds business hours (%s)",
                            endTimeOfDay.toString(), businessHoursEnd));
        }
    }

    /**
     * Validates appointment type
     * 
     * @param appointmentType Type of appointment
     * @throws ValidationException if invalid type
     */
    public void validateAppointmentType(AppointmentType appointmentType) {
        if (appointmentType == null) {
            throw new ValidationException("Appointment type is required");
        }
    }

    /**
     * Validates appointment reason
     * 
     * @param reason Reason for appointment
     * @throws ValidationException if invalid reason
     */
    public void validateReason(String reason) {
        if (reason == null || reason.trim().isEmpty()) {
            throw new ValidationException("Reason for appointment is required");
        }

        if (reason.length() < 10) {
            throw new ValidationException("Reason must be at least 10 characters");
        }

        if (reason.length() > 500) {
            throw new ValidationException("Reason cannot exceed 500 characters");
        }
    }

    /**
     * Checks if a date is a holiday (can be extended with actual holiday calendar)
     * 
     * @param date Date to check
     * @return true if holiday, false otherwise
     */
    public boolean isHoliday(LocalDate date) {
        // TODO: Implement actual holiday calendar
        // For now, just return false
        // In production, this should check against a holiday table in database
        return false;
    }

    /**
     * Validates that appointment is not on a holiday
     * 
     * @param appointmentDateTime Appointment date and time
     * @throws ValidationException if on a holiday
     */
    public void validateNotHoliday(LocalDateTime appointmentDateTime) {
        if (isHoliday(appointmentDateTime.toLocalDate())) {
            throw new ValidationException("Appointments cannot be scheduled on holidays");
        }
    }

    /**
     * Validates cancellation policy
     * Appointments can only be cancelled at least 24 hours before scheduled time
     * 
     * @param appointmentDateTime Scheduled appointment time
     * @throws ValidationException if cancellation policy violated
     */
    public void validateCancellationPolicy(LocalDateTime appointmentDateTime) {
        LocalDateTime now = LocalDateTime.now();
        long hoursUntilAppointment = ChronoUnit.HOURS.between(now, appointmentDateTime);

        if (hoursUntilAppointment < 24) {
            throw new ValidationException(
                    "Appointments can only be cancelled at least 24 hours in advance. " +
                            "Please contact the hospital for late cancellations.");
        }
    }

    /**
     * Validates rescheduling policy
     * Appointments can only be rescheduled at least 12 hours before scheduled time
     * 
     * @param appointmentDateTime Current scheduled appointment time
     * @throws ValidationException if rescheduling policy violated
     */
    public void validateReschedulingPolicy(LocalDateTime appointmentDateTime) {
        LocalDateTime now = LocalDateTime.now();
        long hoursUntilAppointment = ChronoUnit.HOURS.between(now, appointmentDateTime);

        if (hoursUntilAppointment < 12) {
            throw new ValidationException(
                    "Appointments can only be rescheduled at least 12 hours in advance. " +
                            "Please contact the hospital for urgent rescheduling.");
        }
    }

    /**
     * Checks if two appointment time slots overlap
     * 
     * @param start1 Start time of first appointment
     * @param end1   End time of first appointment
     * @param start2 Start time of second appointment
     * @param end2   End time of second appointment
     * @return true if appointments overlap, false otherwise
     */
    public boolean hasTimeOverlap(LocalDateTime start1, LocalDateTime end1,
            LocalDateTime start2, LocalDateTime end2) {
        return start1.isBefore(end2) && end1.isAfter(start2);
    }

    /**
     * Validates that appointment slots are properly spaced
     * Ensures minimum buffer time between appointments
     * 
     * @param previousEndTime End time of previous appointment
     * @param newStartTime    Start time of new appointment
     * @param bufferMinutes   Required buffer time in minutes
     * @throws ValidationException if buffer time is insufficient
     */
    public void validateBufferTime(LocalDateTime previousEndTime, LocalDateTime newStartTime, int bufferMinutes) {
        long minutesBetween = ChronoUnit.MINUTES.between(previousEndTime, newStartTime);

        if (minutesBetween < bufferMinutes) {
            throw new ValidationException(
                    String.format("Insufficient buffer time between appointments. Minimum %d minutes required.",
                            bufferMinutes));
        }
    }

    /**
     * Validates emergency appointment
     * Emergency appointments have relaxed rules
     * 
     * @param appointmentDateTime Appointment date and time
     */
    public void validateEmergencyAppointment(LocalDateTime appointmentDateTime) {
        if (appointmentDateTime == null) {
            throw new ValidationException("Appointment date and time is required");
        }

        LocalDateTime now = LocalDateTime.now();

        // Emergency appointments can be in the past (for walk-ins)
        // but not more than 1 hour in the past
        if (appointmentDateTime.isBefore(now.minusHours(1))) {
            throw new ValidationException("Emergency appointment time is too far in the past");
        }

        // Emergency appointments can be scheduled immediately
        // No advance booking requirement
    }

    /**
     * Gets the next available time slot after given time
     * 
     * @param afterTime       Time to start searching from
     * @param durationMinutes Duration of appointment
     * @return Next available time slot
     */
    public LocalDateTime getNextAvailableSlot(LocalDateTime afterTime, Integer durationMinutes) {
        LocalDateTime nextSlot = afterTime;

        // Round up to next 15-minute interval
        int minutes = nextSlot.getMinute();
        int roundedMinutes = ((minutes + 14) / 15) * 15;
        nextSlot = nextSlot.withMinute(0).plusMinutes(roundedMinutes).withSecond(0).withNano(0);

        // If outside business hours, move to next business day
        LocalTime startTime = LocalTime.parse(businessHoursStart);
        if (nextSlot.toLocalTime().isBefore(startTime)) {
            nextSlot = nextSlot.with(startTime);
        }

        LocalTime endTime = LocalTime.parse(businessHoursEnd);
        if (nextSlot.toLocalTime().isAfter(endTime)) {
            nextSlot = nextSlot.plusDays(1).with(startTime);
        }

        // Skip non-working days
        while (!WORKING_DAYS.contains(nextSlot.getDayOfWeek())) {
            nextSlot = nextSlot.plusDays(1);
        }

        return nextSlot;
    }
}
