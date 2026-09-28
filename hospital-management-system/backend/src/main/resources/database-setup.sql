-- Hospital Management System Database Setup
-- Run this script to create the database and user

-- Create database
CREATE DATABASE IF NOT EXISTS hospital_management 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create user and grant privileges
CREATE USER IF NOT EXISTS 'hospital_user'@'localhost' IDENTIFIED BY 'hospital_password';
GRANT ALL PRIVILEGES ON hospital_management.* TO 'hospital_user'@'localhost';
FLUSH PRIVILEGES;

-- Use the database
USE hospital_management;

-- Users table for authentication and role management
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('PATIENT', 'RECEPTIONIST', 'DOCTOR', 'NURSE', 'IT_OFFICER', 'HOSPITAL_MANAGER') NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    patient_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    patient_number VARCHAR(20) UNIQUE NOT NULL,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(15),
    blood_type VARCHAR(5),
    allergies TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_patient_number (patient_number),
    INDEX idx_user_id (user_id)
);

-- Appointments table (Enhanced for Sprint 3)
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date_time DATETIME NOT NULL,
    duration_minutes INT DEFAULT 30,
    appointment_type ENUM('CONSULTATION', 'FOLLOW_UP', 'CHECKUP', 'EMERGENCY', 'VACCINATION', 'SURGERY', 'THERAPY', 'DIAGNOSTIC') DEFAULT 'CONSULTATION',
    status ENUM('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'SCHEDULED',
    reason TEXT,
    notes TEXT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_appointment_datetime (appointment_date_time),
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_status (status),
    INDEX idx_appointment_type (appointment_type)
);

-- Medical Records table (Enhanced for Sprint 3)
CREATE TABLE IF NOT EXISTS medical_records (
    record_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_id BIGINT,
    title VARCHAR(200) NOT NULL,
    chief_complaint TEXT,
    history_present_illness TEXT,
    physical_examination TEXT,
    vital_signs TEXT,
    diagnosis TEXT,
    treatment_plan TEXT,
    medications TEXT,
    lab_results TEXT,
    notes TEXT,
    follow_up_instructions TEXT,
    record_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_doctor_id (doctor_id),
    INDEX idx_appointment_id (appointment_id),
    INDEX idx_record_date (record_date),
    INDEX idx_title (title)
);

-- Invoices table (Enhanced billing system)
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(20) UNIQUE NOT NULL,
    patient_id BIGINT NOT NULL,
    appointment_id BIGINT,
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'PARTIAL', 'REFUNDED', 'CANCELLED', 'OVERDUE') DEFAULT 'PENDING',
    description TEXT,
    notes TEXT,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_appointment_id (appointment_id),
    INDEX idx_invoice_number (invoice_number),
    INDEX idx_invoice_date (invoice_date),
    INDEX idx_due_date (due_date),
    INDEX idx_payment_status (payment_status),
    INDEX idx_created_at (created_at)
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    payment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'BANK_TRANSFER', 'CHECK', 'INSURANCE', 'ONLINE') NOT NULL,
    payment_date DATETIME NOT NULL,
    reference_number VARCHAR(100),
    notes TEXT,
    processed_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    FOREIGN KEY (processed_by) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_invoice_id (invoice_id),
    INDEX idx_payment_number (payment_number),
    INDEX idx_payment_date (payment_date),
    INDEX idx_payment_method (payment_method),
    INDEX idx_created_at (created_at)
);

-- This file contains only the database schema definitions
-- No default data will be inserted here as the application will handle admin user creation

SELECT 'Database setup completed successfully!' as message;