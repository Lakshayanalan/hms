package com.hospital.management.controller;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.JwtResponse;
import com.hospital.management.dto.LoginRequest;
import com.hospital.management.entity.Gender;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Role;
import com.hospital.management.entity.User;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;
import com.hospital.management.security.JwtUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Find user by username
            Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid username or password");
            }
            
            User user = userOpt.get();
            
            // Check if user is active
            if (!user.getIsActive()) {
                return ResponseEntity.badRequest().body("User account is disabled");
            }
            
            // Verify password
            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.badRequest().body("Invalid username or password");
            }
            
            // Generate JWT token
            String jwt = jwtUtils.generateJwtToken(user.getUsername());
            
            // Return successful authentication response
            return ResponseEntity.ok(new JwtResponse(
                jwt,
                user.getUserId(),
                user.getUsername(), 
                user.getEmail(), 
                user.getRole().name()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Authentication failed: " + e.getMessage());
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token) {
        boolean isValid = jwtUtils.validateJwtToken(token);
        if (isValid) {
            String username = jwtUtils.getUserNameFromJwtToken(token);
            return ResponseEntity.ok().body("Token is valid for user: " + username);
        }
        return ResponseEntity.badRequest().body("Invalid token");
    }
    
    @PostMapping("/register/patient")
    public ResponseEntity<?> registerPatient(@Valid @RequestBody PatientRegistrationRequest request) {
        try {
            // Check if username already exists
            if (userRepository.findByUsername(request.getUsername()).isPresent()) {
                return ResponseEntity.badRequest().body("Username is already taken");
            }
            
            // Check if email already exists
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Email is already registered");
            }
            
            // Validate patient data
            PatientRegistrationRequest.PatientData data = request.getPatientData();
            if (data == null) {
                return ResponseEntity.badRequest().body("Patient data is required");
            }
            
            // Create User with all required fields
            User user = new User();
            user.setUsername(request.getUsername());
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setEmail(request.getEmail());
            user.setRole(Role.PATIENT);
            user.setIsActive(true);
            
            // Set required user fields from patient data
            user.setFirstName(data.getFirstName());
            user.setLastName(data.getLastName());
            user.setPhone(data.getPhoneNumber());
            
            // Save user
            user = userRepository.save(user);
            
            // Create Patient
            Patient patient = new Patient();
            patient.setUser(user);
            
            // Generate unique patient number
            String patientNumber = "P" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            patient.setPatientNumber(patientNumber);
            
            // Parse and set date of birth
            if (data.getDateOfBirth() != null && !data.getDateOfBirth().isEmpty()) {
                patient.setDateOfBirth(LocalDate.parse(data.getDateOfBirth()));
            }
            
            // Set gender
            if (data.getGender() != null && !data.getGender().isEmpty()) {
                try {
                    patient.setGender(Gender.valueOf(data.getGender().toUpperCase()));
                } catch (IllegalArgumentException e) {
                    // If gender is invalid, default to null or handle appropriately
                    patient.setGender(null);
                }
            }
            
            // Set address
            String fullAddress = buildAddress(data.getAddress(), data.getCity(), data.getState(), data.getZipCode());
            if (fullAddress != null && !fullAddress.isEmpty()) {
                patient.setAddress(fullAddress);
            }
            
            // Set blood group
            if (data.getBloodGroup() != null && !data.getBloodGroup().isEmpty()) {
                patient.setBloodType(data.getBloodGroup());
            }
            
            // Set allergies
            if (data.getAllergies() != null && !data.getAllergies().isEmpty()) {
                patient.setAllergies(data.getAllergies());
            }
            
            // Set emergency contact
            patient.setEmergencyContact(data.getEmergencyContact());
            patient.setEmergencyPhone(data.getEmergencyPhone());
            
            // Save patient
            patientRepository.save(patient);
            
            return ResponseEntity.ok().body("Patient registered successfully with patient number: " + patientNumber);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
    
    private String buildAddress(String street, String city, String state, String zip) {
        StringBuilder address = new StringBuilder();
        if (street != null && !street.isEmpty()) address.append(street);
        if (city != null && !city.isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(city);
        }
        if (state != null && !state.isEmpty()) {
            if (address.length() > 0) address.append(", ");
            address.append(state);
        }
        if (zip != null && !zip.isEmpty()) {
            if (address.length() > 0) address.append(" ");
            address.append(zip);
        }
        return address.toString();
    }
    
    // DTO for Patient Registration
    public static class PatientRegistrationRequest {
        private String username;
        private String password;
        private String email;
        private PatientData patientData;
        
        public static class PatientData {
            private String firstName;
            private String lastName;
            private String dateOfBirth;
            private String gender;
            private String phoneNumber;
            private String address;
            private String city;
            private String state;
            private String zipCode;
            private String bloodGroup;
            private String allergies;
            private String emergencyContact;
            private String emergencyPhone;
            
            // Getters and Setters
            public String getFirstName() { return firstName; }
            public void setFirstName(String firstName) { this.firstName = firstName; }
            
            public String getLastName() { return lastName; }
            public void setLastName(String lastName) { this.lastName = lastName; }
            
            public String getDateOfBirth() { return dateOfBirth; }
            public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }
            
            public String getGender() { return gender; }
            public void setGender(String gender) { this.gender = gender; }
            
            public String getPhoneNumber() { return phoneNumber; }
            public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
            
            public String getAddress() { return address; }
            public void setAddress(String address) { this.address = address; }
            
            public String getCity() { return city; }
            public void setCity(String city) { this.city = city; }
            
            public String getState() { return state; }
            public void setState(String state) { this.state = state; }
            
            public String getZipCode() { return zipCode; }
            public void setZipCode(String zipCode) { this.zipCode = zipCode; }
            
            public String getBloodGroup() { return bloodGroup; }
            public void setBloodGroup(String bloodGroup) { this.bloodGroup = bloodGroup; }
            
            public String getAllergies() { return allergies; }
            public void setAllergies(String allergies) { this.allergies = allergies; }
            
            public String getEmergencyContact() { return emergencyContact; }
            public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
            
            public String getEmergencyPhone() { return emergencyPhone; }
            public void setEmergencyPhone(String emergencyPhone) { this.emergencyPhone = emergencyPhone; }
        }
        
        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        
        public PatientData getPatientData() { return patientData; }
        public void setPatientData(PatientData patientData) { this.patientData = patientData; }
    }
}