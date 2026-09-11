package com.backend.repository;

import org.springframework.data.repository.CrudRepository;

import com.backend.entity.Auth;

public interface AuthRepository extends CrudRepository<Auth, Long> {
    
}
