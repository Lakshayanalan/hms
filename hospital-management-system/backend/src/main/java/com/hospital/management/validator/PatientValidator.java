package com.hospital.management.validator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

import com.hospital.management.dto.PatientRegistrationRequest;
import com.hospital.management.exception.ValidationException;

/**
 * Validator for Patient-related operations
 * Implements comprehensive validation rules for patient data
 */
@Component
public class PatientValidator {

    // Regex patterns
    private static final Pattern PHONE_PATTERN = Pattern.compile("^[+]?[0-9\\-\\s()]{10,15}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final Pattern BLOOD_TYPE_PATTERN = Pattern.compile("^(A|B|AB|O)[+-]$");
    private static final Pattern NAME_PATTERN = Pattern.compile("^[a-zA-Z\\s'-]{2,50}$");

    // Business rules constants
    private static final int MIN_AGE = 0;
    private static final int MAX_AGE = 150;
    private static final int MIN_NAME_LENGTH = 2;
    private static final int MAX_NAME_LENGTH = 50;

    /**
     * Validates patient registration request
     * 
     * @param request Patient registration data
     * @throws ValidationException if validation fails
     */
    public void validatePatientRegistration(PatientRegistrationRequest request) {
        validateName(request.getFirstName(), "First name");
        validateName(request.getLastName(), "Last name");
        validateDateOfBirth(request.getDateOfBirth());
        validatePhone(request.getPhone(), "Phone");
        validateEmail(request.getEmail());

        if (request.getEmergencyPhone() != null && !request.getEmergencyPhone().isEmpty()) {
            validatePhone(request.getEmergencyPhone(), "Emergency phone");
        }

        if (request.getBloodType() != null && !request.getBloodType().isEmpty()) {
            validateBloodType(request.getBloodType());
        }

        if (request.getAddress() != null && request.getAddress().length() > 500) {
            throw new ValidationException("Address cannot exceed 500 characters");
        }

        if (request.getAllergies() != null && request.getAllergies().length() > 1000) {
            throw new ValidationException("Allergies description cannot exceed 1000 characters");
        }
    }

    /**
     * Validates person name (first name, last name)
     * 
     * @param name      Name to validate
     * @param fieldName Field name for error message
     * @throws ValidationException if validation fails
     */
    public void validateName(String name, String fieldName) {
        if (name == null || name.trim().isEmpty()) {
            throw new ValidationException(fieldName + " is required");
        }

        if (name.length() < MIN_NAME_LENGTH) {
            throw new ValidationException(fieldName + " must be at least " + MIN_NAME_LENGTH + " characters");
        }

        if (name.length() > MAX_NAME_LENGTH) {
            throw new ValidationException(fieldName + " cannot exceed " + MAX_NAME_LENGTH + " characters");
        }

        if (!NAME_PATTERN.matcher(name).matches()) {
            throw new ValidationException(fieldName
                    + " contains invalid characters. Only letters, spaces, hyphens, and apostrophes are allowed");
        }
    }

    /**
     * Validates date of birth
     * 
     * @param dateOfBirth Date of birth to validate
     * @throws ValidationException if validation fails
     */
    public void validateDateOfBirth(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            throw new ValidationException("Date of birth is required");
        }

        LocalDate today = LocalDate.now();

        // Check if date is in the future
        if (dateOfBirth.isAfter(today)) {
            throw new ValidationException("Date of birth cannot be in the future");
        }

        // Calculate age
        int age = Period.between(dateOfBirth, today).getYears();

        // Validate age range
        if (age < MIN_AGE || age > MAX_AGE) {
            throw new ValidationException("Invalid age. Age must be between " + MIN_AGE + " and " + MAX_AGE + " years");
        }
    }

    /**
     * Validates phone number format
     * 
     * @param phone     Phone number to validate
     * @param fieldName Field name for error message
     * @throws ValidationException if validation fails
     */
    public void validatePhone(String phone, String fieldName) {
        if (phone == null || phone.trim().isEmpty()) {
            throw new ValidationException(fieldName + " is required");
        }

        if (!PHONE_PATTERN.matcher(phone).matches()) {
            throw new ValidationException(
                    fieldName + " format is invalid. Expected format: +1234567890 or (123) 456-7890");
        }
    }

    /**
     * Validates email format
     * 
     * @param email Email to validate
     * @throws ValidationException if validation fails
     */
    public void validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new ValidationException("Email is required");
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new ValidationException("Email format is invalid");
        }

        if (email.length() > 100) {
            throw new ValidationException("Email cannot exceed 100 characters");
        }
    }

    /**
     * Validates blood type
     * 
     * @param bloodType Blood type to validate
     * @throws ValidationException if validation fails
     */
    public void validateBloodType(String bloodType) {
        if (bloodType != null && !bloodType.trim().isEmpty()) {
            if (!BLOOD_TYPE_PATTERN.matcher(bloodType.toUpperCase()).matches()) {
                throw new ValidationException("Invalid blood type. Valid types are: A+, A-, B+, B-, AB+, AB-, O+, O-");
            }
        }
    }

    /**
     * Validates patient number format
     * Expected format: PAT-YYYYMMDD-XXXX
     * 
     * @param patientNumber Patient number to validate
     * @throws ValidationException if validation fails
     */
    public void validatePatientNumber(String patientNumber) {
        if (patientNumber == null || patientNumber.trim().isEmpty()) {
            throw new ValidationException("Patient number is required");
        }

        Pattern patientNumberPattern = Pattern.compile("^PAT-\\d{8}-\\d{4}$");
        if (!patientNumberPattern.matcher(patientNumber).matches()) {
            throw new ValidationException("Invalid patient number format. Expected: PAT-YYYYMMDD-XXXX");
        }
    }

    /**
     * Generates a unique patient number
     * Format: PAT-YYYYMMDD-XXXX (XXXX is a random 4-digit number)
     * 
     * @return Generated patient number
     */
    public String generatePatientNumber() {
        LocalDateTime now = LocalDateTime.now();
        String datePart = String.format("%04d%02d%02d",
                now.getYear(),
                now.getMonthValue(),
                now.getDayOfMonth());

        // Generate random 4-digit number
        int randomPart = (int) (Math.random() * 9000) + 1000;

        return String.format("PAT-%s-%04d", datePart, randomPart);
    }

    /**
     * Validates emergency contact information
     * 
     * @param contactName  Emergency contact name
     * @param contactPhone Emergency contact phone
     * @throws ValidationException if validation fails
     */
    public void validateEmergencyContact(String contactName, String contactPhone) {
        if (contactName != null && !contactName.trim().isEmpty()) {
            validateName(contactName, "Emergency contact name");
        }

        if (contactPhone != null && !contactPhone.trim().isEmpty()) {
            validatePhone(contactPhone, "Emergency contact phone");
        }
    }

    /**
     * Validates that patient is an adult (18+ years)
     * 
     * @param dateOfBirth Date of birth to check
     * @return true if patient is adult, false otherwise
     */
    public boolean isAdult(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return false;
        }

        int age = Period.between(dateOfBirth, LocalDate.now()).getYears();
        return age >= 18;
    }

    /**
     * Validates that patient is a minor (under 18 years)
     * 
     * @param dateOfBirth Date of birth to check
     * @return true if patient is minor, false otherwise
     */
    public boolean isMinor(LocalDate dateOfBirth) {
        return !isAdult(dateOfBirth);
    }

    /**
     * Gets patient age in years
     * 
     * @param dateOfBirth Date of birth
     * @return Age in years
     */
    public int getAge(LocalDate dateOfBirth) {
        if (dateOfBirth == null) {
            return 0;
        }
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }
}
