package com.hospital.management.exception;

/**
 * Exception thrown when unauthorized access is attempted
 */
public class UnauthorizedAccessException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public UnauthorizedAccessException(String message) {
        super(message);
    }

    public UnauthorizedAccessException(String message, Throwable cause) {
        super(message, cause);
    }
}
