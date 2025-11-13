package com.brms.stallmanagementservice.repository;

import com.brms.stallmanagementservice.entity.Hall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface HallRepository extends JpaRepository<Hall, Long>, JpaSpecificationExecutor<Hall> {
    Optional<Hall> findByCode(String code);
}
