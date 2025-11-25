package com.brms.stallmanagementservice.service;

import com.brms.stallmanagementservice.dto.HallFilter;
import com.brms.stallmanagementservice.dto.HallRequest;
import com.brms.stallmanagementservice.dto.HallResponse;
import com.brms.stallmanagementservice.enums.HallStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface HallService {

    HallResponse create(HallRequest req);

    HallResponse update(Long id, HallRequest req);

    HallResponse get(Long id);

    void delete(Long id);

    Page<HallResponse> search(HallFilter filter, Pageable pageable);

    HallResponse changeStatus(Long id, HallStatus newStatus);
}
