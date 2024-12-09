package com.vet.system.repository;

import com.vet.system.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OwnerRepository extends JpaRepository<Owner, Long> {
    // Custom query methods can be added here
    Optional<Owner> findByUser_Id(Long userId);
} 