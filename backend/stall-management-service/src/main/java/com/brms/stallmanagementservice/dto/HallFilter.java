package com.brms.stallmanagementservice.dto;

import com.brms.stallmanagementservice.enums.HallStatus;

public record HallFilter(
        String code,          // exact match (e.g., "A")
        HallStatus status,    // ACTIVE/INACTIVE
        String nameLike       // partial match on name
) {}
