package com.brms.stallmanagementservice.repository;

import com.brms.stallmanagementservice.entity.Hall;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HallRepository extends JpaRepository<Hall, Long> {
    Optional<Hall> findByCode(String code);
}
