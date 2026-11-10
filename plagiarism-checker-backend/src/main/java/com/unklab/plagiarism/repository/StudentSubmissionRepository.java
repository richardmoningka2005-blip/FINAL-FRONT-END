package com.unklab.plagiarism.repository;

import com.unklab.plagiarism.model.StudentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentSubmissionRepository extends JpaRepository<StudentSubmission, Long> {
    List<StudentSubmission> findBySessionId(Long sessionId);
    void deleteBySessionId(Long sessionId);
}
