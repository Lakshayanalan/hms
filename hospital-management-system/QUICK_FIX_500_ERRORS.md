# Quick Fix: 500 Internal Server Errors

## Problem
The backend is throwing 500 errors for these endpoints:
- `GET /api/users/stats/total`
- `GET /api/patients/stats/total`
- `GET /api/activity/recent`

## Root Cause
The repository methods being called in the controllers don't exist in the repository interfaces.

## Missing Methods

### 1. UserRepository
**Missing:** `findTop5ByOrderByCreatedAtDesc()`

### 2. PatientRepository  
**Missing:** `findTop3ByOrderByCreatedAtDesc()`

### 3. InvoiceRepository
**Missing:** `findTop3ByOrderByCreatedAtDesc()`

### 4. AppointmentRepository
**Missing:** `findTop3ByOrderByCreatedAtDesc()`

## Solution

Add these methods to the respective repository files:

### UserRepository.java
```java
List<User> findTop5ByOrderByCreatedAtDesc();
```

### PatientRepository.java
```java
List<Patient> findTop3ByOrderByCreatedAtDesc();
```

### InvoiceRepository.java
```java
List<Invoice> findTop3ByOrderByCreatedAtDesc();
```

### AppointmentRepository.java
```java
List<Appointment> findTop3ByOrderByCreatedAtDesc();
```

## Files to Edit

1. `/backend/src/main/java/com/hospital/management/repository/UserRepository.java`
2. `/backend/src/main/java/com/hospital/management/repository/PatientRepository.java`
3. `/backend/src/main/java/com/hospital/management/repository/InvoiceRepository.java`
4. `/backend/src/main/java/com/hospital/management/repository/AppointmentRepository.java`

## After Fixing

1. Stop the backend (Ctrl+C)
2. Restart: `mvn spring-boot:run`
3. Refresh the frontend

The errors should be resolved!
