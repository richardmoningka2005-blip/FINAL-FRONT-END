package com.unklab.plagiarism.controller;

import com.unklab.plagiarism.model.CheckSession;
import com.unklab.plagiarism.model.ComparisonResult;
import com.unklab.plagiarism.model.StudentSubmission;
import com.unklab.plagiarism.repository.CheckSessionRepository;
import com.unklab.plagiarism.repository.ComparisonResultRepository;
import com.unklab.plagiarism.repository.StudentSubmissionRepository;
import com.unklab.plagiarism.service.PlagiarismService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class PlagiarismController {

    private final PlagiarismService plagiarismService;
    private final CheckSessionRepository sessionRepository;
    private final StudentSubmissionRepository submissionRepository;
    private final ComparisonResultRepository comparisonRepository;

    public PlagiarismController(PlagiarismService plagiarismService,
                                CheckSessionRepository sessionRepository,
                                StudentSubmissionRepository submissionRepository,
                                ComparisonResultRepository comparisonRepository) {
        this.plagiarismService = plagiarismService;
        this.sessionRepository = sessionRepository;
        this.submissionRepository = submissionRepository;
        this.comparisonRepository = comparisonRepository;
    }

    /**
     * Batch Upload Word & PDF files for plagiarism check
     */
    @PostMapping("/check")
    public ResponseEntity<?> checkBatchPlagiarism(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(value = "sessionTitle", required = false) String sessionTitle,
            @RequestParam(value = "courseName", required = false) String courseName,
            @RequestParam(value = "geminiApiKey", required = false) String geminiApiKey) {

        try {
            if (files == null || files.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Pilih minimal 2 file tugas mahasiswa untuk dibandingkan."));
            }

            CheckSession session = plagiarismService.processBatchCheck(files, sessionTitle, courseName, geminiApiKey);
            List<ComparisonResult> results = comparisonRepository.findBySessionIdOrderBySimilarityPercentageDesc(session.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("session", session);
            response.put("results", results);
            response.put("message", "Pemeriksaan plagiarisme berhasil diselesaikan!");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Terjadi kesalahan saat memproses file: " + e.getMessage()));
        }
    }

    /**
     * Get all past check sessions
     */
    @GetMapping("/sessions")
    public ResponseEntity<List<CheckSession>> getAllSessions() {
        return ResponseEntity.ok(sessionRepository.findAllByOrderByCreatedAtDesc());
    }

    /**
     * Get details of a single session including all student pairs
     */
    @GetMapping("/sessions/{id}")
    public ResponseEntity<?> getSessionDetail(@PathVariable Long id) {
        Optional<CheckSession> sessionOpt = sessionRepository.findById(id);
        if (sessionOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        CheckSession session = sessionOpt.get();
        List<StudentSubmission> submissions = submissionRepository.findBySessionId(id);
        List<ComparisonResult> results = comparisonRepository.findBySessionIdOrderBySimilarityPercentageDesc(id);

        Map<String, Object> response = new HashMap<>();
        response.put("session", session);
        response.put("submissions", submissions);
        response.put("results", results);

        return ResponseEntity.ok(response);
    }

    /**
     * Get full detail of a specific comparison (for side-by-side view)
     */
    @GetMapping("/comparisons/{id}")
    public ResponseEntity<?> getComparisonDetail(@PathVariable Long id) {
        Optional<ComparisonResult> compOpt = comparisonRepository.findById(id);
        if (compOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(compOpt.get());
    }

    /**
     * Delete a session and its associated results
     */
    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        if (!sessionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        comparisonRepository.deleteBySessionId(id);
        submissionRepository.deleteBySessionId(id);
        sessionRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Sesi berhasil dihapus."));
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "system", "UNKLAB AI Plagiarism Checker Backend",
            "database", "H2 Database",
            "supportedFormats", List.of(".docx", ".doc", ".pdf", ".txt")
        ));
    }
}
