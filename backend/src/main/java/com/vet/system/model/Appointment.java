package com.vet.system.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "pet_id")
    private Pet pet;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id")
    private VetService service;
    
    private LocalDateTime dateTime;
    
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    @JsonManagedReference
    @OneToMany(mappedBy = "appointment", cascade = CascadeType.ALL)
    private List<MedicalHistory> medicalHistories;
}