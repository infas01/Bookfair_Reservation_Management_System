package com.brms.iamservice.dto;

import lombok.Data;

@Data
public class EmployeeRegisterRequest {
    private String email;
    private String password;
    private String name;
    private String phone;
}
