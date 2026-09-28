package com.hospital.management.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "medical_records")
public class MedicalRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;
    
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @NotNull
    private Patient patient;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @NotNull
    private User doctor; // User with DOCTOR role
    
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment; // Optional - can be linked to an appointment
    
    @NotBlank
    @Size(max = 200)
    @Column(name = "title")
    private String title;
    
    @Column(name = "chief_complaint", columnDefinition = "TEXT")
    private String chiefComplaint;
    
    @Column(name = "history_present_illness", columnDefinition = "TEXT")
    private String historyPresentIllness;
    
    @Column(name = "physical_examination", columnDefinition = "TEXT")
    private String physicalExamination;
    
    @Column(name = "vital_signs", columnDefinition = "TEXT")
    private String vitalSigns;
    
    @Column(name = "diagnosis", columnDefinition = "TEXT")
    private String diagnosis;
    
    @Column(name = "treatment_plan", columnDefinition = "TEXT")
    private String treatmentPlan;
    
    @Column(name = "medications", columnDefinition = "TEXT")
    private String medications;
    
    @Column(name = "lab_results", columnDefinition = "TEXT")
    private String labResults;
    
    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;
    
    @Column(name = "follow_up_instructions", columnDefinition = "TEXT")
    private String followUpInstructions;
    
    @NotNull
    @Column(name = "record_date")
    private LocalDateTime recordDate;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "medicalRecord", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MedicalDocument> documents = new ArrayList<>();
    
    // Constructors
    public MedicalRecord() {}
    
    public MedicalRecord(Patient patient, User doctor, String title, LocalDateTime recordDate) {
        this.patient = patient;
        this.doctor = doctor;
        this.title = title;
        this.recordDate = recordDate;
    }
    
    // Getters and Setters
    public Long getRecordId() { return recordId; }
    public void setRecordId(Long recordId) { this.recordId = recordId; }
    
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    
    public User getDoctor() { return doctor; }
    public void setDoctor(User doctor) { this.doctor = doctor; }
    
    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    
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
    
    public List<MedicalDocument> getDocuments() { return documents; }
    public void setDocuments(List<MedicalDocument> documents) { this.documents = documents; }
}