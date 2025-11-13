package com.brms.stallmanagementservice.dto;

import com.brms.stallmanagementservice.enums.HallStatus;

import java.time.Instant;

public record HallResponse(
        Long id,
        String name,
        String code,
        HallStatus status,
        String mapImageUrl,
        Instant createdAt,
        Instant updatedAt
) {}
