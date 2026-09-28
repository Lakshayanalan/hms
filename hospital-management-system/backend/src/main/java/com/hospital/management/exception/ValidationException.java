package com.hospital.management.exception;

/**
 * Custom exception for validation errors
 * Thrown when business rules or data validation fails
 */
public class ValidationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public ValidationException(String message) {
        super(message);
    }

    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}
