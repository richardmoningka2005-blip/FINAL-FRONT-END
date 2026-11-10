package com.unklab.plagiarism;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.io.FileOutputStream;

public class GenerateBintangGradeATest {

    @Test
    public void generateGradeAFile() throws Exception {
        File dir = new File("../sample-documents/uji-coba-20-file");
        if (!dir.exists()) dir.mkdirs();

        String nim = "10502181021";
        String nama = "Bintang_Mahaputra";
        String path = "../sample-documents/uji-coba-20-file/10502181021_Bintang_Mahaputra_Tugas_GRADE_A_MURNI.docx";

        String docTitle = "Rancang Bangun Sistem Verifikasi Biometrik Suara Berbasis Jaringan Saraf Tiruan Spiking (SNN) Pada Perangkat Edge Komputasi";

        String p1 = "Teknologi pengenalan biometrik suara telah berkembang melampaui arsitektur deep learning konvensional menuju pemodelan neuromorfik berbasis Spiking Neural Network (SNN). Karakteristik komputasi berbasis lonjakan potensial aksi ini menawarkan efisiensi konsumsi daya hingga sembilan puluh persen lebih hemat dibandingkan jaringan konvolusional standar.";

        String p2 = "Pada penelitian ini, ekstraksi fitur akustik vokal menggunakan filterbank Gammatone yang merepresentasikan respons koklea telinga manusia secara biologis. Matriks koefisien spektral kemudian dikonversi menjadi deret temporal spike menggunakan skema pengkodean latensi saraf (neuronal latency encoding).";

        String p3 = "Pengujian eksperimental pada mikroprosesor neuromorfik edge Intel Loihi menghasilkan tingkat akurasi verifikasi pembicara sebesar sembilan puluh tujuh koma delapan persen dengan False Acceptance Rate (FAR) di bawah nol koma dua persen. Arsitektur ini terbukti kebal terhadap serangan penyusupan audio tiruan (voice spoofing attack).";

        String p4 = "Dapat disimpulkan bahwa implementasi spiking neural network pada perangkat komputasi tepi membuka peluang integrasi keamanan biometrik mandiri pada perangkat Internet of Things tanpa ketergantungan transmisi ke server cloud terpusat.";

        XWPFDocument doc = new XWPFDocument();

        // Header Identitas
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
        rTitle.setText(docTitle);

        // Paragraf
        String[] pars = {p1, p2, p3, p4};
        for (String pText : pars) {
            XWPFParagraph p = doc.createParagraph();
            XWPFRun r = p.createRun();
            r.setText(pText);
            r.setFontFamily("Times New Roman");
            r.setFontSize(12);
        }

        try (FileOutputStream out = new FileOutputStream(path)) {
            doc.write(out);
        }

        System.out.println("SUKSES: File Grade A Murni Bintang Mahaputra Berhasil Dibuat di " + path);
    }
}
