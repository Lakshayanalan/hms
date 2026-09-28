package com.hospital.management.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "visits")
public class Visit {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "visit_id")
    private Long visitId;
    
    @Size(max = 20)
    @Column(name = "visit_number", unique = true)
    private String visitNumber;
    
    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    @NotNull
    private Patient patient;
    
    @OneToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
    
    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    @NotNull
    private User doctor;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VisitStatus status = VisitStatus.IN_PROGRESS;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "visit_type")
    private VisitType visitType = VisitType.CONSULTATION;
    
    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;
    
    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;
    
    @Size(max = 1000)
    @Column(name = "notes")
    private String notes;
    
    @Size(max = 500)
    @Column(name = "diagnosis")
    private String diagnosis;
    
    @Size(max = 500)
    @Column(name = "treatment_plan")
    private String treatmentPlan;
    
    @OneToMany(mappedBy = "visit", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Prescription> prescriptions = new ArrayList<>();
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Visit() {}
    
    public Visit(String visitNumber, Patient patient, User doctor, VisitType visitType) {
        this.visitNumber = visitNumber;
        this.patient = patient;
        this.doctor = doctor;
        this.visitType = visitType;
        this.checkInTime = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getVisitId() { return visitId; }
    public void setVisitId(Long visitId) { this.visitId = visitId; }
    
    public String getVisitNumber() { return visitNumber; }
    public void setVisitNumber(String visitNumber) { this.visitNumber = visitNumber; }
    
    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }
    
    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
    
    public User getDoctor() { return doctor; }
    public void setDoctor(User doctor) { this.doctor = doctor; }
    
    public VisitStatus getStatus() { return status; }
    public void setStatus(VisitStatus status) { this.status = status; }
    
    public VisitType getVisitType() { return visitType; }
    public void setVisitType(VisitType visitType) { this.visitType = visitType; }
    
    public LocalDateTime getCheckInTime() { return checkInTime; }
    public void setCheckInTime(LocalDateTime checkInTime) { this.checkInTime = checkInTime; }
    
    public LocalDateTime getCheckOutTime() { return checkOutTime; }
    public void setCheckOutTime(LocalDateTime checkOutTime) { this.checkOutTime = checkOutTime; }
    
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    
    public String getTreatmentPlan() { return treatmentPlan; }
    public void setTreatmentPlan(String treatmentPlan) { this.treatmentPlan = treatmentPlan; }
    
    public List<Prescription> getPrescriptions() { return prescriptions; }
    public void setPrescriptions(List<Prescription> prescriptions) { this.prescriptions = prescriptions; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    // Business methods
    public void checkOut() {
        this.checkOutTime = LocalDateTime.now();
        this.status = VisitStatus.COMPLETED;
    }
    
    public boolean isActive() {
        return status == VisitStatus.IN_PROGRESS;
    }
    
    public boolean canGenerateBill() {
        return status == VisitStatus.COMPLETED;
    }
    
    public void addPrescription(Prescription prescription) {
        prescriptions.add(prescription);
        prescription.setVisit(this);
    }
}