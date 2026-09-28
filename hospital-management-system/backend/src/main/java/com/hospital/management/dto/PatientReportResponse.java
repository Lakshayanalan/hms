package com.hospital.management.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class PatientReportResponse {
    
    private Long patientId;
    private String patientNumber;
    private String patientName;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String bloodType;
    private String allergies;
    private LocalDateTime registrationDate;
    private int totalAppointments;
    private int completedAppointments;
    private int cancelledAppointments;
    private int noShowAppointments;
    private LocalDateTime lastAppointmentDate;
    private LocalDateTime nextAppointmentDate;
    private BigDecimal totalBilled;
    private BigDecimal totalPaid;
    private BigDecimal outstandingAmount;
    private List<AppointmentSummary> recentAppointments;
    private List<InvoiceSummary> recentInvoices;
    
    // Inner classes for summary data
    public static class AppointmentSummary {
        private Long appointmentId;
        private LocalDateTime appointmentDateTime;
        private String doctorName;
        private String appointmentType;
        private String status;
        private String reason;
        
        // Constructors, getters and setters
        public AppointmentSummary() {}
        
        public Long getAppointmentId() { return appointmentId; }
        public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
        
        public LocalDateTime getAppointmentDateTime() { return appointmentDateTime; }
        public void setAppointmentDateTime(LocalDateTime appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }
        
        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
        
        public String getAppointmentType() { return appointmentType; }
        public void setAppointmentType(String appointmentType) { this.appointmentType = appointmentType; }
        
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        
        public String getReason() { return reason; }
        public void setReason(String reason) { this.reason = reason; }
    }
    
    public static class InvoiceSummary {
        private Long invoiceId;
        private String invoiceNumber;
        private LocalDate invoiceDate;
        private BigDecimal totalAmount;
        private String paymentStatus;
        
        // Constructors, getters and setters
        public InvoiceSummary() {}
        
        public Long getInvoiceId() { return invoiceId; }
        public void setInvoiceId(Long invoiceId) { this.invoiceId = invoiceId; }
        
        public String getInvoiceNumber() { return invoiceNumber; }
        public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
        
        public LocalDate getInvoiceDate() { return invoiceDate; }
        public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }
        
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
        
        public String getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    }
    
    // Constructors
    public PatientReportResponse() {}
    
    // Getters and Setters
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
    
    public String getPatientNumber() { return patientNumber; }
    public void setPatientNumber(String patientNumber) { this.patientNumber = patientNumber; }
    
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }
    
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    
    public String getBloodType() { return bloodType; }
    public void setBloodType(String bloodType) { this.bloodType = bloodType; }
    
    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }
    
    public LocalDateTime getRegistrationDate() { return registrationDate; }
    public void setRegistrationDate(LocalDateTime registrationDate) { this.registrationDate = registrationDate; }
    
    public int getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(int totalAppointments) { this.totalAppointments = totalAppointments; }
    
    public int getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(int completedAppointments) { this.completedAppointments = completedAppointments; }
    
    public int getCancelledAppointments() { return cancelledAppointments; }
    public void setCancelledAppointments(int cancelledAppointments) { this.cancelledAppointments = cancelledAppointments; }
    
    public int getNoShowAppointments() { return noShowAppointments; }
    public void setNoShowAppointments(int noShowAppointments) { this.noShowAppointments = noShowAppointments; }
    
    public LocalDateTime getLastAppointmentDate() { return lastAppointmentDate; }
    public void setLastAppointmentDate(LocalDateTime lastAppointmentDate) { this.lastAppointmentDate = lastAppointmentDate; }
    
    public LocalDateTime getNextAppointmentDate() { return nextAppointmentDate; }
    public void setNextAppointmentDate(LocalDateTime nextAppointmentDate) { this.nextAppointmentDate = nextAppointmentDate; }
    
    public BigDecimal getTotalBilled() { return totalBilled; }
    public void setTotalBilled(BigDecimal totalBilled) { this.totalBilled = totalBilled; }
    
    public BigDecimal getTotalPaid() { return totalPaid; }
    public void setTotalPaid(BigDecimal totalPaid) { this.totalPaid = totalPaid; }
    
    public BigDecimal getOutstandingAmount() { return outstandingAmount; }
    public void setOutstandingAmount(BigDecimal outstandingAmount) { this.outstandingAmount = outstandingAmount; }
    
    public List<AppointmentSummary> getRecentAppointments() { return recentAppointments; }
    public void setRecentAppointments(List<AppointmentSummary> recentAppointments) { this.recentAppointments = recentAppointments; }
    
    public List<InvoiceSummary> getRecentInvoices() { return recentInvoices; }
    public void setRecentInvoices(List<InvoiceSummary> recentInvoices) { this.recentInvoices = recentInvoices; }
}