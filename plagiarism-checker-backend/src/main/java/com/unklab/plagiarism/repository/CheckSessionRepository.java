package com.unklab.plagiarism.repository;

import com.unklab.plagiarism.model.CheckSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CheckSessionRepository extends JpaRepository<CheckSession, Long> {
    List<CheckSession> findAllByOrderByCreatedAtDesc();
}
