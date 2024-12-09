package com.vet.system.service;

import com.vet.system.model.Pet;
import com.vet.system.model.User;
import com.vet.system.model.Role;
import com.vet.system.repository.PetRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PetService {
    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public List<Pet> getAllPets(User currentUser) {
        if (currentUser.getRoles().stream()
                .anyMatch(role -> role.getName() == Role.RoleType.ROLE_VET)) {
            return petRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        } else {
            return petRepository.findByOwnerId(currentUser.getOwner().getId());
        }
    }

    public Optional<Pet> getPetById(Long id, User currentUser) {
        Optional<Pet> pet = petRepository.findById(id);
        if (pet.isPresent()) {
            if (currentUser.getRoles().stream()
                    .anyMatch(role -> role.getName() == Role.RoleType.ROLE_VET) ||
                pet.get().getOwner().getId().equals(currentUser.getOwner().getId())) {
                return pet;
            }
        }
        return Optional.empty();
    }

    public Pet createPet(Pet pet, User currentUser) {
        if (currentUser.getRoles().stream()
                .noneMatch(role -> role.getName() == Role.RoleType.ROLE_VET)) {
            pet.setOwner(currentUser.getOwner());
        }
        return petRepository.save(pet);
    }

    public Pet updatePet(Long id, Pet petDetails, User currentUser) {
        Pet pet = petRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pet not found with id: " + id));
        
        if (currentUser.getRoles().stream()
                .noneMatch(role -> role.getName() == Role.RoleType.ROLE_VET) &&
                !pet.getOwner().getId().equals(currentUser.getOwner().getId())) {
            throw new RuntimeException("Not authorized to update this pet");
        }

        pet.setName(petDetails.getName());
        pet.setSpecies(petDetails.getSpecies());
        pet.setBreed(petDetails.getBreed());
        pet.setAge(petDetails.getAge());

        // Add this condition to update owner only if the current user is a vet
        if (currentUser.getRoles().stream()
                .anyMatch(role -> role.getName() == Role.RoleType.ROLE_VET) &&
                petDetails.getOwner() != null) {
            pet.setOwner(petDetails.getOwner());
        }
        
        return petRepository.save(pet);
    }

    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }
} 