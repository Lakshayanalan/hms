package com.hospital.management.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class MedicalRecordRequest {
    
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    private Long appointmentId; // Optional
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;
    
    @Size(max = 1000, message = "Chief complaint cannot exceed 1000 characters")
    private String chiefComplaint;
    
    @Size(max = 2000, message = "History of present illness cannot exceed 2000 characters")
    private String historyPresentIllness;
    
    @Size(max = 2000, message = "Physical examination cannot exceed 2000 characters")
    private String physicalExamination;
    
    @Size(max = 500, message = "Vital signs cannot exceed 500 characters")
    private String vitalSigns;
    
    @Size(max = 1000, message = "Diagnosis cannot exceed 1000 characters")
    private String diagnosis;
    
    @Size(max = 2000, message = "Treatment plan cannot exceed 2000 characters")
    private String treatmentPlan;
    
    @Size(max = 1000, message = "Medications cannot exceed 1000 characters")
    private String medications;
    
    @Size(max = 2000, message = "Lab results cannot exceed 2000 characters")
    private String labResults;
    
    @Size(max = 2000, message = "Notes cannot exceed 2000 characters")
    private String notes;
    
    @Size(max = 1000, message = "Follow-up instructions cannot exceed 1000 characters")
    private String followUpInstructions;
    
    @NotNull(message = "Record date is required")
    private LocalDateTime recordDate;
    
    // Constructors
    public MedicalRecordRequest() {}
    
    public MedicalRecordRequest(Long patientId, Long doctorId, String title, LocalDateTime recordDate) {
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.title = title;
        this.recordDate = recordDate;
    }
    
    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }
    
    public String getHistoryPresentIllness() { return historyPresentIllness; }
    public void setHistoryPresentIllness(String historyPresentIllness) { this.historyPresentIllness = historyPresentIllness; }
    
    public String getPhysicalExamination() { return physicalExamination; }
    public void setPhysicalExamination(String physicalExamination) { this.physicalExamination = physicalExamination; }
    
    public String getVitalSigns() { return vitalSigns; }
    public void setVitalSigns(String vitalSigns) { this.vitalSigns = vitalSigns; }
    
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    
    public String getTreatmentPlan() { return treatmentPlan; }
    public void setTreatmentPlan(String treatmentPlan) { this.treatmentPlan = treatmentPlan; }
    
    public String getMedications() { return medications; }
    public void setMedications(String medications) { this.medications = medications; }
    
    public String getLabResults() { return labResults; }
    public void setLabResults(String labResults) { this.labResults = labResults; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getFollowUpInstructions() { return followUpInstructions; }
    public void setFollowUpInstructions(String followUpInstructions) { this.followUpInstructions = followUpInstructions; }
    
    public LocalDateTime getRecordDate() { return recordDate; }
    public void setRecordDate(LocalDateTime recordDate) { this.recordDate = recordDate; }
}