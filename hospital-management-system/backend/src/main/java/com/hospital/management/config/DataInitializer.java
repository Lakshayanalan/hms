package com.hospital.management.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hospital.management.entity.Role;
import com.hospital.management.entity.Service;
import com.hospital.management.entity.ServiceCategory;
import com.hospital.management.entity.User;
import com.hospital.management.repository.ServiceRepository;
import com.hospital.management.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeDefaultUsers();
        initializeDefaultServices();
    }

    private void initializeDefaultUsers() {
        // Check if demo users already exist
        boolean adminExists = userRepository.findByUsername("admin").isPresent();
        boolean doctorExists = userRepository.findByUsername("doctor").isPresent();
        boolean patientExists = userRepository.findByUsername("patient").isPresent();
        boolean nurseExists = userRepository.findByUsername("nurse").isPresent();
        boolean receptionistExists = userRepository.findByUsername("receptionist").isPresent();
        boolean itOfficerExists = userRepository.findByUsername("it_officer").isPresent();
        
        // Always update admin password on startup for password reset
        if (adminExists) {
            System.out.println("Updating admin user password...");
            User admin = userRepository.findByUsername("admin").get();
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            userRepository.save(admin);
            System.out.println("=== ADMIN PASSWORD RESET ===");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("============================");
        }
        
        if (adminExists && doctorExists && patientExists && nurseExists && receptionistExists && itOfficerExists) {
            System.out.println("All default demo users already exist.");
            return;
        }
        
        if (!adminExists) {
            System.out.println("Initializing admin user...");

            // Create admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@hospital.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(Role.HOSPITAL_MANAGER);
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setPhone("+1234567890");
            admin.setIsActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            userRepository.save(admin);

            System.out.println("=== ADMIN USER CREATED SUCCESSFULLY ===");
            System.out.println("Username: admin");
            System.out.println("Password: admin123");
            System.out.println("Role: HOSPITAL_MANAGER");
            System.out.println("Email: admin@hospital.com");
            System.out.println("=====================================");
        }

        if (!doctorExists) {
            System.out.println("Initializing doctor user...");

            // Create doctor user
            User doctor = new User();
            doctor.setUsername("doctor");
            doctor.setEmail("doctor@hospital.com");
            doctor.setPasswordHash(passwordEncoder.encode("doctor123"));
            doctor.setRole(Role.DOCTOR);
            doctor.setFirstName("Dr. John");
            doctor.setLastName("Smith");
            doctor.setPhone("+1234567891");
            doctor.setIsActive(true);
            doctor.setCreatedAt(LocalDateTime.now());
            doctor.setUpdatedAt(LocalDateTime.now());
            userRepository.save(doctor);

            System.out.println("=== DOCTOR USER CREATED SUCCESSFULLY ===");
            System.out.println("Username: doctor");
            System.out.println("Password: doctor123");
            System.out.println("Role: DOCTOR");
            System.out.println("Email: doctor@hospital.com");
            System.out.println("=====================================");
        }

        if (!patientExists) {
            System.out.println("Initializing patient user...");

            // Create patient user
            User patient = new User();
            patient.setUsername("patient");
            patient.setEmail("patient@hospital.com");
            patient.setPasswordHash(passwordEncoder.encode("patient123"));
            patient.setRole(Role.PATIENT);
            patient.setFirstName("John");
            patient.setLastName("Patient");
            patient.setPhone("+1234567892");
            patient.setIsActive(true);
            patient.setCreatedAt(LocalDateTime.now());
            patient.setUpdatedAt(LocalDateTime.now());
            userRepository.save(patient);

            System.out.println("=== PATIENT USER CREATED SUCCESSFULLY ===");
            System.out.println("Username: patient");
            System.out.println("Password: patient123");
            System.out.println("Role: PATIENT");
            System.out.println("Email: patient@hospital.com");
            System.out.println("=====================================");
        }

        if (!nurseExists) {
            System.out.println("Initializing nurse user...");

            // Create nurse user
            User nurse = new User();
            nurse.setUsername("nurse");
            nurse.setEmail("nurse@hospital.com");
            nurse.setPasswordHash(passwordEncoder.encode("nurse123"));
            nurse.setRole(Role.NURSE);
            nurse.setFirstName("Mary");
            nurse.setLastName("Johnson");
            nurse.setPhone("+1234567893");
            nurse.setIsActive(true);
            nurse.setCreatedAt(LocalDateTime.now());
            nurse.setUpdatedAt(LocalDateTime.now());
            userRepository.save(nurse);

            System.out.println("=== NURSE USER CREATED SUCCESSFULLY ===");
            System.out.println("Username: nurse");
            System.out.println("Password: nurse123");
            System.out.println("Role: NURSE");
            System.out.println("Email: nurse@hospital.com");
            System.out.println("=====================================");
        }

        if (!receptionistExists) {
            System.out.println("Initializing receptionist user...");

            // Create receptionist user
            User receptionist = new User();
            receptionist.setUsername("receptionist");
            receptionist.setEmail("receptionist@hospital.com");
            receptionist.setPasswordHash(passwordEncoder.encode("receptionist123"));
            receptionist.setRole(Role.RECEPTIONIST);
            receptionist.setFirstName("Sarah");
            receptionist.setLastName("Williams");
            receptionist.setPhone("+1234567894");
            receptionist.setIsActive(true);
            receptionist.setCreatedAt(LocalDateTime.now());
            receptionist.setUpdatedAt(LocalDateTime.now());
            userRepository.save(receptionist);

            System.out.println("=== RECEPTIONIST USER CREATED SUCCESSFULLY ===");
            System.out.println("Username: receptionist");
            System.out.println("Password: receptionist123");
            System.out.println("Role: RECEPTIONIST");
            System.out.println("Email: receptionist@hospital.com");
            System.out.println("=====================================");
        }

        if (!itOfficerExists) {
            System.out.println("Initializing IT officer user...");

            // Create IT officer user
            User itOfficer = new User();
            itOfficer.setUsername("it_officer");
            itOfficer.setEmail("it@hospital.com");
            itOfficer.setPasswordHash(passwordEncoder.encode("it123"));
            itOfficer.setRole(Role.IT_OFFICER);
            itOfficer.setFirstName("David");
            itOfficer.setLastName("Brown");
            itOfficer.setPhone("+1234567895");
            itOfficer.setIsActive(true);
            itOfficer.setCreatedAt(LocalDateTime.now());
            itOfficer.setUpdatedAt(LocalDateTime.now());
            userRepository.save(itOfficer);

            System.out.println("=== IT OFFICER USER CREATED SUCCESSFULLY ===");
            System.out.println("Username: it_officer");
            System.out.println("Password: it123");
            System.out.println("Role: IT_OFFICER");
            System.out.println("Email: it@hospital.com");
            System.out.println("=====================================");
        }

        System.out.println("\n=== ALL DEMO CREDENTIALS ===");
        System.out.println("Admin: admin / admin123");
        System.out.println("Doctor: doctor / doctor123");
        System.out.println("Patient: patient / patient123");
        System.out.println("Nurse: nurse / nurse123");
        System.out.println("Receptionist: receptionist / receptionist123");
        System.out.println("IT Officer: it_officer / it123");
        System.out.println("============================\n");
    }

    private void initializeDefaultServices() {
        // Check if services already exist
        if (serviceRepository.count() > 0) {
            System.out.println("Services already exist, skipping initialization.");
            return;
        }

        System.out.println("Initializing default services...");

        // Create default services
        Service[] defaultServices = {
            new Service("Consultation", "CONS001", ServiceCategory.CONSULTATION, 
                       new BigDecimal("150.00"), "General medical consultation"),
            new Service("X-Ray", "XRAY001", ServiceCategory.RADIOLOGY, 
                       new BigDecimal("200.00"), "X-Ray imaging service"),
            new Service("Blood Test", "BLOOD001", ServiceCategory.LABORATORY, 
                       new BigDecimal("80.00"), "Complete blood count test"),
            new Service("MRI Scan", "MRI001", ServiceCategory.RADIOLOGY, 
                       new BigDecimal("800.00"), "Magnetic resonance imaging"),
            new Service("Surgery - Minor", "SURG001", ServiceCategory.SURGERY, 
                       new BigDecimal("2500.00"), "Minor surgical procedure"),
            new Service("Surgery - Major", "SURG002", ServiceCategory.SURGERY, 
                       new BigDecimal("8000.00"), "Major surgical procedure"),
            new Service("Physical Therapy", "PT001", ServiceCategory.THERAPY, 
                       new BigDecimal("120.00"), "Physical therapy session"),
            new Service("Emergency Room Visit", "ER001", ServiceCategory.EMERGENCY, 
                       new BigDecimal("500.00"), "Emergency room consultation"),
            new Service("Ultrasound", "US001", ServiceCategory.RADIOLOGY, 
                       new BigDecimal("300.00"), "Ultrasound imaging"),
            new Service("ECG", "ECG001", ServiceCategory.DIAGNOSTIC, 
                       new BigDecimal("100.00"), "Electrocardiogram test")
        };

        for (Service service : defaultServices) {
            service.setIsActive(true);
            service.setIsTaxable(true);
            service.setTaxRate(new BigDecimal("8.00")); // 8% tax
            service.setUnit("Each");
            serviceRepository.save(service);
        }

        System.out.println("=== DEFAULT SERVICES CREATED SUCCESSFULLY ===");
        System.out.println("Total services created: " + defaultServices.length);
        System.out.println("Services include: Consultation, X-Ray, Blood Test, MRI, Surgery, etc.");
        System.out.println("===============================================");
    }


}