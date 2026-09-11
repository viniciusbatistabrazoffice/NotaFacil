package com.backend.service;

import java.time.Instant;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.backend.dto.AuthResponse;
import com.backend.dto.ForgotPasswordRequest;
import com.backend.dto.LoginRequest;
import com.backend.dto.LoginResponse;
import com.backend.dto.RegisterRequest;
import com.backend.dto.ResetPasswordRequest;
import com.backend.entity.Auth;
import com.backend.repository.AuthRepository;
import com.backend.security.JwtService;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;
    private final JwtService jwtService;
    private final MailService mailService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final long resetTokenExpirationMs;

    public AuthServiceImpl(AuthRepository authRepository, JwtService jwtService, MailService mailService,
            @Value("${app.reset-token.expiration-ms:900000}") long resetTokenExpirationMs) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.resetTokenExpirationMs = resetTokenExpirationMs;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Auth auth = authRepository.findByUsername(request.username())
                .filter(a -> passwordEncoder.matches(request.password(), a.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário ou senha inválidos"));
        String token = jwtService.generateToken(auth.getUsername());
        return new LoginResponse(token, toResponse(auth));
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (!StringUtils.hasText(request.username()) || !StringUtils.hasText(request.password())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário e senha são obrigatórios");
        }
        if (authRepository.findByUsername(request.username()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Usuário já existe");
        }
        Auth auth = new Auth(null, request.username(), passwordEncoder.encode(request.password()), request.email());
        return toResponse(authRepository.save(auth));
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        if (!StringUtils.hasText(request.identifier())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "E-mail ou usuário é obrigatório");
        }
        authRepository.findByUsernameOrEmail(request.identifier(), request.identifier())
                .ifPresent(auth -> {
                    String token = UUID.randomUUID().toString();
                    auth.setResetToken(token);
                    auth.setResetTokenExpiresAt(Instant.now().plusMillis(resetTokenExpirationMs));
                    authRepository.save(auth);
                    mailService.sendPasswordReset(auth.getEmail(), token);
                });
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        if (!StringUtils.hasText(request.token()) || !StringUtils.hasText(request.newPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token e nova senha são obrigatórios");
        }
        Auth auth = authRepository.findByResetToken(request.token())
                .filter(a -> a.getResetTokenExpiresAt() != null
                        && a.getResetTokenExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token inválido ou expirado"));
        auth.setPassword(passwordEncoder.encode(request.newPassword()));
        auth.setResetToken(null);
        auth.setResetTokenExpiresAt(null);
        authRepository.save(auth);
    }

    private AuthResponse toResponse(Auth auth) {
        return new AuthResponse(auth.getId(), auth.getUsername(), auth.getEmail());
    }
}
