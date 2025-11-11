package com.brms.iamservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank(message = "Name is required")
    private String name;

    private String businessName;

    @NotBlank(message = "Phone number is required")
    private String phone;
}

