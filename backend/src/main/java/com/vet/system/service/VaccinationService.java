package com.vet.system.service;

import com.vet.system.model.Vaccination;
import com.vet.system.model.VaccinationStatus;
import com.vet.system.repository.VaccinationRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class VaccinationService {
    private final VaccinationRepository vaccinationRepository;

    public VaccinationService(VaccinationRepository vaccinationRepository) {
        this.vaccinationRepository = vaccinationRepository;
    }

    public List<Vaccination> getAllVaccinations() {
        return vaccinationRepository.findAll();
    }

    public Optional<Vaccination> getVaccinationById(Long id) {
        return vaccinationRepository.findById(id);
    }

    public List<Vaccination> getVaccinationsByPetId(Long petId) {
        return vaccinationRepository.findByPetId(petId);
    }

    public List<Vaccination> getDueVaccinations(LocalDate date) {
        return vaccinationRepository.findByNextDueDateBefore(date);
    }

    public Vaccination addVaccination(Vaccination vaccination) {
        // Calculate status based on dates
        LocalDate now = LocalDate.now();
        if (vaccination.getDateAdministered() != null) {
            vaccination.setStatus(VaccinationStatus.COMPLETED);
        } else if (vaccination.getNextDueDate().isBefore(now)) {
            vaccination.setStatus(VaccinationStatus.OVERDUE);
        } else {
            vaccination.setStatus(VaccinationStatus.UPCOMING);
        }
        return vaccinationRepository.save(vaccination);
    }

    public Vaccination updateVaccination(Long id, Vaccination vaccinationDetails) {
        Vaccination vaccination = vaccinationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vaccination not found with id: " + id));
        
        vaccination.setName(vaccinationDetails.getName());
        vaccination.setDateAdministered(vaccinationDetails.getDateAdministered());
        vaccination.setNextDueDate(vaccinationDetails.getNextDueDate());
        
        return vaccinationRepository.save(vaccination);
    }

    public void deleteVaccination(Long id) {
        vaccinationRepository.deleteById(id);
    }
} 