package com.example.Queue_Master.service;

import com.example.Queue_Master.dto.AuthResponse;
import com.example.Queue_Master.dto.LoginRequest;
import com.example.Queue_Master.dto.RegisterRequest;
import com.example.Queue_Master.entity.Role;
import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.repository.UserRepository;
import com.example.Queue_Master.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // ── REGISTER ─────────────────────────────────────────────

    public AuthResponse register(RegisterRequest request) {

        // Check passwords match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }

        // Check username already taken
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken!");
        }

        // Check email already registered
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        // Build user — always USER role on self-register
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt
        user.setRole(Role.USER);

        userRepository.save(user);

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                "Registration successful!"
        );
    }

    // ── LOGIN ────────────────────────────────────────────────

    public AuthResponse login(LoginRequest request) {

        // Find by username OR email
        User user = userRepository
                .findByUsernameOrEmail(
                        request.getUsernameOrEmail(),
                        request.getUsernameOrEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found!"));

        // Check password (BCrypt compare)
        if (!passwordEncoder.matches(
                request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Wrong password!");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername());

        return new AuthResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                "Login successful!"
        );
    }

    // ── CREATE STAFF (called by Admin only) ──────────────────

    public AuthResponse createStaff(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken!");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        User staff = new User();
        staff.setUsername(request.getUsername());
        staff.setEmail(request.getEmail());
        staff.setPassword(passwordEncoder.encode(request.getPassword()));
        staff.setRole(Role.STAFF);

        userRepository.save(staff);

        return new AuthResponse(
                null,   // no token — admin creates, staff logs in separately
                staff.getId(),
                staff.getUsername(),
                staff.getEmail(),
                staff.getRole(),
                "Staff account created successfully!"
        );
    }
}