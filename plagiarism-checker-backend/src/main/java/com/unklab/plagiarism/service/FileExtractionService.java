package com.unklab.plagiarism.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

@Service
public class FileExtractionService {

    public String extractText(MultipartFile file) throws Exception {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            return "";
        }
        String lowerName = filename.toLowerCase();

        if (lowerName.endsWith(".docx")) {
            return extractFromDocx(file.getInputStream());
        } else if (lowerName.endsWith(".doc")) {
            return extractFromDoc(file.getInputStream());
        } else if (lowerName.endsWith(".pdf")) {
            return extractFromPdf(file.getInputStream());
        } else if (lowerName.endsWith(".txt")) {
            return extractFromTxt(file.getInputStream());
        } else {
            // Fallback: try reading as plain text
            return extractFromTxt(file.getInputStream());
        }
    }

    private String extractFromDocx(InputStream inputStream) throws Exception {
        try (XWPFDocument document = new XWPFDocument(inputStream);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }

    private String extractFromDoc(InputStream inputStream) throws Exception {
        try (HWPFDocument document = new HWPFDocument(inputStream);
             WordExtractor extractor = new WordExtractor(document)) {
            return extractor.getText();
        }
    }

    private String extractFromPdf(InputStream inputStream) throws Exception {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractFromTxt(InputStream inputStream) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            return reader.lines().collect(Collectors.joining("\n"));
        } catch (Exception e) {
            return "";
        }
    }

    public String cleanStudentKey(String filename) {
        if (filename == null) return "";
        String base = filename.replaceAll("(?i)\\.(docx|doc|pdf|txt)$", "");
        // Hapus penanda copy seperti "- copy", "_copy", "(1)", "salinan"
        base = base.replaceAll("(?i)(?:[-_\\s]+copy|\\s*\\(\\d+\\)|[-_\\s]+salinan)", "");
        base = base.replace('_', ' ').replace('-', ' ');
        base = base.replaceAll("(?i)(tugas|assignment|makalah|paper|skripsi|final|project)\\s*\\d*", "");
        return base.toLowerCase().replaceAll("[^a-z0-9]", "");
    }

    public String extractStudentName(String filename) {
        if (filename == null || filename.isBlank()) {
            return "Mahasiswa Anonim";
        }

        // Remove extension
        String name = filename;
        int dotIndex = name.lastIndexOf('.');
        if (dotIndex > 0) {
            name = name.substring(0, dotIndex);
        }

        // Replace underscores and dashes with spaces
        name = name.replace('_', ' ').replace('-', ' ');

        // Clean up common student ID patterns or "Tugas" labels if present
        // e.g. "10502181001 Budi Santoso Tugas 1" -> Keep clean
        name = name.replaceAll("(?i)(tugas|assignment|makalah|paper|skripsi|final|project)\\s*\\d*", "").trim();

        // If after cleaning it's empty, use original base
        if (name.isBlank()) {
            return filename;
        }

        // Capitalize words nicely
        String[] parts = name.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String part : parts) {
            if (!part.isBlank()) {
                if (!sb.isEmpty()) sb.append(" ");
                sb.append(Character.toUpperCase(part.charAt(0)));
                if (part.length() > 1) {
                    sb.append(part.substring(1).toLowerCase());
                }
            }
        }
        return sb.toString();
    }
}
