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

public class Generate20UniqueDownloadsTest {

    @Test
    public void generate20UniqueFiles() throws Exception {
        String downloadPath = "C:/Users/ASUS TUF/Downloads/sample-20-file-berbeda";
        File dir = new File(downloadPath);
        if (!dir.exists()) dir.mkdirs();

        // 20 Topik Unik & Berbeda, tidak saling berkaitan:
        // Format: [NIM, Nama, Format, Judul, P1, P2, P3]
        String[][] data = {
            {
                "10502182001", "Adrian_Lumenta", "DOCX",
                "Pemanfaatan Algoritma Genetika dalam Optimasi Penjadwalan Rute Distribusi Logistik Maritim",
                "Efisiensi logistik antar-pulau di kawasan kepulauan Indonesia timur menghadapi tantangan variabilitas cuaca dan biaya bahan bakar kapal. Penelitian ini memodelkan sistem perutean dinamis menggunakan Algoritma Genetika (Genetic Algorithm) dengan representasi kromosom permutasi pelabuhan singgah.",
                "Operator crossover yang digunakan adalah Order Crossover (OX) dan mutasi berbasis swap acak guna menghindari konvergensi prematur pada solusi lokal optimum. Fungsi kelayakan mengevaluasi jarak tempuh total, batas kapasitas muatan kapal, dan jendela waktu sandar dermaga.",
                "Hasil simulasi komputasi dengan 25 titik koordinat dermaga membuktikan bahwa pendekatan heuristik ini mampu memangkas jarak jelajah hingga sembilan belas persen dan mereduksi durasi operasional armada secara signifikan."
            },
            {
                "10502182002", "Bella_Pangemanan", "PDF",
                "Analisis Sentimen Opini Publik Mengenai Transisi Kendaraan Listrik Menggunakan Model RoBERTa",
                "Peralihan menuju ekosistem kendaraan bermotor listrik (Electric Vehicle) memicu beragam opini pro dan kontra di berbagai platform media sosial nasional. Penelitian ini mengkaji polaritas opini masyarakat melalui penambangan data teks berskala besar.",
                "Korpus teks berbahasa Indonesia diprapresisikan dengan teknik normalisasi slang, penghapusan stopword kontekstual, dan tokenisasi Byte-Pair Encoding. Klasifikasi sentimen dilakukan dengan fine-tuning arsitektur model transformer IndoRoBERTa yang telah dilatih awal.",
                "Pengujian menghasilkan skor F1-Score sebesar 91.4% dalam mendeteksi sentimen positif terkait insentif fiskal dan sentimen negatif terkait ketersediaan stasiun pengisian daya baterai umum (SPKLU)."
            },
            {
                "10502182003", "Christian_Waworuntu", "DOCX",
                "Rancang Bangun Sistem Presensi Mahasiswa Berbasis Pengenalan Iris Mata Menggunakan Filter Gabor 2D",
                "Kebutuhan otentikasi identitas berakurasi tinggi di lingkungan laboratorium universitas mendorong pengembangan verifikasi biometrik berbasis pola tekstur iris mata. Pola kripta dan cincin siliaris pada stroma iris memiliki keunikan biologis yang sangat stabil seumur hidup.",
                "Citra mata inframerah dekat disegmentasi menggunakan transformasi Hough melingkar untuk mengisolasi batas pupil dan limbus kornea. Normalisasi koordinat Cartesian ke sistem polar Daugman memungkinkan ekstraksi fitur invarian rotasi menggunakan wavelet Gabor dua dimensi.",
                "Jarak Hamming terkuantisasi digunakan untuk pencocokan biner cepat. Sistem sanggup memverifikasi identitas dalam waktu 0.28 detik dengan tingkat False Rejection Rate (FRR) di bawah 0.15%."
            },
            {
                "10502182004", "Diana_Kambey", "PDF",
                "Implementasi Smart Greenhouse Berbasis Logika Fuzzy Mamdani untuk Budidaya Paprika Hidroponik",
                "Pertumbuhan tanaman paprika dalam sistem hidroponik substrat sangat sensitif terhadap fluktuasi mikroklimat seperti kelembaban udara dan intensitas radiasi surya. Penelitian ini mengimplementasikan pengendali otomatis berbasis mikrokontroler STM32.",
                "Inferensi Logika Fuzzy Mamdani mengolah variabel masukan suhu ruangan dan defisit tekanan uap air (VPD) untuk menentukan durasi pengabutan fogger dan perputaran exhaust fan. Fungsi keanggotaan dirancang berdasarkan kurva fisiologis tanaman.",
                "Eksperimen agronomi selama 60 hari menunjukkan penurunan stres transpirasi daun paprika dan peningkatan bobot biomassa buah panen sebesar 22 persen dibandingkan metode penjadwalan timer konvensional."
            },
            {
                "10502182005", "Evan_Palandeng", "DOCX",
                "Keamanan Transaksi Rekam Medis Elektronik (RME) Rumah Sakit Menggunakan Blockchain Konsensus Proof-of-Authority",
                "Integritas dan auditabilitas catatan medis pasien merupakan keharusan mutlak dalam pencegahan manipulasi riwayat klinis dan kebocoran privasi. Penelitian ini mengusulkan ledger terdistribusi berbasis jaringan konsensus Proof-of-Authority (PoA).",
                "Data rekam medis terenkripsi AES-256 disimpan pada InterPlanetary File System (IPFS), sedangkan alamat digest hash cryptographic dicatatkan ke dalam smart contract Ethereum Enterprise. Validator node hanya diberikan kepada institusi medis terakreditasi.",
                "Evaluasi performa jaringan menunjukkan throughput transaksi mencapai 420 transaksi per detik dengan latensi finalitas blok di bawah 2 detik, memenuhi syarat regulasi interoperabilitas satu sehat."
            },
            {
                "10502182006", "Felicia_Rotinsulu", "PDF",
                "Deteksi Dini Retinopati Diabetik Melalui Citra Fundus Menggunakan Arsitektur Vision Transformer (ViT)",
                "Retinopati diabetik merupakan penyebab utama kebutaan permanen pada penderita diabetes melitus yang kerap terlambat terdiagnosa. Penelitian ini mengembangkan skrining otomatis kelainan mikroaneurisma dan eksudat keras pada retina mata.",
                "Arsitektur Vision Transformer membagi citra fundus digital beresolusi tinggi menjadi patch-patch kecil yang dihubungkan melalui mekanisme self-attention multi-head guna menangkap ketergantungan visual jarak jauh pada pembuluh darah retina.",
                "Model mencapai nilai Area Under ROC Curve (AUC) sebesar 0.962 pada dataset publik Messidor, membuktikan kapabilitas algoritma dalam membantu dokter spesialis mata di daerah terpencil."
            },
            {
                "10502182007", "Gilbert_Mandey", "DOCX",
                "Sistem Kendali Robot Penjelajah Bawah Air (ROV) Otonom Berbasis ArduSub dan Sonar Pemindaian Samping",
                "Eksplorasi terumbu karang laut dalam memerlukan kendaraan bawah air nirawak yang sanggup bermanuver stabil di tengah arus laut laminer yang deras. Penelitian ini merancang propulsi vektor enam pendorong pada lambung akrilik tahan tekanan.",
                "Sensor pemindaian akustik side-scan sonar dikombinasikan dengan modul Inertial Measurement Unit (IMU) sembilan derajat kebebasan untuk navigasi dead-reckoning saat sinyal GPS tidak dapat menembus permukaan air laut.",
                "Uji coba lapangan pada kedalaman 30 meter di perairan Teluk Manado mengonfirmasi stabilitas depth-hold dengan deviasi kedalaman kurang dari sepuluh sentimeter."
            },
            {
                "10502182008", "Hanna_Tambuwun", "PDF",
                "Prediksi Kegagalan Mesin Turbin Pembangkit Listrik Menggunakan Model Long Short-Term Memory (LSTM)",
                "Downtime tak terjadwal pada turbin uap pembangkit listrik tenaga panas bumi menimbulkan kerugian ekonomi miliaran rupiah per jam. Pendekatan pemeliharaan prediktif (predictive maintenance) diterapkan untuk memprediksi degradasi bearing.",
                "Data time-series multi-variat dari sensor getaran akustik, temperatur pelumas, dan tekanan oli diumpankan ke dalam jaringan saraf berulang LSTM dua lapis yang dilengkapi lapisan dropout untuk mencegah overfitting sinyal noisy.",
                "Sistem sanggup membunyikan indikasi anomali 72 jam sebelum kegagalan mekanis katastrofik terjadi dengan tingkat false alarm rate yang sangat rendah."
            },
            {
                "10502182009", "Ivan_Sumual", "DOCX",
                "Optimasi Topologi Jaringan Sensor Nirkabel Menggunakan Protokol LEACH-Enhanced untuk Mitigasi Kebakaran Hutan",
                "Jaringan sensor nirkabel (WSN) yang disebar di pedalaman hutan lindung memiliki keterbatasan pasokan energi baterai yang mustahil diganti secara reguler. Efisiensi energi per rute pengiriman data suhu dan gas karbon monoksida menjadi fokus utama.",
                "Protokol routing hierarkis LEACH dimodifikasi dengan memperhitungkan sisa energi residu node sensor dan jarak spasial terhadap stasiun pangkalan (base station) dalam pemilihan kepala kluster (cluster head).",
                "Simulasi jaringan menggunakan NS-3 menunjukkan perpanjangan masa hidup jaringan hingga 38 persen lebih lama dibandingkan topologi routing datar konvensional."
            },
            {
                "10502182010", "Julia_Mamesah", "PDF",
                "Sistem Rekomendasi Menu Nutrisi Pasien Pasca Operasi Bedah Menggunakan Algoritma K-Nearest Neighbors",
                "Kebutuhan makronutrien dan mikronutrien bagi pasien pasca pembedahan mayor memerlukan perhitungan presisi yang disesuaikan dengan indeks massa tubuh, laju filtrasi glomerulus ginjal, dan riwayat komorbiditas diabetes.",
                "Algoritma K-Nearest Neighbors (KNN) dengan metrik jarak Euclidean berbobot mengelompokkan profil fisiologis pasien terhadap basis data menu diet rumah sakit yang telah divalidasi oleh ahli gizi klinis.",
                "Tingkat penerimaan asupan kalori harian pasien meningkat 28 persen dan mempercepat waktu pemulihan luka bedah secara klinis."
            },
            {
                "10502182011", "Kevin_Sumampouw", "DOCX",
                "Simulasi Aerodinamika Bodi Sayap Mobil Listrik Formula Student Menggunakan Computational Fluid Dynamics (CFD)",
                "Gaya tekan ke bawah (downforce) dan koefisien hambat aerodinamis (drag) merupakan parameter vital dalam menjaga kestabilan mobil balap saat melibas tikungan berkecepatan tinggi. Desain sayap multi-elemen diuji secara numerik.",
                "Persamaan Navier-Stokes diselesaikan menggunakan model turbulensi k-omega SST pada domain fluida tiga dimensi dengan batas kecepatan aliran angin 30 meter per detik. Mesh prismatik diterapkan pada lapisan batas dinding aerofoil.",
                "Hasil simulasi menunjukkan peningkatan nilai lift-to-drag ratio sebesar 14.5% pada konfigurasi gurney flap setinggi tiga milimeter di sayap belakang."
            },
            {
                "10502182012", "Laura_Tangkilisan", "PDF",
                "Pengenalan Pola Gerak Tangan Bahasa Isyarat SIBI Berbasis MediaPipe dan Klasifikasi Random Forest",
                "Jembatan komunikasi antara masyarakat tunarungu dan masyarakat umum memerlukan media penerjemah gerak isyarat otomatis yang praktis dan beroperasi secara real-time pada kamera smartphone standar tanpa sensor sarung tangan khusus.",
                "Pustaka MediaPipe Hands mengekstraksi 21 titik koordinat spasial tiga dimensi kerangka tangan dan jari. Fitur sudut antar-sendi dan jarak euklidian relatif dihitung sebelum diklasifikasikan oleh ensemble pohon keputusan Random Forest.",
                "Pengujian terhadap 26 abjad isyarat Sistem Isyarat Bahasa Indonesia (SIBI) menghasilkan akurasi rerata 94.8 persen dengan latensi pemrosesan 35 frame per detik."
            },
            {
                "10502182013", "Mario_Lumempouw", "DOCX",
                "Penyembunyian Data Rahasia pada Citra Digital Menggunakan Teknik Steganografi LSB Berbasis Enkripsi ChaCha20",
                "Pengiriman informasi rahasia melalui saluran komunikasi terbuka membutuhkan proteksi ganda berupa enkripsi kriptografis dan penyamaran visual agar tidak memancing kecurigaan pihak ketiga (eavesdropper).",
                "Pesan teks rahasia terlebih dahulu dienkripsi menggunakan stream cipher ChaCha20 berkecepatan tinggi, kemudian bit-bit ciphertext disisipkan ke dalam bit paling tidak signifikan (Least Significant Bit) saluran warna piksel citra pembawa (cover image).",
                "Nilai Peak Signal-to-Noise Ratio (PSNR) citra stego tercatat di atas 48 dB, membuktikan bahwa keberadaan pesan tersembunyi tidak dapat dideteksi oleh indra penglihatan manusia."
            },
            {
                "10502182014", "Nadia_Poluan", "PDF",
                "Klasifikasi Kematangan Buah Kelapa Sawit Menggunakan Spektroskopi Vis-NIR dan Partial Least Squares (PLS)",
                "Penentuan tandan buah segar (TBS) kelapa sawit yang siap panen selama ini masih mengandalkan inspeksi visual pemetik yang bersifat subjektif dan rawan kesalahan penilaian kadar asam lemak bebas (ALB).",
                "Spektrum pantulan gelombang tampak dan inframerah dekat (Vis-NIR) pada panjang gelombang 400 hingga 1000 nm diakuisisi secara non-destruktif. Regresi Partial Least Squares Discriminant Analysis (PLS-DA) memodelkan korelasi kandungan kimia buah.",
                "Akurasi klasifikasi mencapai 93.3% dalam membedakan fraksi mentah, matang, dan lewat matang, meningkatkan efisiensi rendemen minyak kelapa sawit mentah (CPO)."
            },
            {
                "10502182015", "Oscar_Runtunuwu", "DOCX",
                "Pengembangan Gim Edukasi Pembelajaran Aksara Kuno Minahasa Menggunakan Unity Game Engine",
                "Pelestarian warisan budaya bahasa dan aksara tradisional daerah terancam punah di kalangan generasi muda era digital. Penelitian ini merancang media interaktif gamifikasi dengan pendekatan pembelajaran adaptif.",
                "Mesin pengembang Unity 2D diintegrasikan dengan algoritma spaced repetition system (SRS) untuk menghitung interval pengulangan kartu kuis karakter aksara berdasarkan kecepatan respons pemain.",
                "Uji kelayakan pengguna menggunakan kuesioner System Usability Scale (SUS) pada 40 siswa sekolah menengah memperoleh skor 84.5 (kategori Excellent), menandakan peningkatan minat belajar yang signifikan."
            },
            {
                "10502182016", "Patricia_Rumengan", "PDF",
                "Evaluasi Kinerja Algoritma Kriptografi Pascakuantum Dilithium Terhadap Ancaman Komputer Kuantum Shor",
                "Kemunculan prosesor kuantum berskala besar mengancam eksistensi algoritma enkripsi asimetris klasik seperti RSA dan Kurva Eliptik melalui eksekusi Algoritma Faktorisasi Shor.",
                "Penelitian ini mengevaluasi skema tanda tangan digital berbasis lattice CRYSTALS-Dilithium yang distandardisasi oleh NIST. Analisis difokuskan pada ukuran kunci publik, panjang signature, dan konsumsi siklus instruksi CPU pada mikrokontroler ARM Cortex-M4.",
                "Hasil benchmarking membuktikan bahwa Dilithium-2 mampu menghasilkan verifikasi tanda tangan dalam 1.2 milidetik dengan tingkat keamanan setara AES-128 bit klasik."
            },
            {
                "10502182017", "Quirino_Montolalu", "DOCX",
                "Perancangan Alat Desalinasi Air Payau Berbasis Tenaga Surya Menggunakan Efek Termoelektrik Peltier",
                "Krisis ketersediaan air minum bersih pada komunitas pesisir pulau terluar menuntut teknologi purifikasi air laut yang mandiri energi dan berbiaya perawatan rendah tanpa filter membran reverse osmosis yang mahal.",
                "Modul termoelektrik Peltier dimanfaatkan sisi dinginnya untuk mempercepat kondensasi uap air hasil evaporasi matahari, sementara sisi panasnya membantu memanaskan bak penampung air payau awal.",
                "Produksi air kondensat bersih mencapai 3.8 liter per meter persegi area kolektor surya per hari dengan penurunan salinitas dari 18.000 ppm menjadi 140 ppm (sesuai baku mutu air minum WHO)."
            },
            {
                "10502182018", "Rachelia_Tielung", "PDF",
                "Pendeteksi Serangan Denial of Service (DDoS) Pada Jaringan Software-Defined Networking (SDN) Berbasis Entropi",
                "Arsitektur Software-Defined Networking memisahkan control plane dan data plane, menjadikan pengontrol OpenFlow terpusat sasaran empuk serangan flooding paket data SYN dan UDP palsu.",
                "Metode pengukuran entropi Shannon diterapkan untuk memantau keacakan distribusi alamat IP sumber dan port tujuan pada tabel alur switch jaringan secara berkala per jendela waktu lima ratus milidetik.",
                "Penurunan drastis nilai entropi mendeteksi anomali serangan dalam kurun waktu kurang dari dua detik dan memicu pemasangan aturan filter otomatis tanpa mengganggu trafik pengguna yang sah."
            },
            {
                "10502182019", "Samuel_Kalalo", "DOCX",
                "Analisis Sebaran Spasial Daerah Rawan Longsor Menggunakan Analytic Hierarchy Process (AHP) dan Sistem Informasi Geografis",
                "Wilayah perbukitan Kabupaten Minahasa Utara memiliki tingkat kerentanan gerakan tanah yang tinggi selama musim penghujan ekstrem. Pemetaan risiko bencana alam sangat dibutuhkan dalam rencana tata ruang wilayah.",
                "Data spasial multi-kriteria meliputi kemiringan lereng, curah hujan harian, jenis tanah litologi, tutupan vegetasi lahan, dan kerapatan sesar patahan geologi dibobot menggunakan matriks perbandingan berpasangan Analytic Hierarchy Process.",
                "Peta zonasi mikro yang dihasilkan tervalidasi dengan data riwayat kejadian longsor historis BPBD, menunjukkan tingkat akurasi kesesuaian spasial sebesar 88.6 persen."
            },
            {
                "10502182020", "Theresia_Tumewu", "PDF",
                "Penerapan Algoritma Q-Learning dalam Navigasi Penghindaran Rintangan Statis dan Dinamis pada Kursi Roda Listrik",
                "Penyandang disabilitas fisik motorik berat membutuhkan alat bantu mobilitas mandiri yang mampu bermanuver di lorong rumah sakit yang padat tanpa risiko tabrakan dengan orang yang berlalu lalang.",
                "Agen Reinforcement Learning Q-Learning dilatih dalam lingkungan simulasi gazebo dengan masukan array sensor jarak ultrasonic dan LiDAR 2D. Fungsi reward memberikan penalti atas kedekatan dinding dan penghargaan atas tercapainya titik koordinat target.",
                "Kursi roda cerdas berhasil mencapai tujuan dengan efisiensi lintasan 92% dan waktu reaksi penghindaran rintangan tiba-tiba di bawah 0.18 detik."
            }
        };

        for (String[] row : data) {
            String nim = row[0];
            String nama = row[1];
            String format = row[2];
            String judul = row[3];
            List<String> paragraphs = List.of(row[4], row[5], row[6]);

            String filename = String.format("%s/%s_%s_Tugas.%s", downloadPath, nim, nama, format.toLowerCase());

            if (format.equals("DOCX")) {
                writeDocx(filename, nama, nim, judul, paragraphs);
            } else {
                writePdf(filename, nama, nim, judul, paragraphs);
            }
        }

        System.out.println("SUKSES LENGKAP: 20 Berkas Unik (10 Word DOCX + 10 PDF) Berhasil Disimpan di " + downloadPath);
    }

    private void writeDocx(String path, String nama, String nim, String title, List<String> paragraphs) throws Exception {
        XWPFDocument doc = new XWPFDocument();

        // Header identitas mahasiswa (Difilter otomatis oleh sistem agar tidak salah terdeteksi)
        XWPFParagraph header = doc.createParagraph();
        XWPFRun rHeader = header.createRun();
        rHeader.setText("Nama: " + nama.replace("_", " ") + "\nNIM: " + nim + "\nFakultas Ilmu Komputer, Universitas Klabat (UNKLAB)\n\n");
        rHeader.setFontFamily("Times New Roman");
        rHeader.setFontSize(11);

        // Judul Tugas
        XWPFParagraph pTitle = doc.createParagraph();
        XWPFRun rTitle = pTitle.createRun();
        rTitle.setBold(true);
        rTitle.setFontSize(13);
        rTitle.setText(title);

        // Paragraf
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
                cs.setFont(PDType1Font.HELVETICA_BOLD, 11);
                cs.showText("Judul: " + (title.length() > 65 ? title.substring(0, 65) + "..." : title));
                cs.newLine();
                cs.newLine();

                // Isi Paragraf
                cs.setFont(PDType1Font.HELVETICA, 10);
                cs.setLeading(14.0f);

                for (String p : paragraphs) {
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
