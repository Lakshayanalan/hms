package com.hospital.management.exception;

/**
 * Exception thrown when an appointment time conflict is detected
 */
public class AppointmentConflictException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public AppointmentConflictException(String message) {
        super(message);
    }

    public AppointmentConflictException(String message, Throwable cause) {
        super(message, cause);
    }
}
