import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Key, 
  HelpCircle,
  FileCheck,
  Loader2,
  FolderPlus
} from 'lucide-react';

export default function Check() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [sessionTitle, setSessionTitle] = useState('Tugas 1 - Pemrograman Web');
  const [courseName, setCourseName] = useState('Front End Web Development');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const steps = [
    'Mengunggah berkas mahasiswa ke backend Spring Boot...',
    'Mengekstrak teks dokumen Word (.docx) & PDF (.pdf)...',
    'Menghasilkan seluruh kombinasi pasangan mahasiswa...',
    'Menjalankan algoritma deteksi kemiripan n-gram & shingling...',
    'Menghubungi AI untuk evaluasi akademik & penentuan Grade...',
    'Menyimpan hasil pemeriksaan ke database H2 lokal...',
  ];

  const handleFileChange = (e) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const addFiles = (newFiles) => {
    setErrorMsg('');
    const validExtensions = ['.docx', '.doc', '.pdf', '.txt'];
    const filtered = newFiles.filter(file => {
      const name = file.name.toLowerCase();
      return validExtensions.some(ext => name.endsWith(ext));
    });

    if (filtered.length < newFiles.length) {
      setErrorMsg('Hanya file dokumen Word (.docx, .doc), PDF (.pdf), atau TXT (.txt) yang didukung.');
    }

    // Periksa duplikasi nama file & deteksi kemiripan nama mahasiswa (termasuk suffix -copy, (1), dsb)
    const exactFileDuplicates = [];
    const studentNameDuplicates = [];

    setFiles(prev => {
      const existingFileNames = new Set(prev.map(f => f.name.toLowerCase()));
      const existingStudentMap = new Map();
      prev.forEach(f => {
        const studentClean = getCleanStudentKey(f.name);
        existingStudentMap.set(studentClean, f.name);
      });

      const uniqueNewFiles = [];

      filtered.forEach(file => {
        const lowerName = file.name.toLowerCase();
        const studentClean = getCleanStudentKey(file.name);

        if (existingFileNames.has(lowerName)) {
          exactFileDuplicates.push(file.name);
        } else if (existingStudentMap.has(studentClean)) {
          studentNameDuplicates.push({
            newFile: file.name,
            existingFile: existingStudentMap.get(studentClean),
            studentName: guessStudentName(file.name)
          });
          // TOLAK file ini (JANGAN masukkan ke uniqueNewFiles)
        } else {
          uniqueNewFiles.push(file);
          existingFileNames.add(lowerName);
          existingStudentMap.set(studentClean, file.name);
        }
      });

      // Tampilkan Alert jika terdeteksi berkas duplikat atau nama mahasiswa ganda
      if (exactFileDuplicates.length > 0 || studentNameDuplicates.length > 0) {
        setDuplicateWarning({
          exactFiles: exactFileDuplicates,
          studentDuplicates: studentNameDuplicates
        });
      } else {
        setDuplicateWarning(null);
      }

      return [...prev, ...uniqueNewFiles];
    });
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== indexToRemove);
      if (updated.length === 0) setDuplicateWarning(null);
      return updated;
    });
  };

  const clearAllFiles = () => {
    setFiles([]);
    setDuplicateWarning(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const guessStudentName = (filename) => {
    let name = filename.replace(/\.(docx|doc|pdf|txt)$/i, '');
    // Hapus pola duplikasi bawaan OS / download seperti "- copy", "(1)", "_copy", " - salinan"
    name = name.replace(/(?:[-_\s]+copy|\s*\(\d+\)|[-_\s]+salinan)/gi, '');
    name = name.replace(/[-_]/g, ' ');
    name = name.replace(/(tugas|assignment|makalah|paper|skripsi|final|project)\s*\d*/gi, '').trim();
    return name || filename;
  };

  // Normalisasi ketat untuk mencocokkan identitas mahasiswa / berkas
  const getCleanStudentKey = (filename) => {
    let base = filename.replace(/\.(docx|doc|pdf|txt)$/i, '');
    // Hapus angka copy "(1)", "- copy", "_copy", "salinan"
    base = base.replace(/(?:[-_\s]+copy|\s*\(\d+\)|[-_\s]+salinan)/gi, '');
    base = base.replace(/[-_]/g, ' ');
    base = base.replace(/(tugas|assignment|makalah|paper|skripsi|final|project)\s*\d*/gi, '');
    // Hapus karakter non-alfanumerik agar perbandingan benar-benar murni
    return base.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (files.length < 2) {
      setErrorMsg('Pilih minimal 2 file tugas mahasiswa untuk melakukan perbandingan silang.');
      return;
    }

    // Proteksi Pembatalan: Cek apakah masih ada nama mahasiswa yang sama / suffix copy di antara file yang dipilih
    const studentMap = new Map();
    for (const f of files) {
      const cleanKey = getCleanStudentKey(f.name);
      if (studentMap.has(cleanKey)) {
        const existing = studentMap.get(cleanKey);
        setErrorMsg(
          `PEMERIKSAAN DIBATALKAN: Ditemukan duplikasi mahasiswa atau file hasil salinan (copy)! ` +
          `File "${f.name}" memiliki identitas nama yang sama dengan "${existing}". ` +
          `Harap hapus salah satu file sebelum melanjutkan pemeriksaan.`
        );
        return;
      }
      studentMap.set(cleanKey, f.name);
    }

    setIsProcessing(true);
    setCurrentStep(0);

    // Simulate progressive status steps for smooth UX
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      formData.append('sessionTitle', sessionTitle);
      formData.append('courseName', courseName);
      if (geminiApiKey.trim()) {
        formData.append('geminiApiKey', geminiApiKey.trim());
      }

      const response = await fetch('http://localhost:8080/api/check', {
        method: 'POST',
        body: formData,
      });

      clearInterval(stepInterval);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Gagal memproses pemeriksaan' }));
        throw new Error(errData.error || 'Server error saat memeriksa plagiarisme.');
      }

      const data = await response.json();
      // Redirect to results page for this session
      navigate(`/results/${data.session.id}`);
    } catch (err) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      setErrorMsg(err.message || 'Gagal menghubungi server Spring Boot (pastikan port 8080 aktif).');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Pemeriksaan Plagiarisme Multi-File
        </h1>
        <p className="text-slate-600 mt-1">
          Unggah sekaligus semua file tugas mahasiswa kelas Anda dalam format Word (.docx) atau PDF (.pdf).
        </p>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-sm font-medium">{errorMsg}</div>
        </div>
      )}

      {/* Alert Peringatan Duplikasi File / Nama Mahasiswa yang Sama */}
      {duplicateWarning && (
        <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 p-5 rounded-2xl shadow-sm space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-bold text-base text-amber-800">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>Perhatian: Ditemukan Berkas / Nama Mahasiswa Duplikat!</span>
            </div>
            <button
              type="button"
              onClick={() => setDuplicateWarning(null)}
              className="text-xs font-semibold px-2.5 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-900 rounded-lg transition-colors"
            >
              Tutup Peringatan
            </button>
          </div>

          <div className="text-xs space-y-2 text-amber-800/90 pl-7">
            {duplicateWarning.exactFiles.length > 0 && (
              <div>
                <p className="font-semibold text-amber-950 mb-1">
                  ⚠️ Nama file persis sama (otomatis diabaikan agar tidak ganda):
                </p>
                <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] bg-white/70 p-2.5 rounded-xl border border-amber-200">
                  {duplicateWarning.exactFiles.map((fn, i) => (
                    <li key={i}>{fn}</li>
                  ))}
                </ul>
              </div>
            )}

            {duplicateWarning.studentDuplicates.length > 0 && (
              <div>
                <p className="font-semibold text-amber-950 mb-1">
                  ⚠️ Terdeteksi mahasiswa yang sama mengunggah lebih dari 1 file (misal Word & PDF sekaligus):
                </p>
                <div className="space-y-1 bg-white/70 p-2.5 rounded-xl border border-amber-200 text-[11px]">
                  {duplicateWarning.studentDuplicates.map((dup, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-1.5">
                      <span className="font-bold text-amber-950">Mahasiswa: "{dup.studentName}"</span>
                      <span className="text-slate-500">mengirim berkas baru</span>
                      <span className="font-mono bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-semibold">{dup.newFile}</span>
                      <span className="text-slate-500">yang bentrok dengan berkas sebelumnya:</span>
                      <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">{dup.existingFile}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <p className="text-[11px] text-amber-700 font-medium italic pt-1">
              💡 Saran: Periksa kembali daftar berkas di bawah. Anda dapat menghapus salah satu file jika mahasiswa hanya perlu dinilai satu kali.
            </p>
          </div>
        </div>
      )}

      {/* Main Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Metadata */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Judul Sesi Pemeriksaan
            </label>
            <input
              type="text"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder="Contoh: Tugas 1 - Paper Front End"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Mata Kuliah / Dosen Pengampu
            </label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Contoh: Pemrograman Web (UNKLAB)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              required
            />
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>Google Gemini API Key (Opsional)</span>
              </label>
              <span className="text-xs text-slate-400">
                Jika dikosongkan, sistem tetap berjalan menggunakan algoritma AI lokal bawaan!
              </span>
            </div>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="Masukkan Gemini API Key Anda (misal: AIzaSy...)"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-mono"
            />
          </div>
        </div>

        {/* Dropzone Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
              : 'border-slate-300 hover:border-blue-400 bg-white hover:bg-slate-50/50 shadow-sm'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept=".docx,.doc,.pdf,.txt"
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center mb-4 border border-blue-100 shadow-sm">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Klik atau Tarik Berkas Mahasiswa ke Sini
          </h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Dukung multiple file sekaligus: <strong>Word (.docx, .doc)</strong> dan <strong>PDF (.pdf)</strong>. Minimal pilih 2 berkas untuk saling dibandingkan.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Bisa pilih banyak file sekaligus dengan Ctrl+A atau Shift+Klik</span>
          </div>
        </div>

        {/* Uploaded Files Preview List */}
        {files.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Daftar Berkas Mahasiswa ({files.length} File Terpilih)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Akan menghasilkan {((files.length * (files.length - 1)) / 2)} pasangan perbandingan silang
                </p>
              </div>
              <button
                type="button"
                onClick={clearAllFiles}
                className="text-xs text-rose-600 hover:text-rose-700 font-medium hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Semua
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {file.name.endsWith('.pdf') ? 'PDF' : 'DOC'}
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-sm font-semibold text-slate-800 truncate">
                        {guessStudentName(file.name)}
                      </div>
                      <div className="text-xs text-slate-500 truncate flex items-center gap-2">
                        <span>{file.name}</span>
                        <span>•</span>
                        <span>{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                    title="Hapus file ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isProcessing || files.length < 2}
            className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 shadow-lg transition-all ${
              isProcessing || files.length < 2
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.01]'
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Sedang Memeriksa Kemiripan Multi-File...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>
                  Periksa Plagiarisme Multi-File Sekarang ({files.length} File)
                </span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Processing Modal Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-100">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Pemeriksaan Sedang Berlangsung
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Memproses {files.length} dokumen Word / PDF di backend Spring Boot & database H2
              </p>
            </div>

            <div className="space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              {steps.map((step, idx) => {
                const isDone = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div key={idx} className="flex items-center gap-2.5 text-xs">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                    )}
                    <span className={isCurrent ? 'font-semibold text-blue-600' : isDone ? 'text-slate-700' : 'text-slate-400'}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
