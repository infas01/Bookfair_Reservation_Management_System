package com.brms.iamservice.controller;

import com.brms.iamservice.dto.AuthResponse;
import com.brms.iamservice.dto.EmployeeRegisterRequest;
import com.brms.iamservice.dto.RegisterRequest;
import com.brms.iamservice.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/admin/register-employee")
    public ResponseEntity<?> registerEmployee(@RequestBody EmployeeRegisterRequest request) {
        try {
            AuthResponse response = authService.registerEmployee(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("IAM Service is running!");
    }
}
