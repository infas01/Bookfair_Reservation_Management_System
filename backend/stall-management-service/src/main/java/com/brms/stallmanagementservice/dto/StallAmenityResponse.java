package com.brms.stallmanagementservice.dto;

import java.time.Instant;

public record StallAmenityResponse(
        Long id,
        String name,
        Instant createdAt,
        Instant updatedAt
) {}
