import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  Search, 
  Filter, 
  Eye, 
  Files, 
  Clock, 
  BookOpen, 
  Loader2,
  CheckCircle2,
  SplitSquareVertical,
  Download,
  GraduationCap,
  FileText,
  UserCheck,
  TrendingDown,
  Info
} from 'lucide-react';

export default function Results() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, TERINDIKASI_PLAGIAT, PERLU_REVIEW, AMAN

  useEffect(() => {
    fetchSessionData();
  }, [sessionId]);

  const fetchSessionData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:8080/api/sessions/${sessionId}`);
      if (!res.ok) {
        throw new Error('Gagal memuat hasil sesi pemeriksaan dari server.');
      }
      const data = await res.json();
      setSession(data.session);
      setSubmissions(data.submissions || []);
      setResults(data.results || []);
    } catch (err) {
      setError(err.message || 'Koneksi ke backend Spring Boot gagal.');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = results.filter((item) => {
    const matchesSearch =
      item.studentAName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentBName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fileAName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.fileBName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const plagiatCount = results.filter(r => r.similarityPercentage >= 50).length;
  const reviewCount = results.filter(r => r.similarityPercentage >= 25 && r.similarityPercentage < 50).length;
  const amanCount = results.filter(r => r.similarityPercentage < 25).length;
  const highestPair = results.length > 0 ? results[0] : null;

  // Hitung Nilai & Statistik Akumulasi Multi-Perbandingan per Mahasiswa/File
  const studentStats = submissions.map((sub) => {
    // Cari semua perbandingan yang melibatkan mahasiswa ini
    const relatedResults = results.filter(
      (r) => r.studentAName === sub.studentName || r.studentBName === sub.studentName
    );

    // Kumpulkan daftar mahasiswa lain yang memiliki kemiripan dengannya (> 15%)
    let maxSimilarity = 0;
    let worstPair = null;
    let flaggedPairs = [];
    let cumulativePenalty = 0;

    relatedResults.forEach((r) => {
      const partnerName = r.studentAName === sub.studentName ? r.studentBName : r.studentAName;
      if (r.similarityPercentage > maxSimilarity) {
        maxSimilarity = r.similarityPercentage;
        worstPair = r;
      }
      if (r.similarityPercentage >= 15) {
        flaggedPairs.push({
          partner: partnerName,
          similarity: r.similarityPercentage
        });
        // Penalti kumulatif: plagiarisme dari berbagai mahasiswa dijumlahkan secara berbobot
        // Misalnya mirip 30% dgn Mahasiswa B dan 30% dgn Mahasiswa C
        cumulativePenalty += (r.similarityPercentage * 0.85);
      }
    });

    // Urutkan pasangan paling mirip
    flaggedPairs.sort((a, b) => b.similarity - a.similarity);

    // Bobot Nilai Akhir:
    // Kombinasi dari Kemiripan Tertinggi (Worst Match) dan Akumulasi Kemiripan Banyak Mahasiswa
    const effectiveRiskRate = Math.min(100, Math.max(maxSimilarity, cumulativePenalty));
    const estimatedScore = Math.max(0, Math.round(100 - effectiveRiskRate));

    // Grade penugasan individu (Standar Akademik UNKLAB)
    let individualGrade = 'A';
    if (estimatedScore < 50) individualGrade = 'E';
    else if (estimatedScore < 60) individualGrade = 'D';
    else if (estimatedScore < 70) individualGrade = 'C';
    else if (estimatedScore < 85) individualGrade = 'B';

    // Penjelasan analitis komprehensif (Menghubungkan semua perbandingan)
    let explanation = '';
    if (flaggedPairs.length >= 2) {
      const pairDetails = flaggedPairs.map(p => `${p.partner} (${p.similarity}%)`).join(', ');
      explanation = `Tugas mahasiswa ini mendapat skor ${estimatedScore} (Grade ${individualGrade}) karena terindikasi memiliki kemiripan ganda dengan ${flaggedPairs.length} mahasiswa lain: ${pairDetails}. Karena indikasi plagiat terjadi di lebih dari 1 file, penalti akumulatif diterapkan sehingga nilainya diturunkan.`;
    } else if (flaggedPairs.length === 1) {
      const p = flaggedPairs[0];
      explanation = `Tugas mahasiswa ini mendapat skor ${estimatedScore} (Grade ${individualGrade}) terutama karena kesamaan dengan ${p.partner} sebesar ${p.similarity}%.`;
    } else {
      explanation = maxSimilarity > 0
        ? `Tugas mahasiswa ini mendapat skor ${estimatedScore} (Grade A) karena naskah terbukti orisinal dan mandiri. Indikator kemiripan kecil (${maxSimilarity}%) berasal dari kata penghubung atau istilah ilmiah baku umum (bukan penjiplakan ide).`
        : `Tugas mahasiswa ini mendapat skor ${estimatedScore} (Grade A Murni) karena naskah 100% orisinal dan berdiri sendiri tanpa kesamaan dengan mahasiswa mana pun di kelas.`;
    }

    return {
      submission: sub,
      maxSimilarity,
      worstPair,
      flaggedPairs,
      otherStudent: worstPair ? (worstPair.studentAName === sub.studentName ? worstPair.studentBName : worstPair.studentAName) : '-',
      estimatedScore,
      individualGrade,
      explanation
    };
  });

  const getGradeBadge = (grade) => {
    switch (grade) {
      case 'A':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-300 font-bold';
      case 'B':
        return 'bg-blue-500/10 text-blue-700 border-blue-300 font-bold';
      case 'C':
        return 'bg-amber-500/10 text-amber-700 border-amber-300 font-bold';
      case 'D':
        return 'bg-orange-500/10 text-orange-700 border-orange-300 font-bold';
      case 'E':
      default:
        return 'bg-rose-500/10 text-rose-700 border-rose-300 font-bold';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'AMAN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            Aman
          </span>
        );
      case 'PERLU_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            Perlu Review
          </span>
        );
      case 'TERINDIKASI_PLAGIAT':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <ShieldAlert className="w-3.5 h-3.5" />
            Terindikasi Plagiat
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-600">
          Memuat ringkasan pemeriksaan dari database H2...
        </p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl max-w-lg mx-auto">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <h3 className="font-bold text-base">Gagal Memuat Sesi</h3>
          <p className="text-sm mt-1">{error || 'Data sesi tidak ditemukan.'}</p>
        </div>
        <Link
          to="/check"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Form Pemeriksaan
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/check"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Pemeriksaan Baru
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {session.sessionTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              {session.courseName}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {new Date(session.createdAt).toLocaleString('id-ID')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Files className="w-3.5 h-3.5 text-slate-400" />
              {session.totalFiles} Mahasiswa ({session.totalPairs} Pasangan)
            </span>
          </div>
        </div>

        <Link
          to={`/compare/${results[0]?.id || ''}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <SplitSquareVertical className="w-4 h-4" />
          <span>Lihat Berdampingan (Side-by-Side)</span>
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Pairs */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Perbandingan Silang
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-2">
            {session.totalPairs}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Kombinasi dari {session.totalFiles} berkas mahasiswa
          </div>
        </div>

        {/* Plagiat Tinggi */}
        <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-700 flex items-center justify-between">
            <span>Terindikasi Plagiat</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-rose-700 mt-2">
            {plagiatCount}
          </div>
          <div className="text-xs text-rose-600 mt-1">
            Pasangan dengan kemiripan &ge; 50%
          </div>
        </div>

        {/* Perlu Review */}
        <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 flex items-center justify-between">
            <span>Perlu Review Dosen</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-amber-700 mt-2">
            {reviewCount}
          </div>
          <div className="text-xs text-amber-600 mt-1">
            Kemiripan 25% - 49%
          </div>
        </div>

        {/* Aman */}
        <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 flex items-center justify-between">
            <span>Original / Aman</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-700 mt-2">
            {amanCount}
          </div>
          <div className="text-xs text-emerald-600 mt-1">
            Kemiripan di bawah 25% (Lolos)
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama mahasiswa atau berkas..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Status:
          </span>
          {[
            { key: 'ALL', label: `Semua (${results.length})` },
            { key: 'TERINDIKASI_PLAGIAT', label: `Plagiat (${plagiatCount})` },
            { key: 'PERLU_REVIEW', label: `Review (${reviewCount})` },
            { key: 'AMAN', label: `Aman (${amanCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.key
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Results Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">Pasangan Mahasiswa yang Dibandingkan</th>
                <th className="py-3.5 px-4 text-center">Persentase Plagiat</th>
                <th className="py-3.5 px-4 text-center">Originalitas</th>
                <th className="py-3.5 px-4 text-center">Grade</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    Tidak ada hasil perbandingan yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredResults.map((item, index) => {
                  const isHigh = item.similarityPercentage >= 50;
                  const isMedium = item.similarityPercentage >= 25 && item.similarityPercentage < 50;
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isHigh ? 'bg-rose-50/30' : isMedium ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-mono text-xs text-slate-400">
                        {index + 1}
                      </td>

                      {/* Mahasiswa A vs Mahasiswa B */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{item.studentAName}</span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.fileAName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-semibold text-slate-400">vs</span>
                            <span className="font-bold text-slate-900">{item.studentBName}</span>
                            <span className="text-xs text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                              {item.fileBName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* % Plagiat Progress Bar */}
                      <td className="py-4 px-4 text-center">
                        <div className="inline-flex flex-col items-center w-28">
                          <span
                            className={`font-black text-base ${
                              isHigh
                                ? 'text-rose-600'
                                : isMedium
                                ? 'text-amber-600'
                                : 'text-emerald-600'
                            }`}
                          >
                            {item.similarityPercentage}%
                          </span>
                          {item.similarityPercentage > 0 && item.similarityPercentage < 5 && (
                            <span className="text-[10px] text-slate-400 mt-0.5">
                              (kata umum)
                            </span>
                          )}
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isHigh
                                  ? 'bg-rose-500'
                                  : isMedium
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(100, item.similarityPercentage)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* % Originalitas */}
                      <td className="py-4 px-4 text-center font-semibold text-slate-700">
                        {item.originalityPercentage}%
                      </td>

                      {/* Grade */}
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`inline-block w-8 h-8 rounded-xl border text-sm flex items-center justify-center mx-auto ${getGradeBadge(
                            item.grade
                          )}`}
                        >
                          {item.grade}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        {getStatusBadge(item.status)}
                      </td>

                      {/* Action: Side-by-side view */}
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={`/compare/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-medium text-xs transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Bandingkan Berdampingan</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bagian Baru: Nilai & Evaluasi Per File / Mahasiswa */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-lg">
                Rekapitulasi Nilai & Evaluasi Orisinalitas Tiap Mahasiswa
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Rincian perolehan nilai per file tugas, faktor penyebab nilai, serta korelasinya dengan perbandingan plagiarisme.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200">
            {studentStats.length} Dokumen Mahasiswa Dinilai
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {studentStats.map((stat, idx) => {
            const isHighPlagiat = stat.maxSimilarity >= 65;
            const isMediumPlagiat = stat.maxSimilarity >= 30 && stat.maxSimilarity < 65;

            return (
              <div
                key={stat.submission.id || idx}
                className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                  isHighPlagiat
                    ? 'border-rose-200 bg-rose-50/20 shadow-sm'
                    : isMediumPlagiat
                    ? 'border-amber-200 bg-amber-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-blue-200 shadow-sm'
                }`}
              >
                <div>
                  {/* Header: Nama Mahasiswa & File */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                        isHighPlagiat
                          ? 'bg-rose-100 text-rose-700'
                          : isMediumPlagiat
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                          {stat.submission.studentName}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono">{stat.submission.originalFilename}</span>
                          <span>•</span>
                          <span>{stat.submission.wordCount || 0} kata</span>
                        </div>
                      </div>
                    </div>

                    {/* Nilai Angka & Grade */}
                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1.5">
                        <span className={`text-2xl font-black ${
                          isHighPlagiat
                            ? 'text-rose-600'
                            : isMediumPlagiat
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}>
                          {stat.estimatedScore}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">/100</span>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs border mt-0.5 ${getGradeBadge(stat.individualGrade)}`}>
                        Grade {stat.individualGrade}
                      </span>
                    </div>
                  </div>

                  {/* Indikator Kemiripan Tertinggi */}
                  <div className="mt-3 py-2 px-3 rounded-xl bg-white border border-slate-200/80 text-xs flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5 text-slate-400" />
                      Kemiripan Tertinggi:
                    </span>
                    <span className="font-bold text-slate-800">
                      {stat.maxSimilarity}% {stat.worstPair && (
                        <span className="font-normal text-slate-500">
                          (terhadap <span className="font-semibold text-slate-700">{stat.otherStudent}</span>)
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Penjelasan Kenapa Nilainya Begitu */}
                  <div className="mt-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1">
                      <Info className="w-3.5 h-3.5 text-blue-600" />
                      <span>Alasan & Analisis Penilaian:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {stat.explanation}
                    </p>
                  </div>
                </div>

                {/* Tombol Langsung Cek Pasangan Terkait */}
                {stat.worstPair && (
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Bandingkan langsung naskah ini:
                    </span>
                    <Link
                      to={`/compare/${stat.worstPair.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat dengan {stat.otherStudent}</span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
