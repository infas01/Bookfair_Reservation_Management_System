package com.brms.iamservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class UserListResponse {
    private Long id;
    private String email;
    private String name;
    private String businessName;
    private String phone;
    private String role;
    private LocalDateTime createdAt;
}

