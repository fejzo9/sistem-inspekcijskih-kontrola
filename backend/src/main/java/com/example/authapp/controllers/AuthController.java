package com.example.authapp.controllers;

import com.example.authapp.payload.request.LoginRequest;
import com.example.authapp.payload.request.SignupRequest;
import com.example.authapp.payload.response.MessageResponse;
import com.example.authapp.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
        @Autowired
        AuthService authService;

        @PostMapping("/signin")
        public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
                return ResponseEntity.ok(authService.authenticateUser(loginRequest));
        }

        @PostMapping("/signup")
        public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
                try {
                        return ResponseEntity.ok(authService.registerUser(signUpRequest));
                } catch (RuntimeException e) {
                        return ResponseEntity
                                        .badRequest()
                                        .body(new MessageResponse(e.getMessage()));
                }
        }
}
