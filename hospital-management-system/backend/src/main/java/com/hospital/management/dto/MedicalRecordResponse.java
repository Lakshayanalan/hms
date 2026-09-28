package com.hospital.management.dto;

import java.time.LocalDateTime;

public class MedicalRecordResponse {
    
    private Long recordId;
    private Long patientId;
    private String patientName;
    private String patientNumber;
    private Long doctorId;
    private String doctorName;
    private Long appointmentId;
    private String title;
    private String chiefComplaint;
    private String historyPresentIllness;
    private String physicalExamination;
    private String vitalSigns;
    private String diagnosis;
    private String treatmentPlan;
    private String medications;
    private String labResults;
    private String notes;
    private String followUpInstructions;
    private LocalDateTime recordDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public MedicalRecordResponse() {}
    
    public MedicalRecordResponse(Long recordId, Long patientId, String patientName, String patientNumber,
                               Long doctorId, String doctorName, Long appointmentId, String title,
                               String chiefComplaint, String historyPresentIllness, String physicalExamination,
                               String vitalSigns, String diagnosis, String treatmentPlan, String medications,
                               String labResults, String notes, String followUpInstructions,
                               LocalDateTime recordDate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.recordId = recordId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientNumber = patientNumber;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.appointmentId = appointmentId;
        this.title = title;
        this.chiefComplaint = chiefComplaint;
        this.historyPresentIllness = historyPresentIllness;
        this.physicalExamination = physicalExamination;
        this.vitalSigns = vitalSigns;
        this.diagnosis = diagnosis;
        this.treatmentPlan = treatmentPlan;
        this.medications = medications;
        this.labResults = labResults;
        this.notes = notes;
        this.followUpInstructions = followUpInstructions;
        this.recordDate = recordDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getRecordId() { return recordId; }
    public void setRecordId(Long recordId) { this.recordId = recordId; }
    
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    
    public String getPatientNumber() { return patientNumber; }
    public void setPatientNumber(String patientNumber) { this.patientNumber = patientNumber; }
    
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    
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
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}