package com.vet.system.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "owners")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Owner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
    private String email;
    
    @JsonManagedReference
    @OneToOne(mappedBy = "owner")
    @JsonIgnore
    private User user;
    
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("owner")
    private List<Pet> pets;
}