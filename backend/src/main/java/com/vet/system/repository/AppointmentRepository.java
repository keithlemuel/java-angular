package com.vet.system.repository;

import com.vet.system.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPetId(Long petId);
    List<Appointment> findByDateTimeBetween(LocalDateTime start, LocalDateTime end);
    List<Appointment> findByPetOwnerId(Long ownerId);
    List<Appointment> findByPetIdAndPetOwnerId(Long petId, Long ownerId);
} 