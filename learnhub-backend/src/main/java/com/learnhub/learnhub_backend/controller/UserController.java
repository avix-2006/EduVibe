
package com.learnhub.learnhub_backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.learnhub.learnhub_backend.UserRepository;
import com.learnhub.learnhub_backend.model.User;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://edu-vibe-two.vercel.app"
})
public class UserController {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // User Registration
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody User user) {

        if (user.getEmail() == null
                || user.getPassword() == null
                || user.getFullName() == null
                || user.getEmail().isBlank()
                || user.getPassword().isBlank()
                || user.getFullName().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("All fields are required");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest()
                    .body("Email is already registered");
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok("Registration successful");
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody User user) {

        if (user.getEmail() == null
                || user.getPassword() == null
                || user.getEmail().isBlank()
                || user.getPassword().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Email and password are required");
        }

        User existingUser = userRepository
                .findByEmail(user.getEmail())
                .orElse(null);

        if (existingUser == null
                || !passwordEncoder.matches(
                        user.getPassword(),
                        existingUser.getPassword())) {

            return ResponseEntity.status(401)
                    .body("Invalid email or password");
        }

        return ResponseEntity.ok("Login successful");
    }

    // Get Student Profile for Dashboard
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            @RequestParam String email) {

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                Map.of(
                        "fullName", user.getFullName(),
                        "email", user.getEmail()
                )
        );
    }
}

