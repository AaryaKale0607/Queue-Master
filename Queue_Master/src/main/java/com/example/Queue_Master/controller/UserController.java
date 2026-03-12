package com.example.Queue_Master.controller;

import com.example.Queue_Master.entity.User;
import com.example.Queue_Master.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // GET /api/users/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found: " + email));

        Map<String, Object> response = new HashMap<>();
        response.put("userId",   user.getId());
        response.put("username", user.getUsername());
        response.put("email",    user.getEmail());
        response.put("role",     user.getRole());

        return ResponseEntity.ok(response);
    }

    // GET /api/users/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found: " + id));

        Map<String, Object> response = new HashMap<>();
        response.put("userId",   user.getId());
        response.put("username", user.getUsername());
        response.put("email",    user.getEmail());
        response.put("role",     user.getRole());

        return ResponseEntity.ok(response);
    }
}