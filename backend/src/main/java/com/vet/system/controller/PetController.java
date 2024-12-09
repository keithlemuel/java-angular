package com.vet.system.controller;

import com.vet.system.model.Pet;
import com.vet.system.service.PetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.vet.system.security.services.UserDetailsImpl;
import com.vet.system.model.User;
import com.vet.system.repository.UserRepository;

import java.util.List;

@RestController
@RequestMapping("/api/pets")
public class PetController {
    private final PetService petService;
    private final UserRepository userRepository;

    public PetController(PetService petService, UserRepository userRepository) {
        this.petService = petService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Pet> getAllPets(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return petService.getAllPets(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pet> getPetById(@PathVariable Long id, 
                                        @AuthenticationPrincipal UserDetailsImpl currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return petService.getPetById(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pet createPet(@RequestBody Pet pet, 
                        @AuthenticationPrincipal UserDetailsImpl currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return petService.createPet(pet, user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pet> updatePet(
            @PathVariable Long id, 
            @RequestBody Pet petDetails,
            @AuthenticationPrincipal UserDetailsImpl currentUser) {
        try {
            User user = userRepository.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Pet updatedPet = petService.updatePet(id, petDetails, user);
            return ResponseEntity.ok(updatedPet);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.ok().build();
    }
} 