package com.unklab.plagiarism;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.List;

public class Generate20FilesTest {

    @Test
    public void generate20Files() throws Exception {
        File dir = new File("../sample-documents/uji-coba-20-file");
        if (!dir.exists()) dir.mkdirs();

        // Template Topik & Paragraf Bervariasi
        String judulUmum = "Penerapan Arsitektur Microservices dan Cloud Computing dalam Skalabilitas Sistem Informasi Modern";

        // Paragraf-paragraf materi
        String blockMicroservices_Original = "Arsitektur microservices membagi sistem monolitik menjadi komponen-komponen terisolasi yang berkomunikasi melalui API ringan seperti REST atau gRPC. Pendekatan ini meningkatkan ketahanan sistem karena kegagalan pada satu modul pembayaran tidak akan melumpuhkan modul katalog produk.";
        String blockMicroservices_Copied = "Arsitektur microservices membagi sistem monolitik menjadi komponen-komponen terisolasi yang berkomunikasi melalui API ringan seperti REST atau gRPC. Pendekatan ini meningkatkan ketahanan sistem karena kegagalan pada satu modul pembayaran tidak akan melumpuhkan modul katalog produk.";
        String blockMicroservices_Paraphrase = "Pola arsitektur berbasis layanan mikro memecah aplikasi monolitik menjadi modul-modul independen yang saling bertukar data menggunakan antarmuka RESTful atau gRPC. Hal tersebut memastikan kegagalan pada fungsi transaksi finansial tidak berimbas pada kelancaran fungsi inventaris.";

        String blockDocker_Original = "Kontainerisasi menggunakan Docker memfasilitasi orkestrasi aplikasi secara portabel di lingkungan staging maupun production. Kubernetes bertindak sebagai pengatur beban kerja otomatis (autoscaling) ketika trafik jaringan melonjak drastis.";
        String blockDocker_Copied = "Kontainerisasi menggunakan Docker memfasilitasi orkestrasi aplikasi secara portabel di lingkungan staging maupun production. Kubernetes bertindak sebagai pengatur beban kerja otomatis (autoscaling) ketika trafik jaringan melonjak drastis.";
        String blockDocker_Paraphrase = "Penggunaan teknologi wadah kontainer Docker mempermudah deployment sistem yang konsisten lintas infrastruktur komputasi awan. Platform Kubernetes mengelola penambahan replika node secara dinamis saat beban akses pengguna meningkat tajam.";

        String blockSecurity_Original = "Keamanan pertukaran data diamankan dengan standar JSON Web Token (JWT) yang dienkripsi menggunakan algoritma asymmetric RSA-256. Gateway API bertanggung jawab memvalidasi otentikasi sebelum rute internal diteruskan ke microservice tujuan.";
        String blockSecurity_Copied = "Keamanan pertukaran data diamankan dengan standar JSON Web Token (JWT) yang dienkripsi menggunakan algoritma asymmetric RSA-256. Gateway API bertanggung jawab memvalidasi otentikasi sebelum rute internal diteruskan ke microservice tujuan.";

        String blockDatabase_Original = "Pola database-per-service diterapkan demi menjaga independensi penyimpanan data. Komunikasi antar basis data asinkronus menggunakan message broker Apache Kafka untuk menjamin konsistensi data eventual.";
        String blockDatabase_Alt = "Implementasi basis data terdistribusi memanfaatkan MongoDB untuk dokumen semi-terstruktur dan PostgreSQL untuk transaksi relasional. Replikasi data antar kluster disinkronisasi melalui mekanisme log streaming Debezium.";

        String blockAi_Original = "Integrasi model kecerdasan buatan Gemini API disematkan pada service analisis prediktif guna mendeteksi transaksi anomali secara real-time. Pipeline inferensi dioptimalkan dengan waktu respons di bawah 150 milidetik.";
        String blockAi_Alt = "Sistem rekomendasi konten dibangun menggunakan algoritma collaborative filtering berbasis TensorFlow Serving yang dideploy di atas cluster server GPU hemat daya.";

        String blockKesimpulan_Original = "Hasil pengujian beban (load testing) dengan 10.000 concurrent users menunjukkan waktu latensi rata-rata berada pada 220 ms tanpa adanya packet loss atau server downtime.";
        String blockKesimpulan_Alt = "Evaluasi ketahanan sistem membuktikan bahwa mekanisme circuit breaker Netflix Resilience4j sanggup memitigasi cascading failure ketika salah satu instance microservice mengalami crash.";

        // 20 Mahasiswa dengan profil bervariasi (10 Word DOCX, 10 PDF)
        // Data format: [No, NIM, Nama, Format ("DOCX"/"PDF"), Kasus Kemiripan / Prediksi Grade]
        Object[][] students = {
            // --- KELOMPOK 1: PLAGIAT BERAT / COPY-PASTE PERSIS (Grade E) ---
            {1, "10502181001", "Andika_Pratama", "DOCX", "PLAGIAT_COPY_1"},
            {2, "10502181002", "Bramantyo_Putra", "PDF", "PLAGIAT_COPY_1"}, // Copy persis Andika

            {3, "10502181003", "Cindy_Karamoy", "DOCX", "PLAGIAT_COPY_2"},
            {4, "10502181004", "Daniel_Sumendap", "PDF", "PLAGIAT_COPY_2"}, // Copy persis Cindy

            // --- KELOMPOK 2: MULTI-PLAGIARISME / COMBO (Grade D / E) ---
            // Mahasiswa 5 menjiplak bagian Microservice dari Cindy & Docker dari Daniel
            {5, "10502181005", "Elsa_Manopo", "DOCX", "MULTI_PLAGIAT"},
            {6, "10502181006", "Fernando_Wong", "PDF", "MULTI_PLAGIAT"},

            // --- KELOMPOK 3: PARAFRASE TIPIS / SEDANG (Grade C / D) ---
            {7, "10502181007", "Grace_Rumengan", "DOCX", "PARAFRASE_1"},
            {8, "10502181008", "Hans_Palar", "PDF", "PARAFRASE_1"}, // Parafrase tipis Grace
            {9, "10502181009", "Indah_Permata", "DOCX", "PARAFRASE_2"},
            {10, "10502181010", "Jonathan_Walangitan", "PDF", "PARAFRASE_2"},

            // --- KELOMPOK 4: KEMIRIPAN RINGAN / REFERENSI UMUM (Grade B) ---
            {11, "10502181011", "Kezia_Ticoalu", "DOCX", "RINGAN_1"},
            {12, "10502181012", "Leonardo_Pangkey", "PDF", "RINGAN_1"},
            {13, "10502181013", "Michelle_Polii", "DOCX", "RINGAN_2"},
            {14, "10502181014", "Nathan_Kaparang", "PDF", "RINGAN_2"},

            // --- KELOMPOK 5: SANGAT ORISINAL & MANDIRI (Grade A MURNI) ---
            {15, "10502181015", "Olivia_Senduk", "DOCX", "ORISINAL_A"},
            {16, "10502181016", "Peter_Lumentut", "PDF", "ORISINAL_B"},
            {17, "10502181017", "Queen_Wenas", "DOCX", "ORISINAL_C"},
            {18, "10502181018", "Rivaldo_Lengkong", "PDF", "ORISINAL_D"},
            {19, "10502181019", "Stefani_Kuntag", "DOCX", "ORISINAL_E"},
            {20, "10502181020", "Timothy_Mandagi", "PDF", "ORISINAL_F"}
        };

        for (Object[] st : students) {
            int no = (int) st[0];
            String nim = (String) st[1];
            String nama = (String) st[2];
            String format = (String) st[3];
            String tipe = (String) st[4];

            String docTitle = judulUmum;
            List<String> paragraphs = new ArrayList<>();

            if (tipe.equals("PLAGIAT_COPY_1")) {
                paragraphs.add(blockMicroservices_Copied);
                paragraphs.add(blockDocker_Copied);
                paragraphs.add(blockSecurity_Copied);
                paragraphs.add(blockKesimpulan_Original);
            } else if (tipe.equals("PLAGIAT_COPY_2")) {
                paragraphs.add(blockMicroservices_Copied);
                paragraphs.add(blockDatabase_Original);
                paragraphs.add(blockSecurity_Copied);
                paragraphs.add(blockKesimpulan_Original);
            } else if (tipe.equals("MULTI_PLAGIAT")) {
                paragraphs.add(blockMicroservices_Copied); // sama persis Cindy & Andika
                paragraphs.add(blockDocker_Copied);        // sama persis Bramantyo
                paragraphs.add(blockDatabase_Alt);         // mandiri
                paragraphs.add(blockKesimpulan_Alt);       // mandiri
            } else if (tipe.equals("PARAFRASE_1") || tipe.equals("PARAFRASE_2")) {
                paragraphs.add(blockMicroservices_Paraphrase);
                paragraphs.add(blockDocker_Paraphrase);
                paragraphs.add(blockDatabase_Alt);
                paragraphs.add(blockKesimpulan_Alt);
            } else if (tipe.equals("RINGAN_1") || tipe.equals("RINGAN_2")) {
                docTitle = "Kajian Efisiensi Infrastruktur Container dan Pipeline CI/CD Skala Besar";
                paragraphs.add(blockDocker_Paraphrase);
                paragraphs.add("Siklus deployment otomatis menggunakan GitHub Actions dikonfigurasi untuk menjalankan automated unit testing dan vulnerability scanning sebelum image didorong ke Docker Hub.");
                paragraphs.add(blockKesimpulan_Alt);
            } else {
                // ORISINAL_A s/d F
                docTitle = "Arsitektur Sistem Rekomendasi Terdistribusi Berbasis Event-Driven Menggunakan Kafka dan GPU Cluster";
                paragraphs.add("Pengolahan data streaming bervolume tinggi memerlukan arsitektur event-driven yang sanggup menahan lonjakan write-heavy tanpa membebani layanan transaksional utama.");
                paragraphs.add(blockDatabase_Alt);
                paragraphs.add(blockAi_Alt);
                paragraphs.add("Evaluasi latensi inferensi membuktikan throughput pengolahan data melonjak hingga empat kali lipat dibandingkan arsitektur polling periodik konvensional.");
            }

            String filename = String.format("../sample-documents/uji-coba-20-file/%s_%s_Tugas.%s", nim, nama, format.toLowerCase());

            if (format.equals("DOCX")) {
                writeDocx(filename, nama, nim, docTitle, paragraphs);
            } else {
                writePdf(filename, nama, nim, docTitle, paragraphs);
            }
        }

        System.out.println("SUKSES: 20 File (10 DOCX + 10 PDF) Berhasil Dibuat di sample-documents/uji-coba-20-file/");
    }

    private void writeDocx(String path, String nama, String nim, String title, List<String> paragraphs) throws Exception {
        XWPFDocument doc = new XWPFDocument();

        // Header identitas mahasiswa (Akan difilter otomatis oleh AI agar tidak terdeteksi plagiat)
        XWPFParagraph header = doc.createParagraph();
        XWPFRun rHeader = header.createRun();
        rHeader.setText("Nama: " + nama.replace("_", " ") + "\nNIM: " + nim + "\nFakultas Ilmu Komputer, Universitas Klabat (UNKLAB)\n\n");
        rHeader.setFontFamily("Times New Roman");
        rHeader.setFontSize(11);

        // Judul Tugas
        XWPFParagraph pTitle = doc.createParagraph();
        XWPFRun rTitle = pTitle.createRun();
        rTitle.setBold(true);
        rTitle.setFontSize(14);
        rTitle.setText(title);

        // Paragraf Materi
        for (String pText : paragraphs) {
            XWPFParagraph p = doc.createParagraph();
            XWPFRun r = p.createRun();
            r.setText(pText);
            r.setFontFamily("Times New Roman");
            r.setFontSize(12);
        }

        try (FileOutputStream out = new FileOutputStream(path)) {
            doc.write(out);
        }
    }

    private void writePdf(String path, String nama, String nim, String title, List<String> paragraphs) throws Exception {
        try (PDDocument doc = new PDDocument()) {
            PDPage page = new PDPage();
            doc.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(doc, page)) {
                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA_BOLD, 11);
                cs.setLeading(14.5f);
                cs.newLineAtOffset(50, 750);

                // Header Identitas
                cs.showText("Nama: " + nama.replace("_", " "));
                cs.newLine();
                cs.showText("NIM: " + nim);
                cs.newLine();
                cs.showText("Fakultas Ilmu Komputer, Universitas Klabat (UNKLAB)");
                cs.newLine();
                cs.newLine();

                // Judul
                cs.setFont(PDType1Font.HELVETICA_BOLD, 12);
                cs.showText("Judul: " + (title.length() > 65 ? title.substring(0, 65) + "..." : title));
                cs.newLine();
                cs.newLine();

                // Isi Paragraf
                cs.setFont(PDType1Font.HELVETICA, 10);
                cs.setLeading(14.0f);

                for (String p : paragraphs) {
                    // Simple wrap text
                    List<String> lines = wrapText(p, 80);
                    for (String line : lines) {
                        cs.showText(line);
                        cs.newLine();
                    }
                    cs.newLine();
                }

                cs.endText();
            }

            doc.save(path);
        }
    }

    private List<String> wrapText(String text, int maxChars) {
        List<String> list = new ArrayList<>();
        String[] words = text.split(" ");
        StringBuilder current = new StringBuilder();

        for (String w : words) {
            if (current.length() + w.length() + 1 > maxChars) {
                list.add(current.toString());
                current = new StringBuilder(w);
            } else {
                if (current.length() > 0) current.append(" ");
                current.append(w);
            }
        }
        if (current.length() > 0) list.add(current.toString());
        return list;
    }
}
