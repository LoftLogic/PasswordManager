package com.example.pwm.repository;

import com.example.pwm.entity.Session;
import com.example.pwm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {
    Optional<Session> findByToken(String token);

    @Modifying
    @Query("DELETE FROM Session s WHERE s.user = ?1")
    void deleteAllByUser(User user);

    @Modifying
    @Query("DELETE FROM Session s WHERE s.expiresAt < ?1")
    void deleteExpiredSessions(LocalDateTime now);
}
