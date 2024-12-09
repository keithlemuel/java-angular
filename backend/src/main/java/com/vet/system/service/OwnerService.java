package com.vet.system.service;

import com.vet.system.model.Owner;
import com.vet.system.model.User;
import com.vet.system.repository.OwnerRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Collections;
import com.vet.system.model.Role;

@Service
public class OwnerService {
    private final OwnerRepository ownerRepository;

    public OwnerService(OwnerRepository ownerRepository) {
        this.ownerRepository = ownerRepository;
    }

    public List<Owner> getAllOwners() {
        return ownerRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
    }

    public Optional<Owner> getOwnerById(Long id) {
        return ownerRepository.findById(id);
    }

    public Owner createOwner(Owner owner) {
        return ownerRepository.save(owner);
    }

    public Owner updateOwner(Long id, Owner ownerDetails) {
        Owner owner = ownerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Owner not found with id: " + id));
        
        owner.setFirstName(ownerDetails.getFirstName());
        owner.setLastName(ownerDetails.getLastName());
        owner.setPhoneNumber(ownerDetails.getPhoneNumber());
        owner.setAddress(ownerDetails.getAddress());
        owner.setEmail(ownerDetails.getEmail());
        
        return ownerRepository.save(owner);
    }

    public void deleteOwner(Long id) {
        ownerRepository.deleteById(id);
    }

    public Optional<Owner> getOwnerByUserId(Long userId) {
        return ownerRepository.findByUser_Id(userId);
    }

    public List<Owner> getAllOwners(User currentUser) {
        if (currentUser.getRoles().stream()
                .anyMatch(role -> role.getName() == Role.RoleType.ROLE_VET)) {
            return ownerRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));
        } else {
            return Collections.singletonList(currentUser.getOwner());
        }
    }
} 