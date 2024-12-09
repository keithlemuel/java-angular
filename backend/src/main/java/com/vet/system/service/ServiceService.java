package com.vet.system.service;

import com.vet.system.model.VetService;
import com.vet.system.repository.VetServiceRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ServiceService {
    private final VetServiceRepository serviceRepository;

    public ServiceService(VetServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<VetService> getAllServices() {
        return serviceRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Optional<VetService> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    public VetService createService(VetService service) {
        return serviceRepository.save(service);
    }

    public VetService updateService(Long id, VetService serviceDetails) {
        VetService service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));
        
        service.setName(serviceDetails.getName());
        service.setDescription(serviceDetails.getDescription());
        service.setDuration(serviceDetails.getDuration());
        service.setPrice(serviceDetails.getPrice());
        service.setIcon(serviceDetails.getIcon());
        service.setIconBg(serviceDetails.getIconBg());
        
        return serviceRepository.save(service);
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
} 