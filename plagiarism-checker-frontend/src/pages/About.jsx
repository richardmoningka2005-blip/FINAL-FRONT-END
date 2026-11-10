import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Database, 
  FileCheck2, 
  Sparkles, 
  CheckCircle2,
  Code2
} from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Universitas Klabat (UNKLAB) • Final Project</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Sistem Deteksi Plagiarisme Multi-File Mahasiswa Berbasis AI
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Platform akademik modern untuk membantu dosen memeriksa seluruh naskah tugas mahasiswa secara simultan, menemukan kesamaan antar-mahasiswa, dan menampilkan bukti berdampingan (side-by-side).
        </p>
      </div>

      {/* Tech Stack Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-600" />
          <span>Arsitektur & Teknologi yang Digunakan</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frontend */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <Code2 className="w-5 h-5 text-blue-600" />
              <span>Frontend (Client)</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span><strong>React 19 + Vite:</strong> Framework antarmuka modern super responsif.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span><strong>Tailwind CSS 4:</strong> Desain UI clean, rapi, dan mobile-friendly.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span><strong>React Router DOM:</strong> Navigasi multi-halaman client-side.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span><strong>Dual-Pane Synchronized Viewer:</strong> Sorotan teks berdampingan.</span>
              </li>
            </ul>
          </div>

          {/* Backend */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <span>Backend (Server) & Database</span>
            </div>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span><strong>Spring Boot 3 (Java 21):</strong> REST API backend berkemampuan tinggi.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span><strong>H2 Database (JPA):</strong> Database lokal terintegrasi, bukan json-server.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span><strong>Apache POI & PDFBox:</strong> Ekstraksi teks dari berkas Word (.docx) & PDF (.pdf).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span><strong>Google Gemini AI:</strong> Analisis nuansa akademik & ringkasan evaluasi.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Solving UNKLAB Problem */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>Kontribusi Nyata Terhadap Permasalahan di UNKLAB</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Selama ini, dosen di UNKLAB sering menghadapi kendala saat memeriksa tugas esai, makalah, atau laporan proyek dari puluhan mahasiswa:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="text-rose-400 font-bold text-sm mb-1">Masalah Manual</div>
            <p className="text-xs text-slate-400">
              Membaca dan mencocokkan tugas mahasiswa satu per satu secara manual sangat melelahkan dan rawan terlewat.
            </p>
          </div>
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="text-amber-400 font-bold text-sm mb-1">Keterbatasan Tool</div>
            <p className="text-xs text-slate-400">
              Layanan komersial seperti Turnitin sering berbayar mahal dan terbatas kuotanya untuk tugas kelas harian.
            </p>
          </div>
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="text-emerald-400 font-bold text-sm mb-1">Solusi Sistem Ini</div>
            <p className="text-xs text-slate-400">
              Sekali klik, puluhan berkas Word dan PDF langsung dibandingkan secara silang dengan bukti berdampingan yang transparan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
