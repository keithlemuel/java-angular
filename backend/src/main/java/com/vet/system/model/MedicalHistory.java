package com.vet.system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "medical_histories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MedicalHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String condition;
    private String treatment;
    private LocalDate date;
    private String notes;
    
    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;
    
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "appointment_id")
    private Appointment appointment;
} 