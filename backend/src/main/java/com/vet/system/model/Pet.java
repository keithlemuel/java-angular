package com.vet.system.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "pets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String species;
    private String breed;
    private Integer age;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    @JsonIgnoreProperties("pets")
    private Owner owner;
    
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("pet")
    private List<MedicalHistory> medicalHistories;
    
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("pet")
    private List<Vaccination> vaccinations;
    
    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("pet")
    private List<Appointment> appointments;
}