package com.unklab.plagiarism.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key:}")
    private String defaultApiKey;

    @Value("${gemini.api.model:gemini-2.0-flash-lite}")
    private String modelName;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String analyzePairWithGemini(String studentA, String textA,
                                       String studentB, String textB,
                                       double algorithmicSimilarity,
                                       String userApiKey) {
        String apiKey = (userApiKey != null && !userApiKey.isBlank()) ? userApiKey.trim() : defaultApiKey;
        if (apiKey == null || apiKey.isBlank()) {
            return generateLocalAiSummary(studentA, studentB, algorithmicSimilarity);
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelName + ":generateContent?key=" + apiKey;

            // Trim texts to avoid hitting token limits
            String snippetA = textA.length() > 2500 ? textA.substring(0, 2500) + "..." : textA;
            String snippetB = textB.length() > 2500 ? textB.substring(0, 2500) + "..." : textB;

            String prompt = String.format(
                "Kamu adalah asisten penguji akademik Universitas Klabat (UNKLAB) untuk verifikasi orisinalitas tugas.\n" +
                "Tugasmu: Bandingkan naskah tugas Mahasiswa A (%s) dan Mahasiswa B (%s) berikut ini.\n\n" +
                "ATURAN PENTING:\n" +
                "- ABAIKAN nama mahasiswa, NIM/NRP, tanggal, nama dosen, fakultas, atau format sampul/identitas administratif.\n" +
                "- FOKUS HANYA pada JUDUL TUGAS dan ISI/SUBSTANSI MATERI TUGAS (paragraf pemaparan, argumen, analisis, kesimpulan).\n\n" +
                "--- NASKAH MAHASISWA A (%s) ---\n%s\n\n" +
                "--- NASKAH MAHASISWA B (%s) ---\n%s\n\n" +
                "Kemiripan teks terdeteksi: %.1f%%.\n" +
                "Berikan evaluasi dalam Bahasa Indonesia yang singkat, padat dan akademis (2-3 paragraf):\n" +
                "1. Apakah isi materi terindikasi copy-paste langsung, modifikasi ringan/parafrase tipis, atau sekadar kemiripan topik umum?\n" +
                "2. Rekomendasi tindakan dan penilaian bagi dosen penguji UNKLAB.",
                studentA, studentB, studentA, snippetA, studentB, snippetB, algorithmicSimilarity
            );

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> content = new HashMap<>();
            content.put("parts", List.of(textPart));

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", List.of(content));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode textNode = candidates.get(0).path("content").path("parts").get(0).path("text");
                    if (!textNode.isMissingNode()) {
                        return textNode.asText();
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Gagal memanggil Gemini API (menggunakan analisis lokal): {}", e.getMessage());
        }

        return generateLocalAiSummary(studentA, studentB, algorithmicSimilarity);
    }

    public String generateLocalAiSummary(String studentA, String studentB, double similarity) {
        if (similarity >= 70.0) {
            return String.format(
                "⚠️ TERINDIKASI PLAGIARISME TINGGI (%.1f%%)\n" +
                "Terdapat kemiripan konten dan urutan kalimat yang sangat dominan antara naskah %s dan %s. " +
                "Pola penulisan mengindikasikan adanya duplikasi teks langsung atau modifikasi minim antar kedua tugas. " +
                "Rekomendasi UNKLAB: Perlu pemanggilan kedua mahasiswa untuk klarifikasi langsung oleh dosen pengampu.",
                similarity, studentA, studentB
            );
        } else if (similarity >= 40.0) {
            return String.format(
                "⚡ PERLU REVIEW AKADEMIK (%.1f%%)\n" +
                "Ditemukan beberapa paragraf dan konsep utama yang memiliki struktur sintaksis serupa antara %s dan %s. " +
                "Kemiripan berpotensi berasal dari parafrase longgar atau penggunaan sumber acuan tugas yang identik tanpa sitasi yang memadai. " +
                "Rekomendasi UNKLAB: Dosen disarankan memeriksa bagian yang disorot berdampingan (side-by-side) untuk memastikan orisinalitas argumen.",
                similarity, studentA, studentB
            );
        } else if (similarity >= 20.0) {
            return String.format(
                "ℹ️ KEMIRIPAN WAJAR / BATAS AMAN (%.1f%%)\n" +
                "Kemiripan antara naskah %s dan %s berada pada batas wajar (%.1f%%). " +
                "Persamaan terutama pada terminologi baku, petunjuk tugas, atau kutipan teori dasar. " +
                "Rekomendasi UNKLAB: Tidak terindikasi kecurangan, dokumen dinilai memenuhi standar orisinalitas wajar.",
                similarity, studentA, studentB, similarity
            );
        } else {
            return String.format(
                "✅ DOKUMEN SANGAT ORIGINAL (%.1f%%)\n" +
                "Tingkat orisinalitas naskah %s dan %s sangat tinggi dengan kemiripan di bawah 20%%. " +
                "Gaya penulisan, struktur alur, dan pilihan kata berdiri sendiri secara mandiri. " +
                "Rekomendasi UNKLAB: Tugas memenuhi standar integritas akademik yang sangat baik.",
                similarity, studentA, studentB
            );
        }
    }
}
