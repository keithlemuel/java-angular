package com.vet.system.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import com.vet.system.model.Role;
import com.vet.system.repository.RoleRepository;
import jakarta.annotation.PostConstruct;

@Configuration
public class RoleInitializer {
    @Autowired
    private RoleRepository roleRepository;

    @PostConstruct
    public void init() {
        if (roleRepository.count() == 0) {
            Role userRole = new Role();
            userRole.setName(Role.RoleType.ROLE_USER);
            roleRepository.save(userRole);

            Role vetRole = new Role();
            vetRole.setName(Role.RoleType.ROLE_VET);
            roleRepository.save(vetRole);
        }
    }
} 