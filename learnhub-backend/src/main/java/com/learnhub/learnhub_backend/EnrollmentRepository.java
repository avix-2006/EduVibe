
package com.learnhub.learnhub_backend;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.learnhub.learnhub_backend.model.Enrollment;

public interface EnrollmentRepository
        extends JpaRepository<Enrollment, Long> {

    List<Enrollment> findByEmail(String email);
}
