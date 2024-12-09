package com.vet.system.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.vet.system.security.services.UserDetailsImpl;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.vet.system.security.jwt.JwtUtils;
import com.vet.system.model.Role;
import com.vet.system.model.User;
import com.vet.system.repository.RoleRepository;
import com.vet.system.repository.UserRepository;
import com.vet.system.dto.JwtResponse;
import com.vet.system.dto.LoginRequest;
import com.vet.system.dto.SignupRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.GrantedAuthority;
import com.vet.system.model.Owner;
import com.vet.system.service.OwnerService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    private OwnerService ownerService;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        User user = new User(
                signUpRequest.getUsername(),
                signUpRequest.getEmail(),
                encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRoles();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null || strRoles.isEmpty()) {
            Role userRole = roleRepository.findByName(Role.RoleType.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
            
            Owner owner = new Owner();
            owner.setFirstName(signUpRequest.getFirstName());
            owner.setLastName(signUpRequest.getLastName());
            owner.setPhoneNumber(signUpRequest.getPhoneNumber());
            owner.setAddress(signUpRequest.getAddress());
            owner.setEmail(signUpRequest.getEmail());
            
            owner = ownerService.createOwner(owner);
            user.setOwner(owner);
        } else {
            strRoles.forEach(role -> {
                try {
                    Role.RoleType roleType = Role.RoleType.valueOf(role);
                    Role foundRole = roleRepository.findByName(roleType)
                            .orElseThrow(() -> new RuntimeException("Error: Role " + role + " is not found."));
                    roles.add(foundRole);
                } catch (IllegalArgumentException e) {
                    throw new RuntimeException("Error: Role " + role + " is not valid.");
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
} 