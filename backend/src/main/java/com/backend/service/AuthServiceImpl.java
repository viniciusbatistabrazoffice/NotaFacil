package com.backend.service;

import com.backend.entity.Auth;

public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;

    public AuthServiceImpl(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }
    @Override
    public void login(Auth auth) {
        // Implement login logic here
    
    }

    @Override
    public void logout() {
        // Implement logout logic here
    }

    @Override
    public void remember() {
        // Implement remember logic here
    }
}