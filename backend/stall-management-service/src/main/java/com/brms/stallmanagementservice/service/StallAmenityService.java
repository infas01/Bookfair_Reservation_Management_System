package com.brms.stallmanagementservice.service;

import com.brms.stallmanagementservice.dto.StallAmenityFilter;
import com.brms.stallmanagementservice.dto.StallAmenityRequest;
import com.brms.stallmanagementservice.dto.StallAmenityResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StallAmenityService {

    StallAmenityResponse create(StallAmenityRequest req);

    StallAmenityResponse update(Long id, StallAmenityRequest req);

    StallAmenityResponse get(Long id);

    void delete(Long id);

    Page<StallAmenityResponse> search(StallAmenityFilter filter, Pageable pageable);
}
