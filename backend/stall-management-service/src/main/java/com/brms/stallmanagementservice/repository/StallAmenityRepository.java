package com.brms.stallmanagementservice.repository;

import com.brms.stallmanagementservice.entity.StallAmenity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.Set;

public interface StallAmenityRepository extends JpaRepository<StallAmenity, Long> {
    Set<StallAmenity> findByIdIn(Collection<Long> ids);
}
