package com.hospital.management.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.management.entity.Service;
import com.hospital.management.entity.ServiceCategory;
import com.hospital.management.repository.ServiceRepository;

@RestController
@RequestMapping("/services")
@CrossOrigin(origins = "http://localhost:3000")
public class ServiceController {

    @Autowired
    private ServiceRepository serviceRepository;



    @GetMapping
    public ResponseEntity<Page<Service>> getAllServices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "serviceName") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") 
            ? Sort.by(sortBy).descending() 
            : Sort.by(sortBy).ascending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> services = serviceRepository.findAll(pageable);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Service>> getActiveServices() {
        List<Service> activeServices = serviceRepository.findByIsActiveTrue();
        return ResponseEntity.ok(activeServices);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Service>> getServicesByCategory(@PathVariable ServiceCategory category) {
        List<Service> services = serviceRepository.findByCategoryAndIsActiveTrue(category);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        Optional<Service> service = serviceRepository.findById(id);
        return service.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL_MANAGER')")
    public ResponseEntity<Service> createService(@RequestBody Service service) {
        service.setCreatedAt(LocalDateTime.now());
        service.setUpdatedAt(LocalDateTime.now());
        Service savedService = serviceRepository.save(service);
        return ResponseEntity.ok(savedService);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL_MANAGER')")
    public ResponseEntity<Service> updateService(@PathVariable Long id, @RequestBody Service serviceDetails) {
        Optional<Service> optionalService = serviceRepository.findById(id);
        if (!optionalService.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Service service = optionalService.get();
        service.setServiceName(serviceDetails.getServiceName());
        service.setDescription(serviceDetails.getDescription());
        service.setCategory(serviceDetails.getCategory());
        service.setBasePrice(serviceDetails.getBasePrice());
        service.setInsurancePrice(serviceDetails.getInsurancePrice());
        service.setTaxRate(serviceDetails.getTaxRate());
        service.setIsActive(serviceDetails.getIsActive());
        service.setUpdatedAt(LocalDateTime.now());

        Service updatedService = serviceRepository.save(service);
        return ResponseEntity.ok(updatedService);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HOSPITAL_MANAGER')")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        Optional<Service> service = serviceRepository.findById(id);
        if (!service.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Soft delete - mark as inactive instead of deleting
        Service serviceToUpdate = service.get();
        serviceToUpdate.setIsActive(false);
        serviceToUpdate.setUpdatedAt(LocalDateTime.now());
        serviceRepository.save(serviceToUpdate);

        return ResponseEntity.noContent().build();
    }
}