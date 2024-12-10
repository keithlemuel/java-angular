package com.vet.system.service;

import com.vet.system.model.Appointment;
import com.vet.system.model.MedicalHistory;
import com.vet.system.model.User;
import com.vet.system.model.Role;
import com.vet.system.repository.AppointmentRepository;
import com.vet.system.repository.MedicalHistoryRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final MedicalHistoryRepository medicalHistoryRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            MedicalHistoryRepository medicalHistoryRepository) {
        this.appointmentRepository = appointmentRepository;
        this.medicalHistoryRepository = medicalHistoryRepository;
    }

    public List<Appointment> getAllAppointments(User currentUser) {
        if (currentUser.getRoles().stream()
                .anyMatch(role -> role.getName() == Role.RoleType.ROLE_VET)) {
            return appointmentRepository.findAll();
        } else {
            return appointmentRepository.findByPetOwnerId(currentUser.getOwner().getId());
        }
    }

    public List<Appointment> getAppointmentsByPetId(Long petId, User currentUser) {
        if (currentUser.getRoles().stream()
                .anyMatch(role -> role.getName() == Role.RoleType.ROLE_VET)) {
            return appointmentRepository.findByPetId(petId);
        } else {
            return appointmentRepository.findByPetIdAndPetOwnerId(petId, currentUser.getOwner().getId());
        }
    }

    public List<Appointment> getAppointmentsBetweenDates(LocalDateTime start, LocalDateTime end, User currentUser) {
        List<Appointment> appointments = appointmentRepository.findByDateTimeBetween(start, end);
        if (currentUser.getRoles().stream()
                .anyMatch(role -> role.getName() == Role.RoleType.ROLE_VET)) {
            return appointments;
        } else {
            return appointments.stream()
                    .filter(apt -> apt.getPet().getOwner().getId().equals(currentUser.getOwner().getId()))
                    .collect(Collectors.toList());
        }
    }

    public Appointment scheduleAppointment(Appointment appointment, User currentUser) {
        if (currentUser.getRoles().stream()
                .noneMatch(role -> role.getName() == Role.RoleType.ROLE_VET)) {
            // Verify the pet belongs to the current user
            if (!appointment.getPet().getOwner().getId().equals(currentUser.getOwner().getId())) {
                throw new RuntimeException("Not authorized to schedule appointments for this pet");
            }
        }
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Appointment appointmentDetails, User currentUser) {
        Appointment appointment = appointmentRepository.findById(appointmentDetails.getId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (currentUser.getRoles().stream()
                .noneMatch(role -> role.getName() == Role.RoleType.ROLE_VET)) {
            // Verify the appointment belongs to the current user's pet
            if (!appointment.getPet().getOwner().getId().equals(currentUser.getOwner().getId())) {
                throw new RuntimeException("Not authorized to update this appointment");
            }
        }

        // Only update the necessary fields
        if (appointmentDetails.getPet() != null && appointmentDetails.getPet().getId() != null) {
            appointment.setPet(appointment.getPet()); // Keep existing pet, just verify ID matches
        }
        if (appointmentDetails.getService() != null && appointmentDetails.getService().getId() != null) {
            appointment.setService(appointment.getService()); // Keep existing service, just verify ID matches
        }
        if (appointmentDetails.getDateTime() != null) {
            appointment.setDateTime(appointmentDetails.getDateTime());
        }
        if (appointmentDetails.getStatus() != null) {
            appointment.setStatus(appointmentDetails.getStatus());
        }
        
        return appointmentRepository.save(appointment);
    }

    public MedicalHistory addMedicalHistoryToAppointment(Long appointmentId, MedicalHistory medicalHistory) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + appointmentId));

        // Set the appointment and pet references
        medicalHistory.setAppointment(appointment);
        medicalHistory.setPet(appointment.getPet());

        // If date is not set, use appointment date
        if (medicalHistory.getDate() == null) {
            medicalHistory.setDate(appointment.getDateTime().toLocalDate());
        }

        // Save the medical history
        MedicalHistory savedHistory = medicalHistoryRepository.save(medicalHistory);

        // Update the appointment's medical histories list
        if (appointment.getMedicalHistories() == null) {
            appointment.setMedicalHistories(new ArrayList<>());
        }
        appointment.getMedicalHistories().add(savedHistory);
        appointmentRepository.save(appointment);

        return savedHistory;
    }
} 