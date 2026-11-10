import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Files, 
  SplitSquareVertical, 
  Award, 
  Sparkles, 
  Database, 
  ArrowRight,
  FileCheck2,
  Users2,
  Scale
} from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.15),transparent_50%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sistem Akademik Resmi UNKLAB • Berbasis AI & Spring Boot H2</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Pemeriksaan Plagiarisme <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Sekaligus Multi-File Mahasiswa
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Dosen cukup mengunggah seluruh berkas <strong>Word (.docx)</strong> dan <strong>PDF (.pdf)</strong> tugas mahasiswa sekaligus. Sistem akan otomatis membandingkan setiap pasangan mahasiswa, menghitung <strong>persentase plagiat & originalitas</strong>, menentukan <strong>grade</strong>, serta menampilkan <strong>bagian yang sama berdampingan secara bersamaan</strong>.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/check"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all"
            >
              <Files className="w-5 h-5" />
              <span>Unggah & Periksa Berkas Sekarang</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/history"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-medium text-base border border-slate-700 transition-all"
            >
              <Database className="w-4 h-4 text-slate-400" />
              <span>Lihat Riwayat Sesi (H2 Database)</span>
            </Link>
          </div>

          {/* Quick Stats Grid */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-4 rounded-xl">
              <div className="text-blue-400 font-bold text-2xl">Batch Multi</div>
              <div className="text-xs text-slate-400 mt-1">Unggah sekaligus DOCX & PDF semua mahasiswa</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-4 rounded-xl">
              <div className="text-indigo-400 font-bold text-2xl">Cross Match</div>
              <div className="text-xs text-slate-400 mt-1">Perbandingan silang otomatis A vs B, A vs C, dst.</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-4 rounded-xl">
              <div className="text-purple-400 font-bold text-2xl">Grade A - E</div>
              <div className="text-xs text-slate-400 mt-1">Skor % kemiripan, % original, dan nilai mutu</div>
            </div>
            <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 p-4 rounded-xl">
              <div className="text-emerald-400 font-bold text-2xl">Side-by-Side</div>
              <div className="text-xs text-slate-400 mt-1">Sorotan bagian plagiat berdampingan bersamaan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Flow Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Bagaimana Cara Kerja Sistem Ini?
          </h2>
          <p className="text-slate-600 mt-2">
            Dirancang khusus untuk dosen UNKLAB agar verifikasi orisinalitas tugas kelas menjadi cepat dan akurat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl mb-4 border border-blue-100">
              1
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Unggah Sekaligus Berkas Kelas</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pilih semua file tugas mahasiswa (.docx, .doc, .pdf) dalam satu folder. Spring Boot akan mengekstrak teks setiap naskah secara paralel menggunakan Apache POI dan PDFBox.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl mb-4 border border-indigo-100">
              2
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Analisis Kemiripan Silang & AI</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Algoritma N-gram & Shingling bersama Google Gemini AI membandingkan setiap pasangan mahasiswa. Menghitung persentase plagiat, orisinalitas, dan menetapkan Grade (A, B, C, D, E).
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl mb-4 border border-emerald-100">
              3
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Tampilan Berdampingan (Side-by-Side)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dosen dapat membuka naskah Mahasiswa A dan Mahasiswa B berdampingan. Setiap kalimat atau paragraf yang sama disorot warna merah secara bersamaan untuk pembuktian langsung.
            </p>
          </div>
        </div>
      </section>

      {/* Grading Scale Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-800 pb-6">
            <div>
              <span className="text-blue-400 font-semibold text-xs tracking-wider uppercase">Standar Penilaian Akademik</span>
              <h3 className="text-2xl font-bold mt-1">Pedoman Skala Grade & Batas Toleransi Plagiarisme</h3>
            </div>
            <Link
              to="/check"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all self-start md:self-auto"
            >
              Mulai Pengecekan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-black text-emerald-400">Grade A</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-medium">Sangat Baik</span>
              </div>
              <div className="text-sm font-semibold text-slate-200">Plagiat &lt; 15%</div>
              <div className="text-xs text-slate-400 mt-1">Orisinalitas &gt; 85%. Naskah mandiri dan memenuhi standar integritas tinggi.</div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-black text-blue-400">Grade B</span>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-medium">Original Wajar</span>
              </div>
              <div className="text-sm font-semibold text-slate-200">Plagiat 15% - 29%</div>
              <div className="text-xs text-slate-400 mt-1">Orisinalitas 71% - 85%. Kemiripan pada terminologi umum / petunjuk soal.</div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-black text-yellow-400">Grade C</span>
                <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded font-medium">Perlu Review</span>
              </div>
              <div className="text-sm font-semibold text-slate-200">Plagiat 30% - 49%</div>
              <div className="text-xs text-slate-400 mt-1">Kemiripan cukup tinggi. Dosen disarankan memeriksa naskah berdampingan.</div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-black text-orange-400">Grade D</span>
                <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-medium">Indikasi Kuat</span>
              </div>
              <div className="text-sm font-semibold text-slate-200">Plagiat 50% - 69%</div>
              <div className="text-xs text-slate-400 mt-1">Struktur argumen dan paragraf identik antar sesama mahasiswa.</div>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-black text-rose-500">Grade E</span>
                <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-medium">Plagiarisme Berat</span>
              </div>
              <div className="text-sm font-semibold text-slate-200">Plagiat &ge; 70%</div>
              <div className="text-xs text-slate-400 mt-1">Duplikasi hampir keseluruhan naskah (Copy-Paste langsung antar mahasiswa).</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
