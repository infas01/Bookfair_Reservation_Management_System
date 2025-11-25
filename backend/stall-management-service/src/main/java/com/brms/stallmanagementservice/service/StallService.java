package com.brms.stallmanagementservice.service;

import com.brms.stallmanagementservice.dto.StallFilter;
import com.brms.stallmanagementservice.dto.StallRequest;
import com.brms.stallmanagementservice.dto.StallResponse;
import com.brms.stallmanagementservice.enums.StallStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StallService {

    StallResponse create(StallRequest req);

    StallResponse update(Long id, StallRequest req);

    StallResponse get(Long id);

    void delete(Long id);

    Page<StallResponse> search(StallFilter filter, Pageable pageable);

    StallResponse changeStatus(Long id, StallStatus newStatus, String reason, String changedBy);
}
