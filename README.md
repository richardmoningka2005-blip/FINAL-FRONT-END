# 🎓 UNKLAB AI Plagiarism Checker (Multi-File Cross-Comparison)

Sistem Pengecekan Plagiarisme Multi-File Tugas Mahasiswa **Universitas Klabat (UNKLAB)** berbasis **React**, **Spring Boot**, **H2 Database**, dan **Google Gemini AI**.

---

## 📌 Fitur Utama Sesuai Arahan Dosen

1. 📂 **Pemeriksaan Batch Sekaligus:** Dosen dapat mengunggah sekaligus seluruh berkas tugas mahasiswa dalam format **Word (.docx, .doc)** atau **PDF (.pdf)**.
2. 🔄 **Perbandingan Silang Otomatis (Cross-Comparison):** Sistem membandingkan setiap pasangan mahasiswa (Mahasiswa A vs Mahasiswa B, Mahasiswa A vs Mahasiswa C, dst).
3. 📊 **Hasil Lengkap per Pasangan:**
   - Nama Mahasiswa A dan Mahasiswa B yang terindikasi sama
   - Persentase Plagiat (% Kemiripan)
   - Persentase Originalitas (% Orisinal)
   - Grade Mutu (**A**, **B**, **C**, **D**, **E**)
   - Status Risiko (Aman, Perlu Review, Terindikasi Plagiat)
4. 🔍 **Tampilan Berdampingan (Side-by-Side View):**
   - Menampilkan naskah Mahasiswa A dan Mahasiswa B **secara bersamaan berdampingan**
   - Menyoroti kalimat atau paragraf yang sama secara simultan
   - Tab rincian kalimat-kalimat yang identik atau hasil parafrase
5. 🗄️ **Database Lokal H2 (Spring Boot):**
   - Menggunakan **Spring Boot Data JPA + H2 Database** (bukan `json-server`)
   - Data sesi dan riwayat pemeriksaan tersimpan permanen
   - Konsol H2 dapat diakses via web browser
6. 🤖 **Integrasi AI (Google Gemini):**
   - Analisis nuansa akademik apakah kemiripan berasal dari copy-paste langsung, modifikasi ringan, atau kesamaan referensi tugas
   - Rekomendasi tindakan bagi dosen pengampu

---

## 🏗️ Struktur Proyek

```
front end/
├── sample-documents/                  # 4 Dokumen Word (.docx) siap pakai untuk demo
│   ├── Andi_Wijaya_Tugas_Frontend.docx
│   ├── Budi_Santoso_Tugas_Frontend.docx
│   ├── James_Polii_Tugas_Frontend.docx
│   └── Sari_Dewi_Tugas_Frontend.docx
│
├── plagiarism-checker-backend/        # Backend Spring Boot (Java 21)
│   ├── src/main/java/com/unklab/plagiarism/
│   │   ├── controller/PlagiarismController.java
│   │   ├── model/ (CheckSession, StudentSubmission, ComparisonResult)
│   │   ├── repository/ (Spring Data JPA)
│   │   └── service/ (FileExtractionService, PlagiarismService, GeminiService)
│   ├── src/main/resources/application.properties
│   └── pom.xml
│
├── plagiarism-checker-frontend/       # Frontend React 19 + Tailwind CSS + Vite
│   ├── src/
│   │   ├── components/ (Navbar, Footer)
│   │   ├── pages/ (Home, Check, Results, Compare, History, About)
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── run-backend.bat                    # Script 1-klik jalankan Backend
└── run-frontend.bat                   # Script 1-klik jalankan Frontend
```

---

## 🚀 Cara Menjalankan Proyek

### 1. Jalankan Backend (Spring Boot + H2)
Buka terminal baru atau double-click file `run-backend.bat`:
```bash
cd plagiarism-checker-backend
mvn spring-boot:run
```
- Server berjalan di: `http://localhost:8080`
- Web Console H2 Database: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:file:./data/plagiarismdb`
  - User: `sa`, Password: (kosong)

### 2. Jalankan Frontend (React + Vite)
Buka terminal kedua atau double-click file `run-frontend.bat`:
```bash
cd plagiarism-checker-frontend
npm run dev
```
- Akses website di browser: `http://localhost:5173`

---

## 🧪 Cara Demo ke Dosen Penguji

1. Buka browser di `http://localhost:5173`.
2. Klik tombol **"Unggah & Periksa Berkas Sekarang"**.
3. Di area unggah file, pilih/tarik ke-4 file sampel yang ada di folder `sample-documents/`:
   - `Budi_Santoso_Tugas_Frontend.docx`
   - `Andi_Wijaya_Tugas_Frontend.docx` (sengaja dibuat 70%+ mirip dengan Budi)
   - `Sari_Dewi_Tugas_Frontend.docx` (tugas asli/mandiri)
   - `James_Polii_Tugas_Frontend.docx` (parafrase moderat)
4. Masukkan judul tugas (misal: "Tugas 1 - Pemrograman Web UNKLAB").
5. Klik **"Periksa Plagiarisme Multi-File Sekarang"**.
6. Sistem akan menampilkan:
   - Pasangan **Budi Santoso vs Andi Wijaya** mendapatkan skor plagiat tinggi dan **Grade D / E** (terindikasi plagiat).
   - Pasangan lainnya mendapatkan skor kemiripan rendah dan **Grade A / B** (aman).
7. Klik tombol **"Bandingkan Berdampingan"** pada pasangan Budi vs Andi:
   - Dosen akan melihat dokumen Budi dan dokumen Andi **berdampingan secara bersamaan**.
   - Paragraf yang sama disorot warna merah dengan tanda **"Plagiat Sama"**.
   - Tab "Daftar Kalimat Plagiat" menampilkan perbandingan kalimat per kalimat beserta analisis AI!
