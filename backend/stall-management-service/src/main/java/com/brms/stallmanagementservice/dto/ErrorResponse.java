package com.brms.stallmanagementservice.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;      // HTTP reason phrase (e.g. "Not Found")
    private String code;       // application-level code, e.g. "EMPLOYEE_NOT_FOUND"
    private String message;    // human-friendly message
    private String path;       // request path
    private List<FieldErrorDetail> fieldErrors;
}

