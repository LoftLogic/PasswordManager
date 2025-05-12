package com.example.pwm.service;


import com.example.pwm.dto.DTOs;
import com.example.pwm.entity.Password;
import com.example.pwm.entity.User;
import com.example.pwm.repository.PasswordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PasswordService {
    private final PasswordRepository passwordRepository;
    private final EncryptionService encryptionService;

    /**
     * Decrypts vault key and returns it
     */
    private byte[] getVaultKey(User user, String masterPassword) throws Exception {
        byte[] salt = encryptionService.hexToBytes(user.getSalt());
        byte[] iv = encryptionService.generateIv();

        return encryptionService.decryptVaultKey(
                user.getEncryptionKey(),
                masterPassword,
                salt,
                iv
        );
    }

    /**
     * Get all decrypted passwords for the user
     */
    public List<DTOs.Password> getAllPasswords(User user, String masterPassword) {
        try {
            byte[] vaultKey = getVaultKey(user, masterPassword);

            List<Password> encryptedPasswords = passwordRepository.findAllByUser(user);
            List<DTOs.Password> decryptedPasswords = new ArrayList<>();

            for (Password encryptedPassword : encryptedPasswords) {
                byte[] iv = encryptionService.hexToBytes(encryptedPassword.getIv());
                byte[] decryptedBytes = encryptionService.decrypt(
                        encryptedPassword.getEncryptedPassword(),
                        vaultKey,
                        iv
                );

                String decryptedPassword = new String(decryptedBytes);

                decryptedPasswords.add(DTOs.Password.builder()
                        .id(encryptedPassword.getId())
                        .service(encryptedPassword.getService())
                        .username(encryptedPassword.getUsername())
                        .password(decryptedPassword)
                        .createdAt(encryptedPassword.getCreatedAt().toString())
                        .updatedAt(encryptedPassword.getUpdatedAt().toString())
                        .build());
            }
            return decryptedPasswords;
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrypt passwords", e);
        }
    }
}
