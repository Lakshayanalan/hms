package com.hospital.management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.dto.PatientRegistrationRequest;
import com.hospital.management.dto.PatientResponse;
import com.hospital.management.service.PatientService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {
    
    @Autowired
    private PatientService patientService;
    
    @PostMapping("/register")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR')")
    public ResponseEntity<?> registerPatient(@Valid @RequestBody PatientRegistrationRequest request, 
                                            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                .body("Validation errors: " + bindingResult.getAllErrors().toString());
        }
        
        try {
            PatientResponse patient = patientService.registerPatient(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(patient);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<List<PatientResponse>> getAllPatients() {
        List<PatientResponse> patients = patientService.getAllPatients();
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/search")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<Page<PatientResponse>> searchPatients(
            @RequestParam(required = false, defaultValue = "") String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<PatientResponse> patients = patientService.searchPatients(searchTerm, page, size);
        return ResponseEntity.ok(patients);
    }
    
    @GetMapping("/{patientId}")
    @PreAuthorize("hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('NURSE')")
    public ResponseEntity<?> getPatientById(@PathVariable Long patientId) {
        return patientService.getPatientById(patientId)
                .map(patient -> ResponseEntity.ok().body(patient))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/number/{patientNumber}")
    public ResponseEntity<?> getPatientByNumber(@PathVariable String patientNumber) {
        return patientService.getPatientByNumber(patientNumber)
                .map(patient -> ResponseEntity.ok().body(patient))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPatientByUserId(@PathVariable Long userId) {
        return patientService.getPatientByUserId(userId)
                .map(patient -> ResponseEntity.ok().body(patient))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PreAuthorize("hasRole('PATIENT') or hasRole('RECEPTIONIST') or hasRole('HOSPITAL_MANAGER') or hasRole('DOCTOR') or hasRole('NURSE')")
    @PutMapping("/{patientId}")
    public ResponseEntity<?> updatePatient(@PathVariable Long patientId,
                                         @RequestBody PatientRegistrationRequest request,
                                         BindingResult bindingResult) {
        // Skip validation for password field if it's empty or null
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            request.setPassword("dummy_password_for_validation");
        }
        
        // Manual validation for required fields (excluding password for updates)
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("First name is required");
        }
        if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Last name is required");
        }
        if (request.getGender() == null || request.getGender().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Gender is required");
        }
        if (request.getDateOfBirth() == null) {
            return ResponseEntity.badRequest().body("Date of birth is required");
        }
        
        try {
            PatientResponse patient = patientService.updatePatient(patientId, request);
            return ResponseEntity.ok(patient);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{patientId}")
    public ResponseEntity<?> deactivatePatient(@PathVariable Long patientId) {
        try {
            patientService.deactivatePatient(patientId);
            return ResponseEntity.ok().body("Patient deactivated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/stats/total")
    public ResponseEntity<Long> getTotalPatients() {
        Long total = patientService.getTotalPatients();
        return ResponseEntity.ok(total);
    }
}