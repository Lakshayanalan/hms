package com.hospital.management.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.UserCreationRequest;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Role;
import com.hospital.management.entity.User;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;

@Service
@Transactional
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User createUser(UserCreationRequest request) {
        // Check if username or email already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Create User entity
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setIsActive(true);
        
        // Save user first
        user = userRepository.save(user);
        
        // If the user role is PATIENT, create a corresponding Patient entity
        if (Role.valueOf(request.getRole()) == Role.PATIENT) {
            createPatientForUser(user);
        }
        
        return user;
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAllActiveUsers();
    }
    
    public Page<User> searchUsers(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("lastName", "firstName"));
        
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return userRepository.findAll(pageable);
        }
        
        return userRepository.findBySearchTerm(searchTerm.trim(), pageable);
    }
    
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }
    
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public List<User> getUsersByRole(Role role) {
        return userRepository.findActiveUsersByRole(role);
    }
    
    public User updateUser(Long userId, UserCreationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if username or email already exists (excluding current user)
        if (!user.getUsername().equals(request.getUsername()) && 
            userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Store old role to check if role changed
        Role oldRole = user.getRole();
        Role newRole = Role.valueOf(request.getRole());
        
        // Update user details
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(newRole);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        
        // Update password only if provided
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        
        user = userRepository.save(user);
        
        // Handle role change: if user is being changed TO patient role and wasn't before
        if (newRole == Role.PATIENT && oldRole != Role.PATIENT) {
            // Check if patient record already exists
            if (patientRepository.findByUser_UserId(userId).isEmpty()) {
                createPatientForUser(user);
            }
        }
        
        return user;
    }
    
    public User updateUserProfile(Long userId, String email, String firstName, String lastName, String phone) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if email already exists (excluding current user)
        if (!user.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }
        
        // Update only the profile fields
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        
        return userRepository.save(user);
    }
    
    public void deactivateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsActive(false);
        userRepository.save(user);
    }
    
    public void activateUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsActive(true);
        userRepository.save(user);
    }
    
    public Long getTotalUsers() {
        return (long) userRepository.findAllActiveUsers().size();
    }
    
    public Long getUserCountByRole(Role role) {
        return userRepository.countActiveUsersByRole(role);
    }
    
    public List<Role> getAllRoles() {
        return List.of(Role.values());
    }
    
    /**
     * Creates a Patient entity for a User with PATIENT role
     * This ensures that when an admin creates a patient user, they appear in the patient management system
     */
    private void createPatientForUser(User user) {
        // Generate patient number
        String patientNumber = generatePatientNumber();
        
        // Create Patient entity with basic information from User
        Patient patient = new Patient();
        patient.setUser(user);
        patient.setPatientNumber(patientNumber);
        // Set default/placeholder values that can be updated later through patient management
        patient.setDateOfBirth(null); // Will need to be set later
        patient.setGender(null); // Will need to be set later
        patient.setAddress(""); // Empty initially
        patient.setEmergencyContact(""); // Empty initially
        patient.setEmergencyPhone(""); // Empty initially
        patient.setBloodType(""); // Empty initially
        patient.setAllergies(""); // Empty initially
        
        patientRepository.save(patient);
    }
    
    /**
     * Generates a unique patient number
     */
    private String generatePatientNumber() {
        // Generate patient number format: PAT-YYYYMMDD-XXX
        String dateFormat = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "PAT-" + dateFormat + "-";
        
        // Find the next sequential number for today
        long count = patientRepository.count() + 1;
        String sequence = String.format("%03d", count);
        
        String patientNumber = prefix + sequence;
        
        // Ensure uniqueness
        while (patientRepository.existsByPatientNumber(patientNumber)) {
            count++;
            sequence = String.format("%03d", count);
            patientNumber = prefix + sequence;
        }
        
        return patientNumber;
    }
    
    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Update password
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}