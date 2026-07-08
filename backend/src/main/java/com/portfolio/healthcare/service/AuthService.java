package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.AuthDtos.AuthResponse;
import com.portfolio.healthcare.dto.AuthDtos.LoginRequest;
import com.portfolio.healthcare.dto.AuthDtos.RefreshTokenRequest;
import com.portfolio.healthcare.dto.AuthDtos.UserProfile;
import com.portfolio.healthcare.entity.User;
import com.portfolio.healthcare.exception.ResourceNotFoundException;
import com.portfolio.healthcare.repository.UserRepository;
import com.portfolio.healthcare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public AuthResponse authenticate(LoginRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        User user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado."));
        return responseFor(user);
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        var refreshToken = refreshTokenService.validate(request.refreshToken());
        return responseFor(refreshToken.getUser());
    }

    private AuthResponse responseFor(User user) {
        var refreshToken = refreshTokenService.create(user);
        return new AuthResponse(jwtService.generateToken(user), refreshToken.getToken(), "Bearer", toProfile(user));
    }

    private UserProfile toProfile(User user) {
        return new UserProfile(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPosition(),
                user.getAvatarUrl(),
                user.getRoles().stream().map(role -> role.getName().name()).toList()
        );
    }
}
