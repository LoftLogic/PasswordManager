package com.example.pwm.repository;

import com.example.pwm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    /**
     * Finds a user by name
     * @param username to search for
     * @return User with the given name
     */
    Optional<User> findByUsername(String username);

    boolean existsByUsername(String username);
}
