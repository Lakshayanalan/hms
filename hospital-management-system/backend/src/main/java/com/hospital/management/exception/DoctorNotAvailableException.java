package com.hospital.management.exception;

/**
 * Exception thrown when a doctor is not available for an appointment
 */
public class DoctorNotAvailableException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public DoctorNotAvailableException(String message) {
        super(message);
    }

    public DoctorNotAvailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
