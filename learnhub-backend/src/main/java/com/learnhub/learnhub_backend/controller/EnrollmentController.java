
package com.learnhub.learnhub_backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.learnhub.learnhub_backend.EnrollmentRepository;
import com.learnhub.learnhub_backend.UserRepository;
import com.learnhub.learnhub_backend.model.Enrollment;
import com.learnhub.learnhub_backend.model.User;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:3000")
public class EnrollmentController {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public EnrollmentController(
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> enroll(
            @RequestBody Enrollment enrollment) {

        if (enrollment.getEmail() == null
                || enrollment.getCourseName() == null
                || enrollment.getEmail().isBlank()
                || enrollment.getCourseName().isBlank()) {
            return ResponseEntity.badRequest()
                    .body("Email and course are required");
        }

        User user = userRepository
                .findByEmail(enrollment.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest()
                    .body("Please register or log in first");
        }

        enrollment.setEmail(user.getEmail());
        enrollment.setFullName(user.getFullName());

        enrollmentRepository.save(enrollment);

        return ResponseEntity.ok("Course enrollment successful");
    }

    @GetMapping
    public ResponseEntity<?> getEnrollments(
            @RequestParam String email) {

        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        List<Enrollment> enrollments =
                enrollmentRepository.findByEmail(email);

        return ResponseEntity.ok(enrollments);
    }
}

