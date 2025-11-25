package com.brms.stallmanagementservice.dto;

import com.brms.stallmanagementservice.enums.StallSize;
import com.brms.stallmanagementservice.enums.StallStatus;

import java.math.BigDecimal;
import java.util.Set;

public record StallRequest(
        Long hallId,
        String code,
        StallSize size,
        StallStatus status,
        BigDecimal widthMeters,
        BigDecimal depthMeters,
        BigDecimal areaSqM,
        BigDecimal basePrice,
        Integer mapX, Integer mapY, Integer mapWidth, Integer mapHeight,
        Set<Long> amenityIds
) {}
