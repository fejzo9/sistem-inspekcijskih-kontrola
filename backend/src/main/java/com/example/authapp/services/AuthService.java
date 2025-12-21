package com.example.authapp.services;

import com.example.authapp.payload.request.LoginRequest;
import com.example.authapp.payload.request.SignupRequest;
import com.example.authapp.payload.response.JwtResponse;
import com.example.authapp.payload.response.MessageResponse;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);

    MessageResponse registerUser(SignupRequest signUpRequest);
}
