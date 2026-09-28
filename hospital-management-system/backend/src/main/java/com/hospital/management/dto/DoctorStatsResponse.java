package com.hospital.management.dto;

public class DoctorStatsResponse {
    
    private Long doctorId;
    private String doctorName;
    
    // Today's statistics
    private int todaysAppointments;
    private int completedToday;
    private int pendingReviews; // appointments that need medical records
    private int totalPatients; // unique patients the doctor has treated
    
    // This week's statistics
    private int weekAppointments;
    private int weekCompleted;
    
    // This month's statistics
    private int monthAppointments;
    private int monthCompleted;
    
    // Performance metrics
    private Double completionRate;
    private Double averageRating;
    private int totalCompletedAppointments;
    
    // Constructors
    public DoctorStatsResponse() {}
    
    public DoctorStatsResponse(Long doctorId, String doctorName) {
        this.doctorId = doctorId;
        this.doctorName = doctorName;
    }
    
    // Getters and Setters
    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
    
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    
    public int getTodaysAppointments() { return todaysAppointments; }
    public void setTodaysAppointments(int todaysAppointments) { this.todaysAppointments = todaysAppointments; }
    
    public int getCompletedToday() { return completedToday; }
    public void setCompletedToday(int completedToday) { this.completedToday = completedToday; }
    
    public int getPendingReviews() { return pendingReviews; }
    public void setPendingReviews(int pendingReviews) { this.pendingReviews = pendingReviews; }
    
    public int getTotalPatients() { return totalPatients; }
    public void setTotalPatients(int totalPatients) { this.totalPatients = totalPatients; }
    
    public int getWeekAppointments() { return weekAppointments; }
    public void setWeekAppointments(int weekAppointments) { this.weekAppointments = weekAppointments; }
    
    public int getWeekCompleted() { return weekCompleted; }
    public void setWeekCompleted(int weekCompleted) { this.weekCompleted = weekCompleted; }
    
    public int getMonthAppointments() { return monthAppointments; }
    public void setMonthAppointments(int monthAppointments) { this.monthAppointments = monthAppointments; }
    
    public int getMonthCompleted() { return monthCompleted; }
    public void setMonthCompleted(int monthCompleted) { this.monthCompleted = monthCompleted; }
    
    public Double getCompletionRate() { return completionRate; }
    public void setCompletionRate(Double completionRate) { this.completionRate = completionRate; }
    
    public Double getAverageRating() { return averageRating; }
    public void setAverageRating(Double averageRating) { this.averageRating = averageRating; }
    
    public int getTotalCompletedAppointments() { return totalCompletedAppointments; }
    public void setTotalCompletedAppointments(int totalCompletedAppointments) { this.totalCompletedAppointments = totalCompletedAppointments; }
}