package com.vet.system.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "vaccinations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vaccination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private LocalDate dateAdministered;
    private LocalDate nextDueDate;
    
    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;
} 