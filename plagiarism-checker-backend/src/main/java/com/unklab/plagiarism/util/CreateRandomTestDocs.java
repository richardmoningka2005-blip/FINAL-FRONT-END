package com.unklab.plagiarism.util;

import org.apache.poi.xwpf.usermodel.ParagraphAlignment;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.io.File;
import java.io.FileOutputStream;

public class CreateRandomTestDocs {

    public static void main(String[] args) {
        File dir = new File("../sample-documents/uji-coba-3-file");
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // File 1: Dokumen Asli Mahasiswa 1 (Michael)
        createDoc(
            new File(dir, "10502181010_Michael_Kaparang_Paper.docx"),
            "Pemanfaatan Kecerdasan Buatan dan Deep Learning dalam Diagnosis Citra Medis",
            "Oleh: Michael Kaparang (NIM: 10502181010)\nFakultas Ilmu Komputer, Universitas Klabat (UNKLAB)",
            new String[]{
                "Penerapan teknologi kecerdasan buatan (Artificial Intelligence) dalam ranah medis telah mencatat kemajuan yang sangat pesat dalam kurun waktu lima tahun terakhir. Model deep learning dengan arsitektur Convolutional Neural Network (CNN) terbukti mampu mengklasifikasi citra rontgen dada, computed tomography (CT scan), dan pencitraan resonansi magnetik (MRI) dengan tingkat akurasi yang mendekati dokter spesialis radiologi.",
                "Keunggulan utama dari integrasi sistem diagnosa berbasis AI terletak pada kemampuan deteksi dini terhadap lesi tumor mikroskopis serta anomali jaringan paru-paru yang kerap terlewatkan pada evaluasi visual manual. Algoritma komputer dapat memproses ribuan piksel citra dalam hitungan detik untuk menghasilkan probabilitas klasifikasi patologi secara objektif.",
                "Kendati demikian, implementasi klinis di lingkungan rumah sakit tetap menghadapi tantangan fundamental terkait keamanan privasi data rekam medis pasien. Setiap institusi kesehatan wajib mematuhi protokol perlindungan privasi yang ketat dan memastikan model kecerdasan buatan memiliki sifat explainability agar keputusan diagnosis dapat dipertanggungjawabkan secara etika kedokteran."
            }
        );

        // File 2: Dokumen Mahasiswa 2 (Kevin) -> Plagiat dari Michael (~75-80% mirip)
        createDoc(
            new File(dir, "10502181011_Kevin_Rumambi_Paper.docx"),
            "Implementasi Teknologi Deep Learning untuk Diagnosis Citra Medis Rumah Sakit",
            "Disusun Oleh: Kevin Rumambi (NIM: 10502181011)\nFakultas Ilmu Komputer, Universitas Klabat (UNKLAB)",
            new String[]{
                "Penerapan teknologi kecerdasan buatan dalam ranah medis telah mencatat kemajuan yang sangat pesat dalam kurun waktu lima tahun terakhir. Model deep learning dengan arsitektur Convolutional Neural Network mampu mengklasifikasi citra rontgen dada, CT scan, dan pencitraan resonansi magnetik dengan tingkat akurasi yang mendekati dokter spesialis.",
                "Keunggulan utama dari integrasi sistem diagnosa berbasis AI terletak pada kemampuan deteksi dini terhadap lesi tumor mikroskopis serta anomali jaringan paru-paru yang kerap terlewatkan pada evaluasi visual manual. Algoritma komputer dapat memproses ribuan piksel citra dalam hitungan detik untuk menghasilkan probabilitas klasifikasi patologi secara objektif.",
                "Sebagai kesimpulan, implementasi klinis di lingkungan rumah sakit menghadapi tantangan fundamental terkait privasi data rekam medis pasien. Institusi kesehatan wajib mematuhi protokol perlindungan privasi yang ketat agar keputusan diagnosis dapat dipertanggungjawabkan secara etika kedokteran."
            }
        );

        // File 3: Dokumen Mahasiswa 3 (Priskila) -> Topik Berbeda & 100% Original
        createDoc(
            new File(dir, "10502181012_Priskila_Pangemanan_Paper.docx"),
            "Strategi Implementasi Paradigma Keamanan Siber Zero Trust pada Infrastruktur Cloud",
            "Penulis: Priskila Pangemanan (NIM: 10502181012)\nFakultas Ilmu Komputer, Universitas Klabat (UNKLAB)",
            new String[]{
                "Dalam arsitektur komputasi awan modern, batas perimeter jaringan tradisional telah bergeser secara radikal. Pendekatan keamanan model lama yang mempercayai seluruh entitas di dalam jaringan lokal kini dianggap tidak lagi memadai untuk menangkal ancaman siber yang kian canggih.",
                "Paradigma Zero Trust bertumpu pada prinsip dasar 'never trust, always verify'. Setiap permintaan akses terhadap data perusahaan, terlepas dari lokasi asal permintaan tersebut, harus melewati autentikasi multifaktor yang ketat, otorisasi dinamis berbasis konteks, serta enkripsi data secara menyeluruh (end-to-end encryption) menggunakan standar AES-256.",
                "Dengan menerapkan pemantauan anomali lalu lintas jaringan secara real-time dan segmentasi mikro antar modul aplikasi, risiko pergerakan lateral oleh peretas maupun ransomware dapat diminimalisir secara signifikan, memastikan kedaulatan data institusi tetap terlindungi."
            }
        );

        System.out.println("✅ Berhasil membuat 3 dokumen Word (.docx) acak untuk pengujian di folder sample-documents/uji-coba-3-file!");
    }

    private static void createDoc(File file, String title, String author, String[] paragraphs) {
        try (XWPFDocument doc = new XWPFDocument();
             FileOutputStream out = new FileOutputStream(file)) {

            // Title
            XWPFParagraph pTitle = doc.createParagraph();
            pTitle.setAlignment(ParagraphAlignment.CENTER);
            pTitle.setSpacingAfter(150);
            XWPFRun rTitle = pTitle.createRun();
            rTitle.setText(title);
            rTitle.setBold(true);
            rTitle.setFontSize(14);
            rTitle.setFontFamily("Times New Roman");

            // Author & Affiliate
            XWPFParagraph pAuthor = doc.createParagraph();
            pAuthor.setAlignment(ParagraphAlignment.CENTER);
            pAuthor.setSpacingAfter(300);
            XWPFRun rAuthor = pAuthor.createRun();
            rAuthor.setText(author);
            rAuthor.setItalic(true);
            rAuthor.setFontSize(10);
            rAuthor.setFontFamily("Times New Roman");

            // Paragraphs
            for (String pText : paragraphs) {
                XWPFParagraph p = doc.createParagraph();
                p.setAlignment(ParagraphAlignment.BOTH);
                p.setSpacingAfter(200);
                p.setFirstLineIndent(400); // Tab indent
                XWPFRun r = p.createRun();
                r.setText(pText);
                r.setFontSize(11);
                r.setFontFamily("Times New Roman");
            }

            doc.write(out);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
