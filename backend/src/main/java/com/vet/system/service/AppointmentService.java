package com.vet.system.service;

import com.vet.system.model.Appointment;
import com.vet.system.model.User;
import com.vet.system.model.Role;
import com.vet.system.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
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
} 