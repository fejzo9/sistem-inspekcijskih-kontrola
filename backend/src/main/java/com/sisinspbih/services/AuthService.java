package com.sisinspbih.services;

import com.sisinspbih.payload.request.LoginRequest;
import com.sisinspbih.payload.request.SignupRequest;
import com.sisinspbih.payload.response.JwtResponse;
import com.sisinspbih.payload.response.MessageResponse;

public interface AuthService {
    JwtResponse authenticateUser(LoginRequest loginRequest);

    MessageResponse registerUser(SignupRequest signUpRequest);
}
