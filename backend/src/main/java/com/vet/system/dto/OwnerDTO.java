package com.vet.system.dto;

import java.util.List;
import lombok.Data;

@Data
public class OwnerDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String address;
    private List<PetDTO> pets;
    
    @Data
    public static class PetDTO {
        private Long id;
        private String name;
        private String species;
        private String breed;
        private Integer age;
    }
} 