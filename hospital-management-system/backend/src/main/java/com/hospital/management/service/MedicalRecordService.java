package com.hospital.management.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.dto.MedicalRecordRequest;
import com.hospital.management.dto.MedicalRecordResponse;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.MedicalRecord;
import com.hospital.management.entity.Patient;
import com.hospital.management.entity.Role;
import com.hospital.management.entity.User;
import com.hospital.management.repository.AppointmentRepository;
import com.hospital.management.repository.MedicalRecordRepository;
import com.hospital.management.repository.PatientRepository;
import com.hospital.management.repository.UserRepository;

@Service
@Transactional
public class MedicalRecordService {
    
    @Autowired
    private MedicalRecordRepository medicalRecordRepository;
    
    @Autowired
    private PatientRepository patientRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private AppointmentRepository appointmentRepository;
    
    public MedicalRecordResponse createMedicalRecord(MedicalRecordRequest request) {
        // Validate patient exists
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + request.getPatientId()));
        
        // Validate doctor exists and has DOCTOR role
        User doctor = userRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + request.getDoctorId()));
        
        if (doctor.getRole() != Role.DOCTOR) {
            throw new RuntimeException("User is not a doctor");
        }
        
        // Create medical record
        MedicalRecord medicalRecord = new MedicalRecord(patient, doctor, request.getTitle(), request.getRecordDate());
        
        // Set optional appointment if provided
        if (request.getAppointmentId() != null) {
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found with ID: " + request.getAppointmentId()));
            medicalRecord.setAppointment(appointment);
        }
        
        // Set all the medical details
        medicalRecord.setChiefComplaint(request.getChiefComplaint());
        medicalRecord.setHistoryPresentIllness(request.getHistoryPresentIllness());
        medicalRecord.setPhysicalExamination(request.getPhysicalExamination());
        medicalRecord.setVitalSigns(request.getVitalSigns());
        medicalRecord.setDiagnosis(request.getDiagnosis());
        medicalRecord.setTreatmentPlan(request.getTreatmentPlan());
        medicalRecord.setMedications(request.getMedications());
        medicalRecord.setLabResults(request.getLabResults());
        medicalRecord.setNotes(request.getNotes());
        medicalRecord.setFollowUpInstructions(request.getFollowUpInstructions());
        
        medicalRecord = medicalRecordRepository.save(medicalRecord);
        
        return mapToResponse(medicalRecord);
    }
    
    public Optional<MedicalRecordResponse> getMedicalRecordById(Long recordId) {
        return medicalRecordRepository.findById(recordId)
            .map(this::mapToResponse);
    }
    
    public Page<MedicalRecordResponse> getAllMedicalRecords(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("recordDate").descending());
        return medicalRecordRepository.findAll(pageable)
            .map(this::mapToResponse);
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        return medicalRecordRepository.findByPatientOrderByRecordDateDesc(patient)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public Page<MedicalRecordResponse> getMedicalRecordsByPatientPaginated(Long patientId, int page, int size) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        return medicalRecordRepository.findByPatientOrderByRecordDateDesc(patient, pageable)
            .map(this::mapToResponse);
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByDoctor(Long doctorId) {
        User doctor = userRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        return medicalRecordRepository.findByDoctorOrderByRecordDateDesc(doctor)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public Page<MedicalRecordResponse> getMedicalRecordsByDoctorPaginated(Long doctorId, int page, int size) {
        User doctor = userRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        Pageable pageable = PageRequest.of(page, size);
        return medicalRecordRepository.findByDoctorOrderByRecordDateDesc(doctor, pageable)
            .map(this::mapToResponse);
    }
    
    public List<MedicalRecordResponse> getMedicalRecordsByAppointment(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        return medicalRecordRepository.findByAppointment(appointment)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public Page<MedicalRecordResponse> searchMedicalRecords(String searchTerm, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("recordDate").descending());
        return medicalRecordRepository.searchMedicalRecords(searchTerm, pageable)
            .map(this::mapToResponse);
    }
    
    public MedicalRecordResponse updateMedicalRecord(Long recordId, MedicalRecordRequest request) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(recordId)
            .orElseThrow(() -> new RuntimeException("Medical record not found"));
        
        // Validate doctor if changed
        if (!medicalRecord.getDoctor().getUserId().equals(request.getDoctorId())) {
            User newDoctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
            
            if (newDoctor.getRole() != Role.DOCTOR) {
                throw new RuntimeException("User is not a doctor");
            }
            
            medicalRecord.setDoctor(newDoctor);
        }
        
        // Update appointment if changed
        if (request.getAppointmentId() != null && 
            (medicalRecord.getAppointment() == null || 
             !medicalRecord.getAppointment().getAppointmentId().equals(request.getAppointmentId()))) {
            Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
            medicalRecord.setAppointment(appointment);
        } else if (request.getAppointmentId() == null) {
            medicalRecord.setAppointment(null);
        }
        
        // Update all fields
        medicalRecord.setTitle(request.getTitle());
        medicalRecord.setChiefComplaint(request.getChiefComplaint());
        medicalRecord.setHistoryPresentIllness(request.getHistoryPresentIllness());
        medicalRecord.setPhysicalExamination(request.getPhysicalExamination());
        medicalRecord.setVitalSigns(request.getVitalSigns());
        medicalRecord.setDiagnosis(request.getDiagnosis());
        medicalRecord.setTreatmentPlan(request.getTreatmentPlan());
        medicalRecord.setMedications(request.getMedications());
        medicalRecord.setLabResults(request.getLabResults());
        medicalRecord.setNotes(request.getNotes());
        medicalRecord.setFollowUpInstructions(request.getFollowUpInstructions());
        medicalRecord.setRecordDate(request.getRecordDate());
        
        medicalRecord = medicalRecordRepository.save(medicalRecord);
        
        return mapToResponse(medicalRecord);
    }
    
    public void deleteMedicalRecord(Long recordId) {
        MedicalRecord medicalRecord = medicalRecordRepository.findById(recordId)
            .orElseThrow(() -> new RuntimeException("Medical record not found"));
        
        medicalRecordRepository.delete(medicalRecord);
    }
    
    public List<MedicalRecordResponse> getPatientMedicalHistory(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        return medicalRecordRepository.findPatientMedicalHistory(patient)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public List<MedicalRecordResponse> getRecentMedicalRecords() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return medicalRecordRepository.findRecentMedicalRecords(thirtyDaysAgo)
            .stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }
    
    public long getTotalMedicalRecords() {
        return medicalRecordRepository.count();
    }
    
    public long getMedicalRecordCountByPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        return medicalRecordRepository.countByPatient(patient);
    }
    
    public long getMedicalRecordCountByDoctor(Long doctorId) {
        User doctor = userRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        return medicalRecordRepository.countByDoctor(doctor);
    }
    
    private MedicalRecordResponse mapToResponse(MedicalRecord medicalRecord) {
        return new MedicalRecordResponse(
            medicalRecord.getRecordId(),
            medicalRecord.getPatient().getPatientId(),
            medicalRecord.getPatient().getFullName(),
            medicalRecord.getPatient().getPatientNumber(),
            medicalRecord.getDoctor().getUserId(),
            medicalRecord.getDoctor().getFirstName() + " " + medicalRecord.getDoctor().getLastName(),
            medicalRecord.getAppointment() != null ? medicalRecord.getAppointment().getAppointmentId() : null,
            medicalRecord.getTitle(),
            medicalRecord.getChiefComplaint(),
            medicalRecord.getHistoryPresentIllness(),
            medicalRecord.getPhysicalExamination(),
            medicalRecord.getVitalSigns(),
            medicalRecord.getDiagnosis(),
            medicalRecord.getTreatmentPlan(),
            medicalRecord.getMedications(),
            medicalRecord.getLabResults(),
            medicalRecord.getNotes(),
            medicalRecord.getFollowUpInstructions(),
            medicalRecord.getRecordDate(),
            medicalRecord.getCreatedAt(),
            medicalRecord.getUpdatedAt()
        );
    }
}