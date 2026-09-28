package com.hospital.management.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.PatientRegistrationRequest;
import com.hospital.management.dto.PatientResponse;
import com.hospital.management.entity.Gender;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Role;
import com.hospital.management.entity.User;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;

@Service
@Transactional
public class PatientService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public PatientResponse registerPatient(PatientRegistrationRequest request) {
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
        user.setRole(Role.PATIENT);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setIsActive(true);
        
        // Save user first
        user = userRepository.save(user);
        
        // Generate patient number
        String patientNumber = generatePatientNumber();
        
        // Create Patient entity
        Patient patient = new Patient();
        patient.setUser(user);
        patient.setPatientNumber(patientNumber);
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(Gender.valueOf(request.getGender()));
        patient.setAddress(request.getAddress());
        patient.setEmergencyContact(request.getEmergencyContact());
        patient.setEmergencyPhone(request.getEmergencyPhone());
        patient.setBloodType(request.getBloodType());
        patient.setAllergies(request.getAllergies());
        
        patient = patientRepository.save(patient);
        
        return convertToResponse(patient);
    }
    
    public List<PatientResponse> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    public Page<PatientResponse> searchPatients(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("user.lastName", "user.firstName"));
        
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return patientRepository.findAll(pageable).map(this::convertToResponse);
        }
        
        return patientRepository.findBySearchTerm(searchTerm.trim(), pageable)
                .map(this::convertToResponse);
    }
    
    public Optional<PatientResponse> getPatientById(Long patientId) {
        return patientRepository.findById(patientId)
                .map(this::convertToResponse);
    }
    
    public Optional<Patient> getPatientEntityById(Long patientId) {
        return patientRepository.findById(patientId);
    }
    
    public Optional<PatientResponse> getPatientByNumber(String patientNumber) {
        return patientRepository.findByPatientNumber(patientNumber)
                .map(this::convertToResponse);
    }
    
    public Optional<PatientResponse> getPatientByUserId(Long userId) {
        return patientRepository.findByUser_UserId(userId)
                .map(this::convertToResponse);
    }
    
    public PatientResponse updatePatient(Long patientId, PatientRegistrationRequest request) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        User user = patient.getUser();
        
        // Check if username or email already exists (excluding current user)
        if (!user.getUsername().equals(request.getUsername()) && 
            userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        // Update user details
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        
        // Update password only if provided and not the dummy value
        if (request.getPassword() != null && 
            !request.getPassword().trim().isEmpty() && 
            !request.getPassword().equals("dummy_password_for_validation")) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }
        
        // Update patient details
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(Gender.valueOf(request.getGender()));
        patient.setAddress(request.getAddress());
        patient.setEmergencyContact(request.getEmergencyContact());
        patient.setEmergencyPhone(request.getEmergencyPhone());
        patient.setBloodType(request.getBloodType());
        patient.setAllergies(request.getAllergies());
        
        patient = patientRepository.save(patient);
        
        return convertToResponse(patient);
    }
    
    public void deactivatePatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        patient.getUser().setIsActive(false);
        patientRepository.save(patient);
    }
    
    public Long getTotalPatients() {
        return patientRepository.countActivePatients();
    }
    
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
    
    private PatientResponse convertToResponse(Patient patient) {
        User user = patient.getUser();
        return new PatientResponse(
            patient.getPatientId(),
            user.getUserId(),
            patient.getPatientNumber(),
            user.getUsername(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            patient.getDateOfBirth(),
            patient.getGender() != null ? patient.getGender().name() : null,
            patient.getAddress(),
            patient.getEmergencyContact(),
            patient.getEmergencyPhone(),
            patient.getBloodType(),
            patient.getAllergies(),
            user.getIsActive(),
            patient.getCreatedAt()
        );
    }
}