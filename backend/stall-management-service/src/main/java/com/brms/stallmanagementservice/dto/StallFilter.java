package com.brms.stallmanagementservice.dto;

import com.brms.stallmanagementservice.enums.StallSize;
import com.brms.stallmanagementservice.enums.StallStatus;

import java.math.BigDecimal;

public record StallFilter(
        Long hallId,
        String hallCode,
        StallSize size,
        StallStatus status,
        String codeLike,
        BigDecimal minArea,
        BigDecimal maxArea
) {}
