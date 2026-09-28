package com.hospital.management.dto;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ActivityLogResponse {
    
    private String activityType;
    private String title;
    private String description;
    private LocalDateTime timestamp;
    private String icon;
    private String color;
    private String formattedTime;
    
    public ActivityLogResponse() {}
    
    public ActivityLogResponse(String activityType, String title, String description, 
                             LocalDateTime timestamp, String icon, String color) {
        this.activityType = activityType;
        this.title = title;
        this.description = description;
        this.timestamp = timestamp;
        this.icon = icon;
        this.color = color;
        this.formattedTime = formatDateTime(timestamp);
    }
    
    private String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        
        LocalDateTime now = LocalDateTime.now();
        long minutesAgo = java.time.Duration.between(dateTime, now).toMinutes();
        
        if (minutesAgo < 1) {
            return "Just now";
        } else if (minutesAgo < 60) {
            return minutesAgo + " minutes ago";
        } else if (minutesAgo < 1440) { // less than 24 hours
            long hoursAgo = minutesAgo / 60;
            return hoursAgo + " hours ago";
        } else {
            long daysAgo = minutesAgo / 1440;
            if (daysAgo == 1) {
                return "1 day ago";
            } else if (daysAgo < 7) {
                return daysAgo + " days ago";
            } else {
                return dateTime.format(DateTimeFormatter.ofPattern("MMM dd, yyyy"));
            }
        }
    }
    
    // Getters and Setters
    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { 
        this.timestamp = timestamp; 
        this.formattedTime = formatDateTime(timestamp);
    }
    
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
    
    public String getFormattedTime() { return formattedTime; }
    public void setFormattedTime(String formattedTime) { this.formattedTime = formattedTime; }
}