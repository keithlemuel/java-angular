package com.vet.system.repository;

import com.vet.system.model.Vaccination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface VaccinationRepository extends JpaRepository<Vaccination, Long> {
    List<Vaccination> findByPetId(Long petId);
    List<Vaccination> findByNextDueDateBefore(LocalDate date);
} 