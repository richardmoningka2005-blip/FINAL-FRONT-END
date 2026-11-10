import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  User,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Calendar,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  Mail,
  Send,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  KeyRound,
  FileText,
  LayoutDashboard,
  Shield,
  Layers,
} from "lucide-react";

export default function Dashboard() {
  const { currentUser, logout, updateUserProfile, sendVerification } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'notes', 'security'

  // State untuk Toast Notification
  const [toast, setToast] = useState({ show: false, message: "", type: "info" });

  function showToast(message, type = "success") {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "info" });
    }, 3000);
  }

  // State untuk Copy UID
  const [copiedUid, setCopiedUid] = useState(false);

  // State untuk Uptime Counter
  const [secondsOnline, setSecondsOnline] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsOnline((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function formatUptime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? "0" : ""}${secs}s`;
  }

  // Greeting berdasarkan jam
  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 11) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  })();

  // State untuk Edit Nama Profil
  const [displayNameInput, setDisplayNameInput] = useState(
    currentUser?.displayName || ""
  );
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // State untuk Kirim Verifikasi Email
  const [isSendingVerification, setIsSendingVerification] = useState(false);

  // State untuk Catatan / Todo Interaktif
  const storageKey = `firebase_app_notes_${currentUser?.uid || "guest"}`;
  const [notes, setNotes] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: "1",
              title: "Pelajari Firebase Authentication",
              category: "Belajar",
              completed: true,
            },
            {
              id: "2",
              title: "Uji coba registrasi akun baru",
              category: "Testing",
              completed: true,
            },
            {
              id: "3",
              title: "Eksplorasi Firestore & Cloud Storage",
              category: "Rencana",
              completed: false,
            },
          ];
    } catch {
      return [];
    }
  });
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteCategory, setNewNoteCategory] = useState("Pekerjaan");

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
    } catch (e) {
      console.error(e);
    }
  }, [notes, storageKey]);

  function handleAddNote(e) {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    const newNote = {
      id: Date.now().toString(),
      title: newNoteTitle.trim(),
      category: newNoteCategory,
      completed: false,
    };
    setNotes([newNote, ...notes]);
    setNewNoteTitle("");
    showToast("Catatan berhasil ditambahkan!");
  }

  function handleToggleNote(id) {
    setNotes(
      notes.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n))
    );
  }

  function handleDeleteNote(id) {
    setNotes(notes.filter((n) => n.id !== id));
    showToast("Catatan berhasil dihapus", "info");
  }

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
      showToast("Gagal keluar dari sesi.", "error");
    } finally {
      setLoggingOut(false);
    }
  }

  function handleCopyUid() {
    if (currentUser?.uid) {
      navigator.clipboard.writeText(currentUser.uid);
      setCopiedUid(true);
      showToast("Firebase UID berhasil disalin ke clipboard!");
      setTimeout(() => setCopiedUid(false), 2000);
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();
    if (!displayNameInput.trim()) return;
    try {
      setIsUpdatingProfile(true);
      await updateUserProfile(displayNameInput.trim());
      showToast("Nama profil berhasil diperbarui!");
    } catch (err) {
      console.error(err);
      showToast("Gagal memperbarui profil.", "error");
    } finally {
      setIsUpdatingProfile(false);
    }
  }

  async function handleSendVerification() {
    try {
      setIsSendingVerification(true);
      await sendVerification();
      showToast("Email verifikasi telah dikirim! Cek inbox/spam.");
    } catch (err) {
      console.error(err);
      showToast(
        err.code === "auth/too-many-requests"
          ? "Terlalu sering mengirim email. Coba lagi nanti."
          : "Gagal mengirim email verifikasi.",
        "error"
      );
    } finally {
      setIsSendingVerification(false);
    }
  }

  // Waktu format
  const lastLogin = currentUser?.metadata?.lastSignInTime
    ? new Date(currentUser.metadata.lastSignInTime).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Baru saja";

  const createdAt = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-";

  const userInitial = (
    currentUser?.displayName?.[0] ||
    currentUser?.email?.[0] ||
    "U"
  ).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Background Glow Accents */}
      <div className="pointer-events-none fixed top-0 left-1/4 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo & Project Tag */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25">
              <Flame className="h-5 w-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white">
                  Firebase Dashboard
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live SDK
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                Project: {import.meta.env.VITE_FIREBASE_PROJECT_ID || "fir-f8dea"}
              </p>
            </div>
          </div>

          {/* User Profile Badge & Logout Button */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 py-1.5 px-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
                {userInitial}
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-200">
                  {currentUser?.displayName || currentUser?.email?.split("@")[0]}
                </p>
                <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs sm:text-sm font-semibold text-red-400 transition-all hover:bg-red-500/20 hover:border-red-500/50 active:scale-95 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">
                {loggingOut ? "Keluar..." : "Keluar"}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex gap-2 border-t border-slate-800/60 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> Ringkasan
          </button>

          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "notes"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> Catatan Interaktif
            <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px]">
              {notes.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "security"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Shield className="h-3.5 w-3.5" /> Keamanan & Akun
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Hero Banner with Futuristic Design */}
            <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-900/60 via-indigo-950/70 to-slate-950 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  {greeting}, {currentUser?.displayName || currentUser?.email?.split("@")[0]}
                </div>
                <h1 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                  Dashboard Firebase Authentication
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
                  Akun Anda aktif dan terverifikasi di server cloud Firebase. Anda dapat mengelola profil, menguji keamanan token, dan mengatur catatan Anda.
                </p>

                {/* Quick Session Indicator */}
                <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-2 rounded-xl bg-slate-900/80 px-3.5 py-2 border border-slate-800">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>Lama Sesi Aktif:</span>
                    <span className="font-mono font-bold text-white">
                      {formatUptime(secondsOnline)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 rounded-xl bg-slate-900/80 px-3.5 py-2 border border-slate-800">
                    <Zap className="h-4 w-4 text-amber-400" />
                    <span>Protokol:</span>
                    <span className="font-semibold text-emerald-400">
                      HTTPS / JWT OAuth2
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
              <div className="pointer-events-none absolute right-40 -top-10 h-52 w-52 rounded-full bg-purple-500/10 blur-2xl" />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Stat 1: Status Akun */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Status Akun
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-lg font-bold text-white">Aktif & Terlindungi</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  Sesi valid di browser
                </div>
              </div>

              {/* Stat 2: Email Terdaftar */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Email Pengguna
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Mail className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-sm font-bold text-white truncate" title={currentUser?.email}>
                  {currentUser?.email}
                </p>
                <p className="mt-1 text-xs text-slate-400">Penyedia: Password Auth</p>
              </div>

              {/* Stat 3: Sesi Terakhir */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Login Terakhir
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm font-bold text-white truncate" title={lastLogin}>
                  {lastLogin}
                </p>
                <p className="mt-1 text-xs text-slate-400">Riwayat otentikasi</p>
              </div>

              {/* Stat 4: Tanggal Pembuatan */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm backdrop-blur-sm transition-all hover:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Terdaftar Pada
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm font-bold text-white truncate" title={createdAt}>
                  {createdAt}
                </p>
                <p className="mt-1 text-xs text-slate-400">Registrasi akun baru</p>
              </div>
            </div>

            {/* Interactive Firebase UID Card with Copy Tool */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">Firebase Identity UID</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ID Unik Pengguna ini dibuat oleh Firebase Auth dan digunakan sebagai primary key pada Firestore database.
                  </p>
                </div>
                <button
                  onClick={handleCopyUid}
                  className="inline-flex items-center gap-2 self-start sm:self-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:bg-blue-500 active:scale-95"
                >
                  {copiedUid ? (
                    <>
                      <Check className="h-4 w-4 text-white" /> UID Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Salin UID
                    </>
                  )}
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  Firebase User UID (auth.currentUser.uid)
                </span>
                <p className="mt-1 font-mono text-xs sm:text-sm text-blue-400 break-all select-all">
                  {currentUser?.uid}
                </p>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => setActiveTab("notes")}
                className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-blue-500/50 hover:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Catatan Interaktif</h4>
                      <p className="text-xs text-slate-400">
                        {notes.length} item tersimpan untuk akun ini
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                    Buka →
                  </span>
                </div>
              </div>

              <div
                onClick={() => setActiveTab("security")}
                className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-purple-500/50 hover:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">Keamanan & Profil</h4>
                      <p className="text-xs text-slate-400">
                        Ubah nama tampilan & status verifikasi
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                    Kelola →
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: INTERACTIVE NOTES / TASK ==================== */}
        {activeTab === "notes" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Catatan & Tugas Pengguna
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Fitur interaktif ini terikat dengan ID akun Anda. Anda bisa menambah, mencentang, dan menghapus tugas.
                </p>
              </div>
            </div>

            {/* Input Form Tambah Catatan */}
            <form
              onSubmit={handleAddNote}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 flex flex-col sm:flex-row gap-3"
            >
              <input
                type="text"
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                placeholder="Tulis catatan atau tugas baru..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />

              <select
                value={newNoteCategory}
                onChange={(e) => setNewNoteCategory(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-300 focus:border-blue-500 focus:outline-none"
              >
                <option value="Pekerjaan">💼 Pekerjaan</option>
                <option value="Belajar">📚 Belajar</option>
                <option value="Pribadi">⭐ Pribadi</option>
                <option value="Testing">🧪 Testing</option>
              </select>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition-all"
              >
                <Plus className="h-4 w-4" /> Tambah
              </button>
            </form>

            {/* Daftar Catatan */}
            <div className="space-y-2.5">
              {notes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
                  <FileText className="mx-auto h-10 w-10 text-slate-600 mb-2" />
                  <p className="font-semibold text-slate-400">Belum ada catatan</p>
                  <p className="text-xs">Tuliskan tugas pertama Anda di atas!</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className={`flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                      note.completed
                        ? "border-slate-900 bg-slate-950/40 opacity-70"
                        : "border-slate-800 bg-slate-900/70 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => handleToggleNote(note.id)}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                          note.completed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-600 hover:border-slate-400"
                        }`}
                      >
                        {note.completed && <Check className="h-3.5 w-3.5" />}
                      </button>

                      <span
                        className={`text-sm truncate ${
                          note.completed
                            ? "text-slate-500 line-through"
                            : "text-slate-100 font-medium"
                        }`}
                      >
                        {note.title}
                      </span>

                      <span className="hidden sm:inline-block rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 text-[10px] font-medium text-slate-400">
                        {note.category}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: SECURITY & PROFILE ==================== */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Keamanan & Pengaturan Profil
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Atur identitas akun Anda dan verifikasi email melalui Firebase Auth SDK.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Ganti Nama Tampilan (Display Name) */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Perbarui Nama Tampilan</h3>
                    <p className="text-xs text-slate-400">
                      Disimpan di properti <code>currentUser.displayName</code>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Nama Tampilan Baru
                    </label>
                    <input
                      type="text"
                      value={displayNameInput}
                      onChange={(e) => setDisplayNameInput(e.target.value)}
                      placeholder="Contoh: Budi Santoso"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    {isUpdatingProfile ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </form>
              </div>

              {/* Status Verifikasi Email */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Status Verifikasi Email</h3>
                    <p className="text-xs text-slate-400">
                      Keamanan akun terhadap kepemilikan email
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Status Email:</span>
                    {currentUser?.emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400">
                        <ShieldAlert className="h-4 w-4" /> Belum Terverifikasi
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Email terdaftar: <strong>{currentUser?.email}</strong>
                  </p>
                </div>

                {!currentUser?.emailVerified && (
                  <button
                    onClick={handleSendVerification}
                    disabled={isSendingVerification}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {isSendingVerification
                      ? "Mengirim Email..."
                      : "Kirim Email Verifikasi Sekarang"}
                  </button>
                )}
              </div>
            </div>

            {/* Cloud Architecture Info */}
            <div className="rounded-3xl border border-indigo-500/20 bg-indigo-950/20 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">
                    Arsitektur Firebase Terhubung
                  </h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                    Aplikasi ini menggunakan <code>firebase/auth</code> dengan penyimpanan sesi terenkripsi di <code>IndexedDB / LocalStorage</code> browser. Token sesi akan di-refresh otomatis setiap 1 jam tanpa perlu login ulang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Interactive Toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-slate-700 bg-slate-900/95 px-4 py-3 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-100">
            {toast.message}
          </p>
        </div>
      )}
    </div>
  );
}
