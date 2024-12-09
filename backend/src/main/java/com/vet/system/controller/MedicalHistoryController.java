package com.vet.system.controller;

import com.vet.system.model.MedicalHistory;
import com.vet.system.service.MedicalHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-histories")
public class MedicalHistoryController {
    private final MedicalHistoryService medicalHistoryService;

    public MedicalHistoryController(MedicalHistoryService medicalHistoryService) {
        this.medicalHistoryService = medicalHistoryService;
    }

    @GetMapping
    public List<MedicalHistory> getAllMedicalHistories() {
        return medicalHistoryService.getAllMedicalHistories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalHistory> getMedicalHistoryById(@PathVariable Long id) {
        return medicalHistoryService.getMedicalHistoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/pet/{petId}")
    public List<MedicalHistory> getMedicalHistoriesByPetId(@PathVariable Long petId) {
        return medicalHistoryService.getMedicalHistoriesByPetId(petId);
    }

    @PostMapping
    public MedicalHistory addMedicalHistory(@RequestBody MedicalHistory medicalHistory) {
        return medicalHistoryService.addMedicalHistory(medicalHistory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalHistory> updateMedicalHistory(@PathVariable Long id, @RequestBody MedicalHistory medicalHistoryDetails) {
        try {
            MedicalHistory updatedHistory = medicalHistoryService.updateMedicalHistory(id, medicalHistoryDetails);
            return ResponseEntity.ok(updatedHistory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalHistory(@PathVariable Long id) {
        medicalHistoryService.deleteMedicalHistory(id);
        return ResponseEntity.ok().build();
    }
} 