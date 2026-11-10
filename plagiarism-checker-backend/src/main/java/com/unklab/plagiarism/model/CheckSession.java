package com.unklab.plagiarism.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_sessions")
public class CheckSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sessionTitle;

    private String courseName;

    private Integer totalFiles = 0;

    private Integer totalPairs = 0;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public CheckSession() {
    }

    public CheckSession(String sessionTitle, String courseName, Integer totalFiles, Integer totalPairs) {
        this.sessionTitle = sessionTitle;
        this.courseName = courseName;
        this.totalFiles = totalFiles;
        this.totalPairs = totalPairs;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionTitle() {
        return sessionTitle;
    }

    public void setSessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Integer getTotalFiles() {
        return totalFiles;
    }

    public void setTotalFiles(Integer totalFiles) {
        this.totalFiles = totalFiles;
    }

    public Integer getTotalPairs() {
        return totalPairs;
    }

    public void setTotalPairs(Integer totalPairs) {
        this.totalPairs = totalPairs;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
