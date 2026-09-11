package com.backend.dto;

public record LoginResponse(String token, AuthResponse user) {
}
