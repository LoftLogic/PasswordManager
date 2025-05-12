package com.example.pwm.service;

import com.example.pwm.entity.Session;
import com.example.pwm.entity.User;
import com.example.pwm.repository.SessionRepository;
import com.example.pwm.repository.UserRepository;
import com.example.pwm.service.EncryptionService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;
    private final PasswordEncoder passwordEncoder;
    private final EncryptionService encryptionService;
    private final SecureRandom secureRandom = new SecureRandom();

    private static final int SESSION_EXPIRY_DAYS = 7;

    @Transactional
    public User register(String username, String masterPassword) throws Exception {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username already registered");
        }
        byte[] salt = encryptionService.generateSalt();
        String saltHex = encryptionService.bytesToHex(salt);

        String passwordHash = passwordEncoder.encode(masterPassword);
        byte[] vaultKey = encryptionService.generateEncryptionKey();
        byte[] keyIv = encryptionService.generateIv();
        String keyIvHex = encryptionService.bytesToHex(keyIv);

        byte[] encryptedVaultKey = encryptionService.encryptVaultKey(vaultKey, masterPassword, salt, keyIv);

        User user = User.builder()
                .username(username)
                .passwordHash(passwordHash)
                .salt(saltHex)
                .encryptionKey(encryptedVaultKey)
                .iv(keyIvHex)
                .build();

        return userRepository.save(user);
    }

    @Transactional
    public Session login(String username, String password) throws Exception {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        String token = this.generateSessionToken();
        LocalDateTime expirationDate = LocalDateTime.now().plusDays(SESSION_EXPIRY_DAYS);

        Session session = Session.builder()
                .user(user)
                .token(token)
                .expiresAt(expirationDate)
                .build();

        return this.sessionRepository.save(session);
    }

    /**
     * Logs out by invalidating the session
     */
    @Transactional
    public void logout(String token) {
        sessionRepository.findByToken(token).ifPresent(sessionRepository::delete);
    }

    @Transactional
    public void logoutAll(User user) {
        sessionRepository.deleteAllByUser(user);
    }

    public Optional<User> validationSession(String token) {
        return this.sessionRepository.findByToken(token).filter(session -> !session.isExpired()).map(Session::getUser);
    }

    /**
     * Not implemented.
     */
    public boolean changeMasterPassword(User user, String currentPassword, String newPassword) {
        return false;
    }

    private String generateSessionToken() {
        byte[] tokenBytes = new byte[32];
        secureRandom.nextBytes(tokenBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
    }

    @Scheduled(fixedRate = 86400000)
    @Transactional
    public void cleanupExpiredSessions() {
        sessionRepository.deleteExpiredSessions(LocalDateTime.now());
    }

}
