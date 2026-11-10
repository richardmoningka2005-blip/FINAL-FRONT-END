package com.unklab.plagiarism.repository;

import com.unklab.plagiarism.model.ComparisonResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComparisonResultRepository extends JpaRepository<ComparisonResult, Long> {
    List<ComparisonResult> findBySessionIdOrderBySimilarityPercentageDesc(Long sessionId);
    void deleteBySessionId(Long sessionId);
}
