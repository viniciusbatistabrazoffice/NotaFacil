package com.backend.dto;

public record ResetPasswordRequest(String token, String newPassword) {
}
