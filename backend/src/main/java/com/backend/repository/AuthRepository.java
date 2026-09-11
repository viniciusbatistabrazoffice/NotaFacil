package com.backend.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.backend.entity.Auth;

public interface AuthRepository extends CrudRepository<Auth, Long> {
    Optional<Auth> findByUsername(String username);
    Optional<Auth> findByUsernameOrEmail(String username, String email);
    Optional<Auth> findByResetToken(String resetToken);
}
