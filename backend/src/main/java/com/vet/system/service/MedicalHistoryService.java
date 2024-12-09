package com.vet.system.service;

import com.vet.system.model.MedicalHistory;
import com.vet.system.repository.MedicalHistoryRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MedicalHistoryService {
    private final MedicalHistoryRepository medicalHistoryRepository;

    public MedicalHistoryService(MedicalHistoryRepository medicalHistoryRepository) {
        this.medicalHistoryRepository = medicalHistoryRepository;
    }

    public List<MedicalHistory> getAllMedicalHistories() {
        return medicalHistoryRepository.findAll();
    }

    public Optional<MedicalHistory> getMedicalHistoryById(Long id) {
        return medicalHistoryRepository.findById(id);
    }

    public List<MedicalHistory> getMedicalHistoriesByPetId(Long petId) {
        return medicalHistoryRepository.findByPetId(petId);
    }

    public MedicalHistory addMedicalHistory(MedicalHistory medicalHistory) {
        return medicalHistoryRepository.save(medicalHistory);
    }

    public MedicalHistory updateMedicalHistory(Long id, MedicalHistory medicalHistoryDetails) {
        MedicalHistory medicalHistory = medicalHistoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Medical History not found with id: " + id));
        
        medicalHistory.setCondition(medicalHistoryDetails.getCondition());
        medicalHistory.setTreatment(medicalHistoryDetails.getTreatment());
        medicalHistory.setDate(medicalHistoryDetails.getDate());
        medicalHistory.setNotes(medicalHistoryDetails.getNotes());
        
        return medicalHistoryRepository.save(medicalHistory);
    }

    public void deleteMedicalHistory(Long id) {
        medicalHistoryRepository.deleteById(id);
    }
} 