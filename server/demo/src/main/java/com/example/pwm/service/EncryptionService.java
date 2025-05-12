package com.example.pwm.service;


import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.stereotype.Service;

import javax.crypto.*;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.*;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.KeySpec;
import java.util.Base64;

@Service
public class EncryptionService {

    private static final String AES_GCM_ALGORITHM = "AES/GCM/NoPadding";
    private static final int GCM_TAG_LENGTH = 128;
    private static final int AES_KEY_SIZE = 256;
    private static final int ITERATION_COUNT = 320000;
    private static final int SALT_LENGTH = 32;
    private static final int IV_LENGTH = 12;

    static {
        Security.addProvider(new BouncyCastleProvider());
    }

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generates a random salt
     * @return Random salt for password hashing
     */
    public byte[] generateSalt() {
        byte[] salt = new byte[SALT_LENGTH];
        secureRandom.nextBytes(salt);
        return salt;
    }

    /**
     * Generates initialization vector
     * @return Initialization Vector for encryption
     */
    public byte[] generateIv() {
        byte[] iv = new byte[IV_LENGTH];
        secureRandom.nextBytes(iv);
        return iv;
    }

    /**
     * Random encryption key
     * @return Encryption Key
     */
    public byte[] generateEncryptionKey() {
        byte[] key = new byte[AES_KEY_SIZE / 8];
        secureRandom.nextBytes(key);
        return key;
    }

    /**
     * Derives a key for the user using their password and salt
     *
     * @param masterPassword to derive key from
     * @param salt to derive key from
     */
    public byte[] deriveKeyFromPassword(String masterPassword, byte[] salt)
            throws NoSuchAlgorithmException, InvalidKeySpecException {
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        KeySpec spec = new PBEKeySpec(masterPassword.toCharArray(), salt, ITERATION_COUNT, AES_KEY_SIZE);
        return factory.generateSecret(spec).getEncoded();
    }

    /**
     * Encryption with AES-GCM
     *
     * @param data to encrypt (the password)
     * @param key to encrypt with
     * @param initVector for more secure encryption
     */
    public byte[] encrypt(byte[] data, byte[] key, byte[] initVector)
            throws Exception {
        Cipher cipher = Cipher.getInstance(AES_GCM_ALGORITHM);
        SecretKey secretKey = new SecretKeySpec(key, "AES");
        GCMParameterSpec paramSpecs = new GCMParameterSpec(GCM_TAG_LENGTH, initVector);

        cipher.init(Cipher.ENCRYPT_MODE, secretKey, paramSpecs);

        return cipher.doFinal(data);
    }

    /**
     * Decryption with AES-GCM
     *
     * @param encryptedData to decrypt (the password)
     * @param key to encrypt with
     * @param initVector for more secure encryption
     */
    public byte[] decrypt(byte[] encryptedData, byte[] key, byte[] initVector) throws Exception {
        Cipher cipher = Cipher.getInstance(AES_GCM_ALGORITHM);
        SecretKey secretKey = new SecretKeySpec(key, "AES");
        GCMParameterSpec parameterSpec = new GCMParameterSpec(GCM_TAG_LENGTH, initVector);

        cipher.init(Cipher.DECRYPT_MODE, secretKey, parameterSpec);
        return cipher.doFinal(encryptedData);
    }

    /**
     * Encrypts the vault key
     * @param vaultKey to encrypt
     * @param masterPassword to derive key from
     * @param salt to derive key from
     * @param initVector for encryption
     * @return encrypted vault key
     * @throws Exception
     */
    public byte[] encryptVaultKey(byte[] vaultKey, String masterPassword, byte[] salt, byte[] initVector)
        throws Exception {
        byte[] derivedKey = deriveKeyFromPassword(masterPassword, salt);
        return encrypt(vaultKey, derivedKey, initVector);
    }


    /**
     * Decrypts the encrypted vault key
     * @param encryptedVaultKey to decrypt
     * @param masterPassword to derive key from
     * @param salt to derive key from
     * @param initVector to decrypt with
     * @return decrypted vault key
     * @throws Exception
     */
    public byte[] decryptVaultKey(byte[] encryptedVaultKey, String masterPassword, byte[] salt,
                                  byte[] initVector) throws Exception {
        byte[] derivedKey = deriveKeyFromPassword(masterPassword, salt);
        return decrypt(encryptedVaultKey, derivedKey, initVector);
    }

    /**
     * Converts to hex
     * @param bytes byte array to convert
     * @return hex string
     */
    public String bytesToHex(byte[] bytes) {
        return Base64.getEncoder().encodeToString(bytes);
    }

    /**
     * Convert hex string to byte array
     */
    public byte[] hexToBytes(String hex) {
        return Base64.getDecoder().decode(hex);
    }
}
