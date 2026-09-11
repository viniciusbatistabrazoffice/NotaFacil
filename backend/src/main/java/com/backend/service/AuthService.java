package com.backend.service;

import com.backend.entity.Auth;

public interface AuthService {
    void login(Auth auth);
    void logout();
    void remember();
}
