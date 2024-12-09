package com.vet.system.controller;

import com.vet.system.model.Owner;
import com.vet.system.service.OwnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.vet.system.security.services.UserDetailsImpl;
import com.vet.system.model.User;
import com.vet.system.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import com.vet.system.dto.OwnerDTO;
@RestController
@RequestMapping("/api/owners")
public class OwnerController {
    private final OwnerService ownerService;
    private final UserRepository userRepository;
    public OwnerController(OwnerService ownerService, UserRepository userRepository) {
        this.ownerService = ownerService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<OwnerDTO> getAllOwners(@AuthenticationPrincipal UserDetailsImpl currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ownerService.getAllOwners(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private OwnerDTO convertToDTO(Owner owner) {
        OwnerDTO dto = new OwnerDTO();
        dto.setId(owner.getId());
        dto.setFirstName(owner.getFirstName());
        dto.setLastName(owner.getLastName());
        dto.setEmail(owner.getEmail());
        dto.setPhoneNumber(owner.getPhoneNumber());
        dto.setAddress(owner.getAddress());
        
        if (owner.getPets() != null) {
            dto.setPets(owner.getPets().stream()
                    .map(pet -> {
                        OwnerDTO.PetDTO petDTO = new OwnerDTO.PetDTO();
                        petDTO.setId(pet.getId());
                        petDTO.setName(pet.getName());
                        petDTO.setSpecies(pet.getSpecies());
                        petDTO.setBreed(pet.getBreed());
                        petDTO.setAge(pet.getAge());
                        return petDTO;
                    })
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Owner> getOwnerById(@PathVariable Long id) {
        return ownerService.getOwnerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Owner createOwner(@RequestBody Owner owner) {
        return ownerService.createOwner(owner);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Owner> updateOwner(@PathVariable Long id, @RequestBody Owner ownerDetails) {
        try {
            Owner updatedOwner = ownerService.updateOwner(id, ownerDetails);
            return ResponseEntity.ok(updatedOwner);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOwner(@PathVariable Long id) {
        ownerService.deleteOwner(id);
        return ResponseEntity.ok().build();
    }
} 