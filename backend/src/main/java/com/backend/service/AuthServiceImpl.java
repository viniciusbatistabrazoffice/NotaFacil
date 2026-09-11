package com.backend.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.backend.entity.Auth;
import com.backend.repository.AuthRepository;

@Service 
public class AuthServiceImpl implements AuthService {

    private final AuthRepository authRepository;

    public AuthServiceImpl(AuthRepository authRepository) {
        this.authRepository = authRepository;
    }
    @Override
    public void login(Auth auth) {
        // Implement login logic here
        ArrayList<Auth> authList = new ArrayList<>();
        authList.add(auth);
        authRepository.save(auth);
    }

    @Override
    public void logout(Auth auth) {
        // Implement logout logic here
        authRepository.delete(auth);
    }

    @Override
    public void remember() {
        // Implement remember logic here
        ArrayList<Auth> authList = new ArrayList<>();
        authList.add(new Auth(null, null, null, null));
        authRepository.saveAll(authList);
    }
}