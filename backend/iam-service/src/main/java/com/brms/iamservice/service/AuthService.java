package com.brms.iamservice.service;

import com.brms.iamservice.dto.AuthResponse;
import com.brms.iamservice.dto.EmployeeRegisterRequest;
import com.brms.iamservice.dto.RegisterRequest;
import com.brms.iamservice.entity.User;
import com.brms.iamservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setBusinessName(request.getBusinessName());
        user.setPhone(request.getPhone());
        user.setRole("USER");  // Always USER for public registration

        User savedUser = userRepository.save(user);

        return new AuthResponse(
                "Registration successful",
                savedUser.getId(),
                savedUser.getEmail()
        );
    }

    public AuthResponse registerEmployee(EmployeeRegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User employee = new User();
        employee.setEmail(request.getEmail());
        employee.setPassword(passwordEncoder.encode(request.getPassword()));
        employee.setName(request.getName());
        employee.setPhone(request.getPhone());
        employee.setRole("EMPLOYEE");

        User savedEmployee = userRepository.save(employee);

        return new AuthResponse(
                "Employee registered successfully",
                savedEmployee.getId(),
                savedEmployee.getEmail()
        );
    }
}
