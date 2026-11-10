package com.unklab.plagiarism.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.unklab.plagiarism.model.CheckSession;
import com.unklab.plagiarism.model.ComparisonResult;
import com.unklab.plagiarism.model.StudentSubmission;
import com.unklab.plagiarism.repository.CheckSessionRepository;
import com.unklab.plagiarism.repository.ComparisonResultRepository;
import com.unklab.plagiarism.repository.StudentSubmissionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class PlagiarismService {

    private final CheckSessionRepository sessionRepository;
    private final StudentSubmissionRepository submissionRepository;
    private final ComparisonResultRepository comparisonRepository;
    private final FileExtractionService fileExtractionService;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public PlagiarismService(CheckSessionRepository sessionRepository,
                             StudentSubmissionRepository submissionRepository,
                             ComparisonResultRepository comparisonRepository,
                             FileExtractionService fileExtractionService,
                             GeminiService geminiService) {
        this.sessionRepository = sessionRepository;
        this.submissionRepository = submissionRepository;
        this.comparisonRepository = comparisonRepository;
        this.fileExtractionService = fileExtractionService;
        this.geminiService = geminiService;
    }

    @Transactional
    public CheckSession processBatchCheck(List<MultipartFile> files,
                                         String sessionTitle,
                                         String courseName,
                                         String geminiApiKey) throws Exception {
        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("Tidak ada file yang diunggah.");
        }

        // Cek Duplikasi Mahasiswa / File dengan penanda copy / nama identik
        Map<String, String> studentKeyMap = new HashMap<>();
        for (MultipartFile f : files) {
            String orig = f.getOriginalFilename();
            if (orig == null || f.isEmpty()) continue;
            String key = fileExtractionService.cleanStudentKey(orig);
            if (studentKeyMap.containsKey(key)) {
                String existing = studentKeyMap.get(key);
                throw new IllegalArgumentException(
                    "Pemeriksaan Dibatalkan: Ditemukan berkas atau nama mahasiswa ganda/duplikat! " +
                    "Berkas '" + orig + "' memiliki identitas yang sama dengan '" + existing + "'. " +
                    "Mohon hapus salah satu berkas sebelum memulai pengecekan."
                );
            }
            studentKeyMap.put(key, orig);
        }

        if (sessionTitle == null || sessionTitle.isBlank()) {
            sessionTitle = "Pemeriksaan Tugas - " + LocalDateTime.now().toLocalDate();
        }
        if (courseName == null || courseName.isBlank()) {
            courseName = "Kelas Universitas Klabat (UNKLAB)";
        }

        // 1. Create Session
        CheckSession session = new CheckSession();
        session.setSessionTitle(sessionTitle);
        session.setCourseName(courseName);
        session.setTotalFiles(files.size());
        session = sessionRepository.save(session);

        // 2. Extract and Save Student Submissions
        List<StudentSubmission> submissions = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String originalName = file.getOriginalFilename();
            String studentName = fileExtractionService.extractStudentName(originalName);
            String extractedText = fileExtractionService.extractText(file);
            String fileType = getFileType(originalName);
            int wordCount = countWords(extractedText);

            StudentSubmission submission = new StudentSubmission(
                session.getId(),
                studentName,
                originalName,
                fileType,
                extractedText,
                wordCount
            );
            submissions.add(submissionRepository.save(submission));
        }

        // 3. Perform Cross-Comparison between all student pairs
        int totalPairs = 0;
        List<ComparisonResult> results = new ArrayList<>();

        for (int i = 0; i < submissions.size(); i++) {
            for (int j = i + 1; j < submissions.size(); j++) {
                StudentSubmission subA = submissions.get(i);
                StudentSubmission subB = submissions.get(j);

                ComparisonResult result = compareSubmissions(session.getId(), subA, subB, geminiApiKey);
                results.add(comparisonRepository.save(result));
                totalPairs++;
            }
        }

        session.setTotalPairs(totalPairs);
        return sessionRepository.save(session);
    }

    private ComparisonResult compareSubmissions(Long sessionId,
                                               StudentSubmission subA,
                                               StudentSubmission subB,
                                               String geminiApiKey) {
        String textA = subA.getExtractedText() != null ? subA.getExtractedText() : "";
        String textB = subB.getExtractedText() != null ? subB.getExtractedText() : "";

        // Calculate similarity percentage and extract matched sections
        Map<String, Object> analysis = computeSimilarityAndSections(textA, textB);
        double similarity = (double) analysis.get("similarity");
        double originality = Math.max(0.0, 100.0 - similarity);
        String commonSectionsJson = (String) analysis.get("sectionsJson");

        // Determine grade and status
        String grade = calculateGrade(similarity);
        String status = calculateStatus(similarity);

        // AI Summary (Gemini or Local)
        String aiSummary = geminiService.analyzePairWithGemini(
            subA.getStudentName(), textA,
            subB.getStudentName(), textB,
            similarity,
            geminiApiKey
        );

        ComparisonResult result = new ComparisonResult();
        result.setSessionId(sessionId);
        result.setStudentAName(subA.getStudentName());
        result.setStudentBName(subB.getStudentName());
        result.setFileAName(subA.getOriginalFilename());
        result.setFileBName(subB.getOriginalFilename());
        result.setTextA(textA);
        result.setTextB(textB);
        result.setSimilarityPercentage(Math.round(similarity * 10.0) / 10.0);
        result.setOriginalityPercentage(Math.round(originality * 10.0) / 10.0);
        result.setGrade(grade);
        result.setStatus(status);
        result.setCommonSectionsJson(commonSectionsJson);
        result.setAiAnalysisNotes(aiSummary);

        return result;
    }

    private Map<String, Object> computeSimilarityAndSections(String textA, String textB) {
        Map<String, Object> out = new HashMap<>();

        if (textA.isBlank() || textB.isBlank()) {
            out.put("similarity", 0.0);
            out.put("sectionsJson", "[]");
            return out;
        }

        // Split into sentences / meaningful chunks
        List<String> sentencesA = splitIntoSentences(textA);
        List<String> sentencesB = splitIntoSentences(textB);

        List<Map<String, Object>> matchedSections = new ArrayList<>();
        int matchedWords = 0;
        int totalWordsA = countWords(textA);
        int totalWordsB = countWords(textB);
        int maxWords = Math.max(totalWordsA, totalWordsB);

        // Find matching sentences
        for (int i = 0; i < sentencesA.size(); i++) {
            String sA = sentencesA.get(i).trim();
            if (isAdministrativeOrMetadataLine(sA)) continue; // Filter out Nama, NIM, Tanggal, dll.
            if (countWords(sA) < 4) continue; // Skip very short phrases

            String normA = normalize(sA);
            double bestMatchScore = 0.0;
            String bestMatchSentenceB = null;
            int bestMatchIndexB = -1;

            for (int j = 0; j < sentencesB.size(); j++) {
                String sB = sentencesB.get(j).trim();
                if (isAdministrativeOrMetadataLine(sB)) continue; // Filter out Nama, NIM, Tanggal, dll.
                if (countWords(sB) < 4) continue;

                String normB = normalize(sB);
                double score = computeSentenceSimilarity(normA, normB);
                if (score > bestMatchScore) {
                    bestMatchScore = score;
                    bestMatchSentenceB = sB;
                    bestMatchIndexB = j;
                }
            }

            if (bestMatchScore >= 0.60 && bestMatchSentenceB != null) {
                Map<String, Object> section = new HashMap<>();
                section.put("sectionIndex", matchedSections.size() + 1);
                section.put("sentenceA", sA);
                section.put("sentenceB", bestMatchSentenceB);
                section.put("similarityScore", Math.round(bestMatchScore * 100.0));
                section.put("matchType", bestMatchScore >= 0.85 ? "IDENTIK" : "PARAFRASE");
                section.put("note", bestMatchScore >= 0.85
                    ? "Teks terdeteksi identik kata per kata (copy-paste langsung)"
                    : "Teks memiliki struktur & kata kunci serupa (indikasi parafrase tipis)");
                matchedSections.add(section);

                matchedWords += countWords(sA);
            }
        }

        // Calculate overall Jaccard + word ratio similarity
        double tokenSimilarity = computeJaccardSimilarity(textA, textB);
        double sentenceCoverage = maxWords > 0 ? (double) matchedWords / maxWords : 0.0;

        // Weighted blend
        double finalSimilarity = (sentenceCoverage * 0.70 + tokenSimilarity * 0.30) * 100.0;
        finalSimilarity = Math.min(100.0, Math.max(0.0, finalSimilarity));

        // Jika tidak ada kalimat yang terindikasi plagiat sama sekali, dan n-gram similarity di bawah 3.5%,
        // ini murni kebetulan kata-kata umum (noise) dalam Bahasa Indonesia -> bulatkan jadi 0.0%
        if (matchedSections.isEmpty() && finalSimilarity < 3.5) {
            finalSimilarity = 0.0;
        }

        out.put("similarity", finalSimilarity);
        try {
            out.put("sectionsJson", objectMapper.writeValueAsString(matchedSections));
        } catch (Exception e) {
            out.put("sectionsJson", "[]");
        }
        return out;
    }

    private double computeSentenceSimilarity(String a, String b) {
        if (a.equals(b)) return 1.0;

        Set<String> wordsA = new HashSet<>(Arrays.asList(a.split("\\s+")));
        Set<String> wordsB = new HashSet<>(Arrays.asList(b.split("\\s+")));

        Set<String> intersection = new HashSet<>(wordsA);
        intersection.retainAll(wordsB);

        Set<String> union = new HashSet<>(wordsA);
        union.addAll(wordsB);

        if (union.isEmpty()) return 0.0;
        return (double) intersection.size() / union.size();
    }

    private double computeJaccardSimilarity(String textA, String textB) {
        Set<String> nGramsA = extractShingles(textA, 3);
        Set<String> nGramsB = extractShingles(textB, 3);

        if (nGramsA.isEmpty() || nGramsB.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(nGramsA);
        intersection.retainAll(nGramsB);

        Set<String> union = new HashSet<>(nGramsA);
        union.addAll(nGramsB);

        return (double) intersection.size() / union.size();
    }

    private Set<String> extractShingles(String text, int n) {
        String[] words = normalize(text).split("\\s+");
        Set<String> shingles = new HashSet<>();
        for (int i = 0; i <= words.length - n; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < n; j++) {
                if (j > 0) sb.append(" ");
                sb.append(words[i + j]);
            }
            shingles.add(sb.toString());
        }
        return shingles;
    }

    private List<String> splitIntoSentences(String text) {
        // Split by period, exclamation, question mark, or newlines
        Pattern pattern = Pattern.compile("(?<=[.!?\\n])\\s+");
        return Arrays.stream(pattern.split(text))
            .map(String::trim)
            .filter(s -> !s.isBlank())
            .collect(Collectors.toList());
    }

    private String normalize(String text) {
        return text.toLowerCase()
            .replaceAll("[^a-zA-Z0-9\\s]", " ")
            .replaceAll("\\s+", " ")
            .trim();
    }

    private int countWords(String text) {
        if (text == null || text.isBlank()) return 0;
        return text.trim().split("\\s+").length;
    }

    private boolean isAdministrativeOrMetadataLine(String line) {
        if (line == null || line.isBlank()) return true;
        String lower = line.toLowerCase().trim();

        // Check for common metadata keywords (NIM, NRP, Nama, Tanggal, Dosen, Fakultas, dll.)
        // Judul tugas TIDAK termasuk di sini, sehingga judul tetap akan dievaluasi!
        boolean hasIdentityKeyword = lower.contains("nim") ||
                                     lower.contains("nrp") ||
                                     lower.contains("disusun oleh") ||
                                     lower.matches(".*\\b(nama|oleh|penulis)\\s*[:\\-].*") ||
                                     lower.contains("dosen") ||
                                     lower.contains("program studi") ||
                                     lower.contains("fakultas") ||
                                     lower.contains("universitas klabat") ||
                                     lower.contains("unklab") ||
                                     lower.matches(".*\\b(tanggal|tahun ajaran|semester)\\b.*");

        // Check if string contains standard student ID pattern (e.g. 10502181010)
        boolean hasStudentNumberPattern = lower.matches(".*\\b(1050\\d{7}|\\d{9,12})\\b.*");

        return hasIdentityKeyword || hasStudentNumberPattern;
    }

    private String calculateGrade(double similarity) {
        if (similarity < 15.0) return "A";
        if (similarity < 30.0) return "B";
        if (similarity < 50.0) return "C";
        if (similarity < 70.0) return "D";
        return "E";
    }

    private String calculateStatus(double similarity) {
        if (similarity < 20.0) return "AMAN";
        if (similarity < 45.0) return "PERLU_REVIEW";
        return "TERINDIKASI_PLAGIAT";
    }

    private String getFileType(String filename) {
        if (filename == null) return "UNKNOWN";
        String lower = filename.toLowerCase();
        if (lower.endsWith(".docx")) return "DOCX";
        if (lower.endsWith(".doc")) return "DOC";
        if (lower.endsWith(".pdf")) return "PDF";
        if (lower.endsWith(".txt")) return "TXT";
        return "OTHER";
    }
}
