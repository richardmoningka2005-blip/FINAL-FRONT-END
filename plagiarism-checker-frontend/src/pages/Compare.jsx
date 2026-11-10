import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  SplitSquareVertical, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  FileText, 
  Check, 
  ExternalLink,
  ChevronRight,
  ListOrdered,
  FileCode2,
  Loader2
} from 'lucide-react';

export default function Compare() {
  const { comparisonId } = useParams();
  const [comparison, setComparison] = useState(null);
  const [session, setSession] = useState(null);
  const [allComparisons, setAllComparisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Active view tab: 'split' or 'sections'
  const [activeTab, setActiveTab] = useState('split');
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(null);

  useEffect(() => {
    fetchComparisonDetail();
  }, [comparisonId]);

  const fetchComparisonDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:8080/api/comparisons/${comparisonId}`);
      if (!res.ok) {
        throw new Error('Gagal memuat detail perbandingan berdampingan.');
      }
      const data = await res.json();
      setComparison(data);

      // Also fetch session to get other pairs for quick switcher
      if (data.sessionId) {
        const sessRes = await fetch(`http://localhost:8080/api/sessions/${data.sessionId}`);
        if (sessRes.ok) {
          const sessData = await sessRes.json();
          setSession(sessData.session);
          setAllComparisons(sessData.results || []);
        }
      }
    } catch (err) {
      setError(err.message || 'Koneksi backend gagal.');
    } finally {
      setLoading(false);
    }
  };

  const parseCommonSections = () => {
    if (!comparison?.commonSectionsJson) return [];
    try {
      return JSON.parse(comparison.commonSectionsJson);
    } catch (e) {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-sm font-medium text-slate-600">
          Menyiapkan tampilan perbandingan teks berdampingan...
        </p>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center space-y-4">
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl max-w-lg mx-auto">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
          <h3 className="font-bold text-base">Gagal Memuat Perbandingan</h3>
          <p className="text-sm mt-1">{error || 'Data perbandingan tidak ditemukan.'}</p>
        </div>
        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Riwayat Sesi
        </Link>
      </div>
    );
  }

  const sections = parseCommonSections();
  const isHigh = comparison.similarityPercentage >= 50;
  const isMedium = comparison.similarityPercentage >= 25 && comparison.similarityPercentage < 50;

  // Split text into paragraphs for cleaner rendering
  const paragraphsA = (comparison.textA || '').split(/\n+/).filter(p => p.trim());
  const paragraphsB = (comparison.textB || '').split(/\n+/).filter(p => p.trim());

  const isTextInSections = (text, targetKey) => {
    return sections.some(sec => {
      const matchText = sec[targetKey];
      return matchText && (text.includes(matchText) || matchText.includes(text));
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Link
            to={`/results/${comparison.sessionId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Daftar Pasangan Sesi
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Perbandingan Teks Berdampingan (Side-by-Side)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Menampilkan dan menyoroti secara bersamaan bagian-bagian yang sama / terindikasi plagiat.
          </p>
        </div>

        {/* Quick Pair Switcher Dropdown */}
        {allComparisons.length > 1 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Ganti Pasangan:
            </label>
            <select
              value={comparison.id}
              onChange={(e) => window.location.href = `/compare/${e.target.value}`}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500 max-w-xs truncate"
            >
              {allComparisons.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.studentAName} vs {c.studentBName} ({c.similarityPercentage}% - Grade {c.grade})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Comparison Summary Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Student A */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
              Mahasiswa A
            </span>
            <div className="text-lg font-extrabold text-slate-900 mt-1 truncate">
              {comparison.studentAName}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 truncate flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {comparison.fileAName}
            </div>
          </div>

          {/* Center: Plagiarism & Grade Badge */}
          <div className="md:col-span-2 text-center p-3 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl shadow-md">
            <div className="flex items-center justify-center gap-6">
              <div>
                <span className="text-xs text-slate-400 block uppercase font-semibold">Tingkat Kemiripan</span>
                <span className={`text-3xl font-black ${
                  isHigh ? 'text-rose-400' : isMedium ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {comparison.similarityPercentage}%
                </span>
                <span className="text-xs text-slate-300 block">Plagiat</span>
              </div>

              <div className="h-10 w-px bg-slate-700" />

              <div>
                <span className="text-xs text-slate-400 block uppercase font-semibold">Orisinalitas</span>
                <span className="text-3xl font-black text-blue-300">
                  {comparison.originalityPercentage}%
                </span>
                <span className="text-xs text-slate-300 block">Asli</span>
              </div>

              <div className="h-10 w-px bg-slate-700" />

              <div>
                <span className="text-xs text-slate-400 block uppercase font-semibold">Grade Mutu</span>
                <span className="text-3xl font-black text-purple-300">
                  {comparison.grade}
                </span>
                <span className="text-xs text-slate-300 block">{comparison.status}</span>
              </div>
            </div>
          </div>

          {/* Student B */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
              Mahasiswa B
            </span>
            <div className="text-lg font-extrabold text-slate-900 mt-1 truncate">
              {comparison.studentBName}
            </div>
            <div className="text-xs text-slate-500 mt-0.5 truncate flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              {comparison.fileBName}
            </div>
          </div>
        </div>

        {/* AI Analysis Note Box */}
        {comparison.aiAnalysisNotes && (
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <h3 className="text-sm font-bold text-indigo-950">
                Analisis AI Akademik (Gemini & Algoritma UNKLAB)
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-indigo-900/90 whitespace-pre-line leading-relaxed">
              {comparison.aiAnalysisNotes}
            </p>
          </div>
        )}
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('split')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'split'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <SplitSquareVertical className="w-4 h-4" />
            <span>Naskah Berdampingan (Dual Pane)</span>
          </button>

          <button
            onClick={() => setActiveTab('sections')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'sections'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <ListOrdered className="w-4 h-4" />
            <span>Daftar Kalimat Plagiat ({sections.length} Bagian)</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-rose-200 border border-rose-400 inline-block" />
            Bagian Terdeteksi Plagiat / Identik
          </span>
        </div>
      </div>

      {/* TAB 1: DUAL PANE SIDE-BY-SIDE VIEW */}
      {activeTab === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Pane: Mahasiswa A */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[700px]">
            <div className="bg-slate-100/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="font-bold text-sm text-slate-900">{comparison.studentAName}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{comparison.fileAName}</span>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-slate-800 font-serif">
              {paragraphsA.length === 0 ? (
                <p className="text-slate-400 italic">Tidak ada teks yang dapat diekstrak.</p>
              ) : (
                paragraphsA.map((para, pIdx) => {
                  const isMatch = isTextInSections(para, 'sentenceA');
                  return (
                    <p
                      key={pIdx}
                      className={`p-3 rounded-xl transition-all ${
                        isMatch
                          ? 'bg-rose-100/80 border-l-4 border-rose-500 text-slate-900 font-sans shadow-xs'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {isMatch && (
                        <span className="inline-block text-[10px] font-bold tracking-wider uppercase bg-rose-600 text-white px-1.5 py-0.5 rounded mr-2 align-middle font-mono">
                          Plagiat Sama
                        </span>
                      )}
                      <span>{para}</span>
                    </p>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane: Mahasiswa B */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[700px]">
            <div className="bg-slate-100/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                <span className="font-bold text-sm text-slate-900">{comparison.studentBName}</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">{comparison.fileBName}</span>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-slate-800 font-serif">
              {paragraphsB.length === 0 ? (
                <p className="text-slate-400 italic">Tidak ada teks yang dapat diekstrak.</p>
              ) : (
                paragraphsB.map((para, pIdx) => {
                  const isMatch = isTextInSections(para, 'sentenceB');
                  return (
                    <p
                      key={pIdx}
                      className={`p-3 rounded-xl transition-all ${
                        isMatch
                          ? 'bg-rose-100/80 border-l-4 border-rose-500 text-slate-900 font-sans shadow-xs'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {isMatch && (
                        <span className="inline-block text-[10px] font-bold tracking-wider uppercase bg-rose-600 text-white px-1.5 py-0.5 rounded mr-2 align-middle font-mono">
                          Plagiat Sama
                        </span>
                      )}
                      <span>{para}</span>
                    </p>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED MATCHED SECTIONS LIST */}
      {activeTab === 'sections' && (
        <div className="space-y-4">
          {sections.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 text-slate-500 space-y-2">
              <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-slate-800 text-base">Tidak Ditemukan Kalimat Plagiat</h3>
              <p className="text-xs text-slate-400">
                Kedua naskah mahasiswa memiliki susunan kata yang mandiri dan tingkat orisinalitas tinggi.
              </p>
            </div>
          ) : (
            sections.map((sec, sIdx) => (
              <div
                key={sIdx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 font-bold text-xs flex items-center justify-center">
                      #{sec.sectionIndex || sIdx + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-900">
                      Bagian Terindikasi {sec.matchType || 'PLAGIAT'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded border border-rose-200">
                      Kemiripan: {sec.similarityScore}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sentence A */}
                  <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200/70">
                    <div className="text-xs font-bold text-blue-600 mb-1.5 flex items-center justify-between">
                      <span>{comparison.studentAName}</span>
                      <span className="text-[11px] text-slate-400">Naskah A</span>
                    </div>
                    <p className="text-sm text-slate-800 font-serif leading-relaxed">
                      "{sec.sentenceA}"
                    </p>
                  </div>

                  {/* Sentence B */}
                  <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200/70">
                    <div className="text-xs font-bold text-indigo-600 mb-1.5 flex items-center justify-between">
                      <span>{comparison.studentBName}</span>
                      <span className="text-[11px] text-slate-400">Naskah B</span>
                    </div>
                    <p className="text-sm text-slate-800 font-serif leading-relaxed">
                      "{sec.sentenceB}"
                    </p>
                  </div>
                </div>

                {sec.note && (
                  <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 flex items-center gap-2">
                    <span className="font-semibold text-slate-700">Catatan Analisis:</span>
                    <span>{sec.note}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
