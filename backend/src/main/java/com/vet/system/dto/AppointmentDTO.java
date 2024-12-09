package com.vet.system.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    private Long id;
    private PetDTO pet;
    private ServiceDTO service;
    private LocalDateTime dateTime;
    private String status;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PetDTO {
        private Long id;
        private String name;
        private String species;
        private String breed;
        private OwnerDTO owner;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OwnerDTO {
        private Long id;
        private String firstName;
        private String lastName;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceDTO {
        private Long id;
        private String name;
        private Integer duration;
        private Double price;
    }
}