package com.backend.service;

public interface AuthService {
    void login(String username, String password, String email);
    void logout();
    void remember();
}
