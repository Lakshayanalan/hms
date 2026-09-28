package com.hospital.management.dto;

import java.time.LocalDate;
import java.util.Map;

public class AppointmentStatsResponse {
    
    private LocalDate startDate;
    private LocalDate endDate;
    
    // Overall statistics
    private int totalAppointments;
    private int scheduledAppointments;
    private int confirmedAppointments;
    private int completedAppointments;
    private int cancelledAppointments;
    private int noShowAppointments;
    private int inProgressAppointments;
    
    // Percentages
    private Double completionRate;
    private Double cancellationRate;
    private Double noShowRate;
    
    // Appointment type breakdown
    private Map<String, Integer> appointmentTypeBreakdown;
    
    // Doctor performance
    private Map<String, DoctorStats> doctorStats;
    
    // Daily breakdown
    private Map<String, Integer> dailyAppointments;
    
    // Monthly breakdown
    private Map<String, Integer> monthlyAppointments;
    
    // Peak hours analysis
    private Map<String, Integer> hourlyDistribution;
    
    // Average metrics
    private Double averageDurationMinutes;
    private Double averageWaitingDays; // Days between scheduling and appointment
    
    // Inner class for doctor statistics
    public static class DoctorStats {
        private String doctorName;
        private int totalAppointments;
        private int completedAppointments;
        private int cancelledAppointments;
        private int noShowAppointments;
        private Double completionRate;
        
        // Constructors, getters and setters
        public DoctorStats() {}
        
        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
        
        public int getTotalAppointments() { return totalAppointments; }
        public void setTotalAppointments(int totalAppointments) { this.totalAppointments = totalAppointments; }
        
        public int getCompletedAppointments() { return completedAppointments; }
        public void setCompletedAppointments(int completedAppointments) { this.completedAppointments = completedAppointments; }
        
        public int getCancelledAppointments() { return cancelledAppointments; }
        public void setCancelledAppointments(int cancelledAppointments) { this.cancelledAppointments = cancelledAppointments; }
        
        public int getNoShowAppointments() { return noShowAppointments; }
        public void setNoShowAppointments(int noShowAppointments) { this.noShowAppointments = noShowAppointments; }
        
        public Double getCompletionRate() { return completionRate; }
        public void setCompletionRate(Double completionRate) { this.completionRate = completionRate; }
    }
    
    // Constructors
    public AppointmentStatsResponse() {}
    
    // Getters and Setters
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public int getTotalAppointments() { return totalAppointments; }
    public void setTotalAppointments(int totalAppointments) { this.totalAppointments = totalAppointments; }
    
    public int getScheduledAppointments() { return scheduledAppointments; }
    public void setScheduledAppointments(int scheduledAppointments) { this.scheduledAppointments = scheduledAppointments; }
    
    public int getConfirmedAppointments() { return confirmedAppointments; }
    public void setConfirmedAppointments(int confirmedAppointments) { this.confirmedAppointments = confirmedAppointments; }
    
    public int getCompletedAppointments() { return completedAppointments; }
    public void setCompletedAppointments(int completedAppointments) { this.completedAppointments = completedAppointments; }
    
    public int getCancelledAppointments() { return cancelledAppointments; }
    public void setCancelledAppointments(int cancelledAppointments) { this.cancelledAppointments = cancelledAppointments; }
    
    public int getNoShowAppointments() { return noShowAppointments; }
    public void setNoShowAppointments(int noShowAppointments) { this.noShowAppointments = noShowAppointments; }
    
    public int getInProgressAppointments() { return inProgressAppointments; }
    public void setInProgressAppointments(int inProgressAppointments) { this.inProgressAppointments = inProgressAppointments; }
    
    public Double getCompletionRate() { return completionRate; }
    public void setCompletionRate(Double completionRate) { this.completionRate = completionRate; }
    
    public Double getCancellationRate() { return cancellationRate; }
    public void setCancellationRate(Double cancellationRate) { this.cancellationRate = cancellationRate; }
    
    public Double getNoShowRate() { return noShowRate; }
    public void setNoShowRate(Double noShowRate) { this.noShowRate = noShowRate; }
    
    public Map<String, Integer> getAppointmentTypeBreakdown() { return appointmentTypeBreakdown; }
    public void setAppointmentTypeBreakdown(Map<String, Integer> appointmentTypeBreakdown) { this.appointmentTypeBreakdown = appointmentTypeBreakdown; }
    
    public Map<String, DoctorStats> getDoctorStats() { return doctorStats; }
    public void setDoctorStats(Map<String, DoctorStats> doctorStats) { this.doctorStats = doctorStats; }
    
    public Map<String, Integer> getDailyAppointments() { return dailyAppointments; }
    public void setDailyAppointments(Map<String, Integer> dailyAppointments) { this.dailyAppointments = dailyAppointments; }
    
    public Map<String, Integer> getMonthlyAppointments() { return monthlyAppointments; }
    public void setMonthlyAppointments(Map<String, Integer> monthlyAppointments) { this.monthlyAppointments = monthlyAppointments; }
    
    public Map<String, Integer> getHourlyDistribution() { return hourlyDistribution; }
    public void setHourlyDistribution(Map<String, Integer> hourlyDistribution) { this.hourlyDistribution = hourlyDistribution; }
    
    public Double getAverageDurationMinutes() { return averageDurationMinutes; }
    public void setAverageDurationMinutes(Double averageDurationMinutes) { this.averageDurationMinutes = averageDurationMinutes; }
    
    public Double getAverageWaitingDays() { return averageWaitingDays; }
    public void setAverageWaitingDays(Double averageWaitingDays) { this.averageWaitingDays = averageWaitingDays; }
}