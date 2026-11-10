import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  History as HistoryIcon, 
  Trash2, 
  Eye, 
  Files, 
  Calendar, 
  BookOpen, 
  Plus, 
  Loader2,
  AlertTriangle,
  Database
} from 'lucide-react';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:8080/api/sessions');
      if (!res.ok) {
        throw new Error('Gagal memuat riwayat sesi dari server H2.');
      }
      const data = await res.json();
      setSessions(data || []);
    } catch (err) {
      setError(err.message || 'Koneksi ke server Spring Boot gagal.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Yakin ingin menghapus sesi "${title}" beserta semua hasil perbandingannya?`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`http://localhost:8080/api/sessions/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Gagal menghapus sesi.');
      }
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert(err.message || 'Gagal menghapus sesi.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Riwayat Sesi Pemeriksaan
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Data tersimpan permanen di database lokal <strong>H2 (Spring Boot)</strong>.
          </p>
        </div>

        <Link
          to="/check"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Pemeriksaan Baru</span>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-slate-600">Memuat data dari database H2...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl max-w-lg mx-auto text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm font-semibold">{error}</p>
          <button
            onClick={fetchSessions}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold"
          >
            Coba Lagi
          </button>
        </div>
      ) : sessions.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <HistoryIcon className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Belum Ada Sesi Pemeriksaan</h3>
          <p className="text-xs text-slate-500">
            Anda belum pernah menjalankan pemeriksaan multi-file. Mulai dengan mengunggah berkas mahasiswa kelas Anda.
          </p>
          <Link
            to="/check"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />
            Mulai Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Sesi #{sess.id}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(sess.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-3 line-clamp-1">
                  {sess.sessionTitle}
                </h3>

                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{sess.courseName}</span>
                </p>

                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <div className="text-xl font-black text-slate-800">{sess.totalFiles}</div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Berkas</div>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <div className="text-xl font-black text-indigo-600">{sess.totalPairs}</div>
                    <div className="text-[11px] text-slate-400 uppercase font-semibold">Pasangan</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Link
                  to={`/results/${sess.id}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Hasil</span>
                </Link>

                <button
                  onClick={() => handleDelete(sess.id, sess.sessionTitle)}
                  disabled={deletingId === sess.id}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                  title="Hapus sesi ini dari database"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
