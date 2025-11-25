package com.brms.iamservice.service;

import com.brms.iamservice.dto.AuthResponse;
import com.brms.iamservice.dto.EmployeeRegisterRequest;
import com.brms.iamservice.dto.LoginRequest;
import com.brms.iamservice.dto.RegisterRequest;
import com.brms.iamservice.entity.RefreshToken;
import com.brms.iamservice.entity.User;
import com.brms.iamservice.repository.UserRepository;
import com.brms.iamservice.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setBusinessName(request.getBusinessName() != null ? request.getBusinessName() : request.getName() + "'s Business");
        user.setPhone(request.getPhoneNumber());
        user.setRole("USER");

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
        employee.setBusinessName(null);
        employee.setPhone(request.getPhone());
        employee.setRole("EMPLOYEE");

        User savedEmployee = userRepository.save(employee);

        return new AuthResponse(
                "Employee registered successfully",
                savedEmployee.getId(),
                savedEmployee.getEmail()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                refreshToken.getToken(),
                user.getRole()
        );
    }

    public AuthResponse refreshAccessToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        refreshToken = refreshTokenService.verifyExpiration(refreshToken);

        if (refreshToken.isRevoked()) {
            throw new RuntimeException("Refresh token has been revoked");
        }

        User user = refreshToken.getUser();

        String newAccessToken = jwtTokenProvider.generateTokenFromEmail(user.getEmail());

        return new AuthResponse(
                newAccessToken,
                user.getId(),
                user.getEmail(),
                refreshToken.getToken(),
                user.getRole()
        );
    }

    public void logout(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        refreshTokenService.revokeToken(refreshToken);
    }
}
