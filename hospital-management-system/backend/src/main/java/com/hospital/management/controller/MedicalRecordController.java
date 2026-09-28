package com.hospital.management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

import com.hospital.management.dto.MedicalRecordRequest;
import com.hospital.management.dto.MedicalRecordResponse;
import com.hospital.management.service.MedicalRecordService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/medical-records")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalRecordController {
    
    @Autowired
    private MedicalRecordService medicalRecordService;
    
    @PostMapping
    public ResponseEntity<?> createMedicalRecord(@Valid @RequestBody MedicalRecordRequest request,
                                                BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                .body("Validation errors: " + bindingResult.getAllErrors().toString());
        }
        
        try {
            MedicalRecordResponse medicalRecord = medicalRecordService.createMedicalRecord(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(medicalRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping
    public ResponseEntity<Page<MedicalRecordResponse>> getAllMedicalRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<MedicalRecordResponse> medicalRecords = medicalRecordService.getAllMedicalRecords(page, size);
        return ResponseEntity.ok(medicalRecords);
    }
    
    @GetMapping("/{recordId}")
    public ResponseEntity<?> getMedicalRecordById(@PathVariable Long recordId) {
        return medicalRecordService.getMedicalRecordById(recordId)
                .map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByPatient(@PathVariable Long patientId) {
        List<MedicalRecordResponse> medicalRecords = medicalRecordService.getMedicalRecordsByPatient(patientId);
        return ResponseEntity.ok(medicalRecords);
    }
    
    @GetMapping("/patient/{patientId}/paginated")
    public ResponseEntity<Page<MedicalRecordResponse>> getMedicalRecordsByPatientPaginated(
            @PathVariable Long patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<MedicalRecordResponse> medicalRecords = medicalRecordService.getMedicalRecordsByPatientPaginated(patientId, page, size);
        return ResponseEntity.ok(medicalRecords);
    }
    
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByDoctor(@PathVariable Long doctorId) {
        List<MedicalRecordResponse> medicalRecords = medicalRecordService.getMedicalRecordsByDoctor(doctorId);
        return ResponseEntity.ok(medicalRecords);
    }
    
    @GetMapping("/doctor/{doctorId}/paginated")
    public ResponseEntity<Page<MedicalRecordResponse>> getMedicalRecordsByDoctorPaginated(
            @PathVariable Long doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<MedicalRecordResponse> medicalRecords = medicalRecordService.getMedicalRecordsByDoctorPaginated(doctorId, page, size);
        return ResponseEntity.ok(medicalRecords);
    }
    
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<MedicalRecordResponse>> getMedicalRecordsByAppointment(@PathVariable Long appointmentId) {
        List<MedicalRecordResponse> medicalRecords = medicalRecordService.getMedicalRecordsByAppointment(appointmentId);
        return ResponseEntity.ok(medicalRecords);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<MedicalRecordResponse>> searchMedicalRecords(
            @RequestParam(required = false, defaultValue = "") String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Page<MedicalRecordResponse> medicalRecords = medicalRecordService.searchMedicalRecords(searchTerm, page, size);
        return ResponseEntity.ok(medicalRecords);
    }
    
    @PutMapping("/{recordId}")
    public ResponseEntity<?> updateMedicalRecord(@PathVariable Long recordId,
                                                @Valid @RequestBody MedicalRecordRequest request,
                                                BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest()
                .body("Validation errors: " + bindingResult.getAllErrors().toString());
        }
        
        try {
            MedicalRecordResponse medicalRecord = medicalRecordService.updateMedicalRecord(recordId, request);
            return ResponseEntity.ok(medicalRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{recordId}")
    public ResponseEntity<?> deleteMedicalRecord(@PathVariable Long recordId) {
        try {
            medicalRecordService.deleteMedicalRecord(recordId);
            return ResponseEntity.ok().body("Medical record deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/patient/{patientId}/history")
    public ResponseEntity<List<MedicalRecordResponse>> getPatientMedicalHistory(@PathVariable Long patientId) {
        try {
            List<MedicalRecordResponse> history = medicalRecordService.getPatientMedicalHistory(patientId);
            return ResponseEntity.ok(history);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<MedicalRecordResponse>> getRecentMedicalRecords() {
        List<MedicalRecordResponse> recentRecords = medicalRecordService.getRecentMedicalRecords();
        return ResponseEntity.ok(recentRecords);
    }
    
    @GetMapping("/stats/total")
    public ResponseEntity<Long> getTotalMedicalRecords() {
        Long total = medicalRecordService.getTotalMedicalRecords();
        return ResponseEntity.ok(total);
    }
    
    @GetMapping("/stats/patient/{patientId}")
    public ResponseEntity<Long> getMedicalRecordCountByPatient(@PathVariable Long patientId) {
        try {
            Long count = medicalRecordService.getMedicalRecordCountByPatient(patientId);
            return ResponseEntity.ok(count);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    @GetMapping("/stats/doctor/{doctorId}")
    public ResponseEntity<Long> getMedicalRecordCountByDoctor(@PathVariable Long doctorId) {
        try {
            Long count = medicalRecordService.getMedicalRecordCountByDoctor(doctorId);
            return ResponseEntity.ok(count);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}