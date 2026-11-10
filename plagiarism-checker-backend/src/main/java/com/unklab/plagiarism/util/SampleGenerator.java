package com.unklab.plagiarism.util;

import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.apache.poi.xwpf.usermodel.XWPFRun;

import java.io.File;
import java.io.FileOutputStream;

public class SampleGenerator {

    public static void main(String[] args) {
        File dir = new File("../sample-documents");
        if (!dir.exists()) {
            dir.mkdirs();
        }

        // 1. Budi Santoso
        createDocx(new File(dir, "Budi_Santoso_Tugas_Frontend.docx"),
            "Pengembangan Aplikasi Web Modern Menggunakan React dan Component-Driven Design\n" +
            "Oleh: Budi Santoso (NIM: 10502181001)\n\n" +
            "React merupakan sebuah pustaka JavaScript sumber terbuka yang dikembangkan oleh Facebook untuk membangun antarmuka pengguna interaktif secara efisien. " +
            "Salah satu keunggulan utama React adalah implementasi Virtual DOM. Virtual DOM bekerja dengan membuat representasi virtual dari pohon DOM asli di memori. " +
            "Ketika terjadi pembaruan status data (state), React akan membandingkan perbedaan menggunakan algoritma rekonsiliasi dan hanya merender elemen yang benar-benar mengalami perubahan. " +
            "Konsep Component-Driven Development memungkinkan pengembang memecah antarmuka yang kompleks menjadi komponen-komponen mandiri yang dapat digunakan kembali berkali-kali. " +
            "Dengan memanfaatkan React Hooks seperti useState untuk pengelolaan status lokal dan useEffect untuk efek samping, alur kerja kode menjadi jauh lebih terstruktur dan mudah dipelihara."
        );

        // 2. Andi Wijaya (Copied heavily from Budi)
        createDocx(new File(dir, "Andi_Wijaya_Tugas_Frontend.docx"),
            "Makalah Pemrograman Front End: React dan Arsitektur Komponen\n" +
            "Disusun Oleh: Andi Wijaya (NIM: 10502181002)\n\n" +
            "React merupakan sebuah pustaka JavaScript sumber terbuka yang dikembangkan oleh Facebook untuk membangun antarmuka pengguna interaktif secara efisien. " +
            "Salah satu keunggulan utama React adalah implementasi Virtual DOM. Virtual DOM bekerja dengan membuat representasi virtual dari pohon DOM asli di memori. " +
            "Ketika terjadi pembaruan status data (state), React akan membandingkan perbedaan menggunakan algoritma rekonsiliasi dan hanya merender elemen yang benar-benar mengalami perubahan. " +
            "Konsep Component-Driven Development memungkinkan pengembang memecah antarmuka yang kompleks menjadi komponen-komponen mandiri yang dapat digunakan kembali berkali-kali. " +
            "Sebagai kesimpulan, penggunaan React sangat membantu dalam mempermudah tugas pembuatan website kampus UNKLAB."
        );

        // 3. Sari Dewi (Original independent content)
        createDocx(new File(dir, "Sari_Dewi_Tugas_Frontend.docx"),
            "Analisis Performa Rendering Client-Side pada Single Page Application\n" +
            "Penulis: Sari Dewi (NIM: 10502181003)\n\n" +
            "Di era komputasi modern, Single Page Application (SPA) telah menjadi standar de facto dalam perancangan aplikasi peramban web. " +
            "Tantangan terbesar dalam arsitektur ini berpusat pada optimasi pemuatan awal (initial bundle size) dan waktu interaktivitas pengguna (Time to Interactive). " +
            "Teknik Code Splitting dan Lazy Loading memanfaatkan dynamic import ES modules untuk memecah bundle JavaScript menjadi potongan-potongan terpisah yang dimuat sesuai kebutuhan rute halaman. " +
            "Selain itu, integrasi Service Workers memungkinkan caching aset statis secara agresif, memastikan aplikasi tetap responsif bahkan dalam kondisi jaringan nirkabel yang fluktuatif."
        );

        // 4. James Polii (Partially paraphrased)
        createDocx(new File(dir, "James_Polii_Tugas_Frontend.docx"),
            "Penerapan Modern Web Framework dan State Management\n" +
            "Oleh: James Polii (NIM: 10502181004)\n\n" +
            "React diciptakan oleh Meta untuk menyederhanakan konstruksi antarmuka pengguna yang kompleks. " +
            "Virtual DOM beroperasi dengan menyimpan salinan pohon struktur halaman di memori, sehingga kalkulasi render ulang tidak membebani browser pengguna. " +
            "Penggunaan komponen modular menyederhanakan arsitektur kode berskala besar pada sistem enterprise. " +
            "Dalam praktiknya di lingkungan UNKLAB, integrasi Tailwind CSS bersama Vite menghadirkan kecepatan build dan keindahan antarmuka yang optimal."
        );

        System.out.println("✅ Berhasil membuat 4 file sampel Word (.docx) di folder sample-documents!");
    }

    private static void createDocx(File file, String content) {
        try (XWPFDocument doc = new XWPFDocument();
             FileOutputStream out = new FileOutputStream(file)) {
            String[] paras = content.split("\n+");
            for (String pText : paras) {
                XWPFParagraph p = doc.createParagraph();
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
