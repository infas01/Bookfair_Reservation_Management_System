package com.brms.stallmanagementservice.repository;

import com.brms.stallmanagementservice.entity.Stall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface StallRepository extends JpaRepository<Stall, Long>, JpaSpecificationExecutor<Stall> {}
