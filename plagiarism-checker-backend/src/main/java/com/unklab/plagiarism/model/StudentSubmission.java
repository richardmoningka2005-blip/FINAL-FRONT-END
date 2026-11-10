package com.unklab.plagiarism.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_submissions")
public class StudentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long sessionId;

    @Column(nullable = false)
    private String studentName;

    @Column(nullable = false)
    private String originalFilename;

    private String fileType;

    @Lob
    @Column(columnDefinition = "CLOB")
    private String extractedText;

    private Integer wordCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();

    public StudentSubmission() {
    }

    public StudentSubmission(Long sessionId, String studentName, String originalFilename, String fileType, String extractedText, Integer wordCount) {
        this.sessionId = sessionId;
        this.studentName = studentName;
        this.originalFilename = originalFilename;
        this.fileType = fileType;
        this.extractedText = extractedText;
        this.wordCount = wordCount;
        this.createdAt = LocalDateTime.now();
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

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public String getExtractedText() {
        return extractedText;
    }

    public void setExtractedText(String extractedText) {
        this.extractedText = extractedText;
    }

    public Integer getWordCount() {
        return wordCount;
    }

    public void setWordCount(Integer wordCount) {
        this.wordCount = wordCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
