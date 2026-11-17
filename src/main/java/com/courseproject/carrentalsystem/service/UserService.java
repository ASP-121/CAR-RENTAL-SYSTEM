package com.courseproject.carrentalsystem.service;

import com.courseproject.carrentalsystem.dto.AuthRequest;
import com.courseproject.carrentalsystem.dto.AuthResponse;
import com.courseproject.carrentalsystem.model.User;
import com.courseproject.carrentalsystem.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @PostConstruct
    public void initDefaultUser() {
        if (!userRepository.existsByEmailIgnoreCase("alex.morgan@example.com")) {
            User demo = new User(
                    "usr_demo_1",
                    "Alex Morgan",
                    "alex.morgan@example.com",
                    "password123",
                    "+1 (415) 890-2341",
                    "CA-9482104-D",
                    "Platinum Keyless Access",
                    14,
                    5.0,
                    true,
                    "CUSTOMER"
            );
            userRepository.save(demo);
        }
    }

    public AuthResponse register(AuthRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse(false, "Email is required", null, null);
        }
        if (userRepository.existsByEmailIgnoreCase(request.getEmail().trim())) {
            return new AuthResponse(false, "User with this email already exists", null, null);
        }

        User user = new User(
                "usr_" + UUID.randomUUID().toString().substring(0, 8),
                request.getName() != null && !request.getName().isEmpty() ? request.getName() : "Driver",
                request.getEmail().trim().toLowerCase(),
                request.getPassword() != null ? request.getPassword() : "password",
                request.getPhone() != null ? request.getPhone() : "+1 (555) 000-0000",
                request.getLicenseNumber() != null ? request.getLicenseNumber() : "DL-PENDING",
                "Standard Member",
                0,
                5.0,
                true,
                "CUSTOMER"
        );
        userRepository.save(user);
        return new AuthResponse(true, "Registration successful", user, "jwt_token_" + user.getId());
    }

    public AuthResponse login(AuthRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return new AuthResponse(false, "Email and password are required", null, null);
        }
        Optional<User> optionalUser = userRepository.findByEmailIgnoreCase(request.getEmail().trim());
        if (optionalUser.isEmpty()) {
            return new AuthResponse(false, "User not found with this email", null, null);
        }
        User user = optionalUser.get();
        if (!user.getPassword().equals(request.getPassword())) {
            return new AuthResponse(false, "Invalid password", null, null);
        }
        return new AuthResponse(true, "Login successful", user, "jwt_token_" + user.getId());
    }

    public Optional<User> getProfile(String email) {
        if (email == null) return Optional.empty();
        return userRepository.findByEmailIgnoreCase(email.trim());
    }

    public User updateProfile(User updatedUser) {
        Optional<User> existing = userRepository.findByEmailIgnoreCase(updatedUser.getEmail());
        if (existing.isPresent()) {
            User user = existing.get();
            if (updatedUser.getName() != null) user.setName(updatedUser.getName());
            if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
            if (updatedUser.getLicenseNumber() != null) user.setLicenseNumber(updatedUser.getLicenseNumber());
            if (updatedUser.getMembershipTier() != null) user.setMembershipTier(updatedUser.getMembershipTier());
            return userRepository.save(user);
        }
        return userRepository.save(updatedUser);
    }
}
