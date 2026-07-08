package com.portfolio.healthcare.service;

import com.portfolio.healthcare.dto.AuthDtos.LoginRequest;
import com.portfolio.healthcare.entity.RefreshToken;
import com.portfolio.healthcare.entity.Role;
import com.portfolio.healthcare.entity.User;
import com.portfolio.healthcare.entity.enums.RoleName;
import com.portfolio.healthcare.repository.UserRepository;
import com.portfolio.healthcare.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    AuthenticationManager authenticationManager;

    @Mock
    UserRepository userRepository;

    @Mock
    JwtService jwtService;

    @Mock
    RefreshTokenService refreshTokenService;

    @InjectMocks
    AuthService authService;

    @Test
    void shouldAuthenticateAndReturnJwtAndRefreshToken() {
        User user = new User("Dr. Joao Silva", "admin@healthcare.com", "hash", "Administrador", null);
        Role role = new Role();
        role.setName(RoleName.ADMIN);
        user.getRoles().add(role);

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken("refresh-123");
        refreshToken.setUser(user);
        refreshToken.setExpiresAt(Instant.now().plusSeconds(3600));

        when(userRepository.findByEmailIgnoreCase("admin@healthcare.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-token");
        when(refreshTokenService.create(user)).thenReturn(refreshToken);

        var response = authService.authenticate(new LoginRequest("admin@healthcare.com", "123456"));

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        assertThat(response.accessToken()).isEqualTo("jwt-token");
        assertThat(response.refreshToken()).isEqualTo("refresh-123");
        assertThat(response.user().roles()).contains("ADMIN");
    }
}
