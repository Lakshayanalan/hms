package com.hospital.management.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hospital.management.entity.Service;
import com.hospital.management.entity.ServiceCategory;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    
    List<Service> findByIsActiveTrue();
    
    List<Service> findByCategoryAndIsActiveTrue(ServiceCategory category);
    
    Optional<Service> findByServiceCode(String serviceCode);
    
    Optional<Service> findByServiceName(String serviceName);
    
    @Query("SELECT s FROM Service s WHERE " +
           "(LOWER(s.serviceName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.serviceCode) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND s.isActive = true")
    Page<Service> searchActiveServices(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT s FROM Service s WHERE s.category = :category AND s.isActive = true")
    Page<Service> findByCategory(@Param("category") ServiceCategory category, Pageable pageable);
    
    @Query("SELECT s FROM Service s WHERE s.basePrice BETWEEN :minPrice AND :maxPrice AND s.isActive = true")
    List<Service> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
}