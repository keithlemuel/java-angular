package com.vet.system.controller;

import com.vet.system.model.VetService;
import com.vet.system.service.ServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class VetServiceController {
    private final ServiceService serviceService;

    public VetServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    @GetMapping
    public List<VetService> getAllServices() {
        return serviceService.getAllServices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VetService> getServiceById(@PathVariable Long id) {
        return serviceService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public VetService createService(@RequestBody VetService service) {
        return serviceService.createService(service);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VetService> updateService(@PathVariable Long id, @RequestBody VetService serviceDetails) {
        try {
            VetService updatedService = serviceService.updateService(id, serviceDetails);
            return ResponseEntity.ok(updatedService);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable Long id) {
        serviceService.deleteService(id);
        return ResponseEntity.ok().build();
    }
} 