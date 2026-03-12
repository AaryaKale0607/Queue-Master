package com.example.Queue_Master.repository;

import com.example.Queue_Master.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // find by email only
    Optional<User> findByEmail(String email);

    // find by username only
    Optional<User> findByUsername(String username);

    // find by username OR email (used in login)
    Optional<User> findByUsernameOrEmail(String username, String email);

    // check if exists (used in register)
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}