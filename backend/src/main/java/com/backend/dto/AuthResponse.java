package com.backend.dto;

// never expose the password hash to clients
public record AuthResponse(Long id, String username, String email) {
}
