package com.vet.system.controller;

import com.vet.system.model.Vaccination;
import com.vet.system.service.VaccinationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vaccinations")
public class VaccinationController {
    private final VaccinationService vaccinationService;

    public VaccinationController(VaccinationService vaccinationService) {
        this.vaccinationService = vaccinationService;
    }

    @GetMapping
    public List<Vaccination> getAllVaccinations() {
        return vaccinationService.getAllVaccinations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vaccination> getVaccinationById(@PathVariable Long id) {
        return vaccinationService.getVaccinationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pet/{petId}")
    public List<Vaccination> getVaccinationsByPetId(@PathVariable Long petId) {
        return vaccinationService.getVaccinationsByPetId(petId);
    }

    @GetMapping("/due-before")
    public List<Vaccination> getDueVaccinations(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return vaccinationService.getDueVaccinations(date);
    }

    @PostMapping
    public Vaccination addVaccination(@RequestBody Vaccination vaccination) {
        return vaccinationService.addVaccination(vaccination);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vaccination> updateVaccination(@PathVariable Long id, @RequestBody Vaccination vaccinationDetails) {
        try {
            Vaccination updatedVaccination = vaccinationService.updateVaccination(id, vaccinationDetails);
            return ResponseEntity.ok(updatedVaccination);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVaccination(@PathVariable Long id) {
        vaccinationService.deleteVaccination(id);
        return ResponseEntity.ok().build();
    }
} 