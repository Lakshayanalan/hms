package com.hospital.management.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "patients", 
       uniqueConstraints = {
           @UniqueConstraint(columnNames = "patient_number")
       })
public class Patient {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id")
    private Long patientId;
    
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @NotBlank
    @Size(max = 20)
    @Column(name = "patient_number", unique = true)
    private String patientNumber;
    
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;
    
    @Size(max = 500)
    @Column(name = "address", columnDefinition = "TEXT")
    private String address;
    
    @Size(max = 100)
    @Column(name = "emergency_contact")
    private String emergencyContact;
    
    @Size(max = 15)
    @Pattern(regexp = "^[+]?[0-9\\-\\s()]*$", message = "Invalid phone number format")
    @Column(name = "emergency_phone")
    private String emergencyPhone;
    
    @Size(max = 5)
    @Column(name = "blood_type")
    private String bloodType;
    
    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public Patient() {}
    
    public Patient(User user, String patientNumber, LocalDate dateOfBirth, 
                   Gender gender, String address, String emergencyContact, 
                   String emergencyPhone, String bloodType, String allergies) {
        this.user = user;
        this.patientNumber = patientNumber;
        this.dateOfBirth = dateOfBirth;
        this.gender = gender;
        this.address = address;
        this.emergencyContact = emergencyContact;
        this.emergencyPhone = emergencyPhone;
        this.bloodType = bloodType;
        this.allergies = allergies;
    }
    
    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getPatientNumber() { return patientNumber; }
    public void setPatientNumber(String patientNumber) { this.patientNumber = patientNumber; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    
    public String getEmergencyPhone() { return emergencyPhone; }
    public void setEmergencyPhone(String emergencyPhone) { this.emergencyPhone = emergencyPhone; }
    
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    // Helper method to get full name from associated user
    public String getFullName() {
        return user != null ? user.getFirstName() + " " + user.getLastName() : "";
    }
}