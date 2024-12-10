package com.vet.system.repository;

import com.vet.system.model.MedicalHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalHistoryRepository extends JpaRepository<MedicalHistory, Long> {
    List<MedicalHistory> findByPetId(Long petId);
    List<MedicalHistory> findByAppointmentId(Long appointmentId);
    
    // Optional: Add a method to find histories by both pet and appointment
    List<MedicalHistory> findByPetIdAndAppointmentId(Long petId, Long appointmentId);
} 