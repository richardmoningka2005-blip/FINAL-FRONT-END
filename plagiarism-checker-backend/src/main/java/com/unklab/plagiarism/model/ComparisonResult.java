package com.unklab.plagiarism.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comparison_results")
public class ComparisonResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long sessionId;

    @Column(nullable = false)
    private String studentAName;

    @Column(nullable = false)
    private String studentBName;

    private String fileAName;
    private String fileBName;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String textA;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String textB;

    private Double similarityPercentage = 0.0;
    private Double originalityPercentage = 100.0;
    private String grade = "A";
    private String status = "AMAN"; // AMAN, PERLU_REVIEW, TERINDIKASI_PLAGIAT

    @Lob
    @Column(columnDefinition = "CLOB")
    private String commonSectionsJson; // JSON array of matched sections

    @Lob
    @Column(columnDefinition = "CLOB")
    private String aiAnalysisNotes;

    private LocalDateTime createdAt = LocalDateTime.now();

    public ComparisonResult() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public String getStudentAName() {
        return studentAName;
    }

    public void setStudentAName(String studentAName) {
        this.studentAName = studentAName;
    }

    public String getStudentBName() {
        return studentBName;
    }

    public void setStudentBName(String studentBName) {
        this.studentBName = studentBName;
    }

    public String getFileAName() {
        return fileAName;
    }

    public void setFileAName(String fileAName) {
        this.fileAName = fileAName;
    }

    public String getFileBName() {
        return fileBName;
    }

    public void setFileBName(String fileBName) {
        this.fileBName = fileBName;
    }

    public String getTextA() {
        return textA;
    }

    public void setTextA(String textA) {
        this.textA = textA;
    }

    public String getTextB() {
        return textB;
    }

    public void setTextB(String textB) {
        this.textB = textB;
    }

    public Double getSimilarityPercentage() {
        return similarityPercentage;
    }

    public void setSimilarityPercentage(Double similarityPercentage) {
        this.similarityPercentage = similarityPercentage;
    }

    public Double getOriginalityPercentage() {
        return originalityPercentage;
    }

    public void setOriginalityPercentage(Double originalityPercentage) {
        this.originalityPercentage = originalityPercentage;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCommonSectionsJson() {
        return commonSectionsJson;
    }

    public void setCommonSectionsJson(String commonSectionsJson) {
        this.commonSectionsJson = commonSectionsJson;
    }

    public String getAiAnalysisNotes() {
        return aiAnalysisNotes;
    }

    public void setAiAnalysisNotes(String aiAnalysisNotes) {
        this.aiAnalysisNotes = aiAnalysisNotes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
