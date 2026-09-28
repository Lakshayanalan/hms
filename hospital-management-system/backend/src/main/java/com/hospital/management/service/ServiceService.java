package com.hospital.management.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.management.entity.ServiceCategory;
import com.hospital.management.repository.ServiceRepository;

@Service
@Transactional
public class ServiceService {
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    // Create service
    public com.hospital.management.entity.Service createService(String serviceName, String serviceCode,
                                                               ServiceCategory category, BigDecimal basePrice,
                                                               String description) {
        com.hospital.management.entity.Service service = new com.hospital.management.entity.Service();
        service.setServiceName(serviceName);
        service.setServiceCode(serviceCode);
        service.setCategory(category);
        service.setBasePrice(basePrice);
        service.setDescription(description);
        service.setIsActive(true);
        
        return serviceRepository.save(service);
    }
    
    // Get services
    public List<com.hospital.management.entity.Service> getAllActiveServices() {
        return serviceRepository.findByIsActiveTrue();
    }
    
    public Optional<com.hospital.management.entity.Service> findById(Long serviceId) {
        return serviceRepository.findById(serviceId);
    }
    
    public Optional<com.hospital.management.entity.Service> findByServiceCode(String serviceCode) {
        return serviceRepository.findByServiceCode(serviceCode);
    }
    
    public Optional<com.hospital.management.entity.Service> findByServiceName(String serviceName) {
        return serviceRepository.findByServiceName(serviceName);
    }
    
    public List<com.hospital.management.entity.Service> getServicesByCategory(ServiceCategory category) {
        return serviceRepository.findByCategoryAndIsActiveTrue(category);
    }
    
    public Page<com.hospital.management.entity.Service> searchServices(String searchTerm, Pageable pageable) {
        return serviceRepository.searchActiveServices(searchTerm, pageable);
    }
    
    public List<com.hospital.management.entity.Service> getServicesByPriceRange(Double minPrice, Double maxPrice) {
        return serviceRepository.findByPriceRange(minPrice, maxPrice);
    }
    
    // Update service
    public com.hospital.management.entity.Service updateService(Long serviceId, String serviceName,
                                                               String description, BigDecimal basePrice) {
        Optional<com.hospital.management.entity.Service> optionalService = serviceRepository.findById(serviceId);
        if (optionalService.isPresent()) {
            com.hospital.management.entity.Service service = optionalService.get();
            if (serviceName != null) service.setServiceName(serviceName);
            if (description != null) service.setDescription(description);
            if (basePrice != null) service.setBasePrice(basePrice);
            
            return serviceRepository.save(service);
        }
        throw new RuntimeException("Service not found with ID: " + serviceId);
    }
    
    // Deactivate service
    public void deactivateService(Long serviceId) {
        Optional<com.hospital.management.entity.Service> optionalService = serviceRepository.findById(serviceId);
        if (optionalService.isPresent()) {
            com.hospital.management.entity.Service service = optionalService.get();
            service.setIsActive(false);
            serviceRepository.save(service);
        } else {
            throw new RuntimeException("Service not found with ID: " + serviceId);
        }
    }
}