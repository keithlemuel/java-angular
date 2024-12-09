package com.vet.system.dto;

import lombok.Data;
import java.util.Set;

@Data
public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private Set<String> roles;
    
    // Add owner details
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String address;
} 