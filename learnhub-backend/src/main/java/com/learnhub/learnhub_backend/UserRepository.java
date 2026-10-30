
package com.learnhub.learnhub_backend;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.learnhub.learnhub_backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
