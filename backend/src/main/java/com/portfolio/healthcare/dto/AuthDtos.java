package com.portfolio.healthcare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.util.List;
import java.util.UUID;

public final class AuthDtos {
    private AuthDtos() {
    }

    public record LoginRequest(
            @Email @NotBlank String email,
            @NotBlank String password
    ) {
    }

    public record RefreshTokenRequest(
            @NotBlank String refreshToken
    ) {
    }

    public record UserProfile(
            UUID id,
            String name,
            String email,
            String position,
            String avatarUrl,
            List<String> roles
    ) {
    }

    public record AuthResponse(
            String accessToken,
            String refreshToken,
            String tokenType,
            UserProfile user
    ) {
    }
}
