package com.courseproject.carrentalsystem.service;

import com.courseproject.carrentalsystem.dto.AuthRequest;
import com.courseproject.carrentalsystem.dto.AuthResponse;
import com.courseproject.carrentalsystem.model.User;
import com.courseproject.carrentalsystem.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.courseproject.carrentalsystem.security.JwtUtil;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    public static final String ROOT_ADMIN_EMAIL = "akash2006@gmail.com";
    public static final String ROOT_ADMIN_DEFAULT_PASSWORD = "akzz4712";

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Value("${admin.email:akash2006@gmail.com}")
    private String adminEmail;

    @Value("${admin.password:akzz4712}")
    private String adminPlainPassword;

    /**
     * Ensure the dedicated root administrator account (akash2006@gmail.com / akzz4712) exists with ADMIN role.
     * Furthermore, revoke ADMIN privileges from any other account so ONLY akash2006@gmail.com holds admin rights.
     */
    @PostConstruct
    public void initRootAdmin() {
        try {
            String targetEmail = (adminEmail != null && !adminEmail.trim().isEmpty())
                    ? adminEmail.trim().toLowerCase()
                    : ROOT_ADMIN_EMAIL;
            String targetPassword = (adminPlainPassword != null && !adminPlainPassword.trim().isEmpty())
                    ? adminPlainPassword.trim()
                    : ROOT_ADMIN_DEFAULT_PASSWORD;

            Optional<User> adminOpt = userRepository.findByEmailIgnoreCase(targetEmail);
            if (adminOpt.isPresent()) {
                User admin = adminOpt.get();
                admin.setName("Akash (Fleet Administrator)");
                admin.setPassword(passwordEncoder.encode(targetPassword));
                admin.setRole("ADMIN");
                admin.setMembershipTier("Executive Fleet Administrator");
                userRepository.save(admin);
            } else {
                User rootAdmin = new User(
                        "usr_admin_akash",
                        "Akash (Fleet Administrator)",
                        targetEmail,
                        passwordEncoder.encode(targetPassword),
                        "+91 98765 43210",
                        "DL-ADMIN-AKASH",
                        "Executive Fleet Administrator",
                        0,
                        5.0,
                        true,
                        "ADMIN"
                );
                userRepository.save(rootAdmin);
            }

            // Demote any other user that might have been granted ADMIN role
            List<User> allUsers = userRepository.findAll();
            for (User u : allUsers) {
                if (!u.getEmail().equalsIgnoreCase(targetEmail) && "ADMIN".equalsIgnoreCase(u.getRole())) {
                    u.setRole("CUSTOMER");
                    userRepository.save(u);
                }
            }
        } catch (Exception e) {
            System.err.println("Note: MongoDB is currently connecting. Skipping startup user check: " + e.getMessage());
        }
    }

    /** Register a new user. Public registrations CANNOT use the admin email and are strictly CUSTOMER accounts. */
    public AuthResponse register(AuthRequest request) {
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse(false, "Email address is required", null, null);
        }
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return new AuthResponse(false, "Password is required", null, null);
        }
        String email = request.getEmail().trim().toLowerCase();

        // Prevent unauthorized re-registration of the administrator email
        if (email.equalsIgnoreCase(ROOT_ADMIN_EMAIL) || email.equalsIgnoreCase(adminEmail)) {
            return new AuthResponse(false, "This email is reserved for system administration. Please sign in instead.", null, null);
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return new AuthResponse(false, "An account with this email already exists", null, null);
        }

        // STRICT ENFORCEMENT: Every public registration receives CUSTOMER role
        String assignedRole = "CUSTOMER";
        User user = new User(
                "usr_" + UUID.randomUUID().toString().substring(0, 8),
                request.getName() != null && !request.getName().trim().isEmpty() ? request.getName().trim() : "Driver Member",
                email,
                passwordEncoder.encode(request.getPassword()),
                request.getPhone() != null ? request.getPhone().trim() : "",
                request.getLicenseNumber() != null ? request.getLicenseNumber().trim() : "",
                "Standard Driver Member",
                0,
                5.0,
                true,
                assignedRole
        );
        User savedUser = userRepository.save(user);
        return new AuthResponse(true, "Registration successful", savedUser, jwtUtil.generateToken(savedUser));
    }

    /** Authenticate a user and return a JWT on success. Strict role enforcement: ONLY akash2006@gmail.com can be ADMIN. */
    public AuthResponse login(AuthRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            return new AuthResponse(false, "Email and password are required", null, null);
        }
        String email = request.getEmail().trim().toLowerCase();
        Optional<User> optionalUser = userRepository.findByEmailIgnoreCase(email);
        if (optionalUser.isEmpty()) {
            return new AuthResponse(false, "No account found with this email. Please register.", null, null);
        }
        User user = optionalUser.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(false, "Invalid password. Please check your credentials.", null, null);
        }

        // STRICT GUARANTEE: Only akash2006@gmail.com can possess ADMIN privileges
        boolean isRootAdmin = email.equalsIgnoreCase(ROOT_ADMIN_EMAIL) || email.equalsIgnoreCase(adminEmail);
        if (isRootAdmin) {
            if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
                user.setRole("ADMIN");
                user = userRepository.save(user);
            }
        } else {
            if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                user.setRole("CUSTOMER");
                user = userRepository.save(user);
            }
        }

        return new AuthResponse(true, "Login successful", user, jwtUtil.generateToken(user));
    }

    /** Retrieve profile of the authenticated user. */
    public Optional<User> getProfile(String email) {
        if (email == null) return Optional.empty();
        return userRepository.findByEmailIgnoreCase(email.trim());
    }

    /** Update profile fields for the authenticated user. Role and password cannot be changed here. */
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
