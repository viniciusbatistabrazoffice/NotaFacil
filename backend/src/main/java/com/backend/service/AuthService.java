package com.backend.service;

import com.backend.dto.AuthResponse;
import com.backend.dto.ForgotPasswordRequest;
import com.backend.dto.LoginRequest;
import com.backend.dto.LoginResponse;
import com.backend.dto.RegisterRequest;
import com.backend.dto.ResetPasswordRequest;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}
