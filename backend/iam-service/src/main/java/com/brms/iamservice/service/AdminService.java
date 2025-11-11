package com.brms.iamservice.service;

import com.brms.iamservice.dto.UpdateRoleRequest;
import com.brms.iamservice.dto.UserListResponse;
import com.brms.iamservice.dto.UserProfileResponse;
import com.brms.iamservice.entity.User;
import com.brms.iamservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<UserListResponse> getAllUsers(String role) {
        List<User> users;

        if (role != null && !role.isEmpty()) {
            users = userRepository.findAll().stream()
                    .filter(u -> u.getRole().equalsIgnoreCase(role))
                    .collect(Collectors.toList());
        } else {
            users = userRepository.findAll();
        }

        return users.stream()
                .map(user -> new UserListResponse(
                        user.getId(),
                        user.getEmail(),
                        user.getName(),
                        user.getBusinessName(),
                        user.getPhone(),
                        user.getRole(),
                        user.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    public UserProfileResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getBusinessName(),
                user.getPhone(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    @Transactional
    public UserProfileResponse updateUserRole(Long userId, UpdateRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        String newRole = request.getRole().toUpperCase();
        if (!newRole.equals("USER") && !newRole.equals("EMPLOYEE") && !newRole.equals("ADMIN")) {
            throw new RuntimeException("Invalid role. Must be USER, EMPLOYEE, or ADMIN");
        }

        user.setRole(newRole);
        User updatedUser = userRepository.save(user);

        return new UserProfileResponse(
                updatedUser.getId(),
                updatedUser.getEmail(),
                updatedUser.getName(),
                updatedUser.getBusinessName(),
                updatedUser.getPhone(),
                updatedUser.getRole(),
                updatedUser.getCreatedAt(),
                updatedUser.getUpdatedAt()
        );
    }

    @Transactional
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (user.getRole().equals("ADMIN")) {
            long adminCount = userRepository.findAll().stream()
                    .filter(u -> u.getRole().equals("ADMIN"))
                    .count();

            if (adminCount <= 1) {
                throw new RuntimeException("Cannot delete the last admin user");
            }
        }

        userRepository.delete(user);
    }

    public long getUserCount() {
        return userRepository.count();
    }

    public long getUserCountByRole(String role) {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole().equalsIgnoreCase(role))
                .count();
    }
}

