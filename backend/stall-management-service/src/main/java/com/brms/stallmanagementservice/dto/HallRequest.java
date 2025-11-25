package com.brms.stallmanagementservice.dto;

import com.brms.stallmanagementservice.enums.HallStatus;

public record HallRequest(
        String name,
        String code,
        HallStatus status,
        String mapImageUrl
) {}
