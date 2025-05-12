package com.example.pwm.repository;

import com.example.pwm.entity.Password;
import com.example.pwm.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasswordRepository extends JpaRepository<Password, String> {
    /**
     * Gets all passwords for a user
     * @param user (not username) to get passwords for
     */
    List<Password> findAllByUser(User user);

    @Query("Select COUNT(p) from Password p WHERE p.user = ?1") //?1 is the parameter
    int countByUser(User user);

}
