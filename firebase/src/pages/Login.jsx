import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FirebaseAlert from "../components/FirebaseAlert";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  KeyRound,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // State untuk Modal Lupa Password
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState({ type: "", text: "" });
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login, resetPassword, currentUser } = useAuth();
  const navigate = useNavigate();

  // Jika sudah login, redirect ke dashboard
  if (currentUser) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  function getErrorMessage(code) {
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Email atau kata sandi tidak cocok. Silakan cek kembali.";
      case "auth/invalid-email":
        return "Format alamat email tidak valid.";
      case "auth/user-disabled":
        return "Akun ini telah dinonaktifkan oleh sistem.";
      case "auth/too-many-requests":
        return "Terlalu banyak percobaan gagal. Silakan coba lagi beberapa saat lagi.";
      case "auth/network-request-failed":
        return "Gagal terhubung. Pastikan perangkat Anda terkoneksi ke internet.";
      default:
        return "Gagal masuk. Periksa kembali informasi akun Anda.";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Silakan lengkapi kolom email dan kata sandi.");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMsg({ type: "error", text: "Ketik alamat email Anda terlebih dahulu." });
      return;
    }

    try {
      setForgotLoading(true);
      setForgotMsg({ type: "", text: "" });
      await resetPassword(forgotEmail);
      setForgotMsg({
        type: "success",
        text: "Tautan reset kata sandi telah dikirim ke email Anda! Silakan cek kotak masuk atau folder spam.",
      });
    } catch (err) {
      console.error("Reset error:", err);
      setForgotMsg({
        type: "error",
        text: err.code === "auth/user-not-found"
          ? "Email tidak terdaftar di sistem."
          : "Gagal mengirim tautan reset. Pastikan email valid.",
      });
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Animated Gradient Blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-emerald-600/15 blur-3xl" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left Section: Interactive Showcase (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 bg-gradient-to-br from-blue-900/50 via-indigo-950/60 to-slate-950 border-r border-slate-800">
          <div>
            {/* Project Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30">
                <Zap className="h-6 w-6 fill-white" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Firebase Portal
                </span>
                <span className="block text-xs font-medium text-orange-400">
                  Authentication App
                </span>
              </div>
            </div>

            {/* Feature Highlight */}
            <div className="mt-12 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                <Sparkles className="h-3.5 w-3.5" />
                Vite + React 19 + Firebase SDK
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                Keamanan & Performa Kelas Dunia.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Akses dashboard terintegrasi dengan Firebase Cloud Authentication. Manajemen sesi instan, verifikasi email, dan perlindungan token.
              </p>
            </div>
          </div>

          {/* Interactive Feature Pills */}
          <div className="space-y-3 pt-8">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3.5 backdrop-blur-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-200">End-to-End Encrypted</p>
                <p className="text-slate-500">Standar keamanan Firebase Google</p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/70 px-4 py-3 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Firebase Project ID:
              </span>
              <span className="font-mono text-emerald-400 font-medium">
                {import.meta.env.VITE_FIREBASE_PROJECT_ID || "fir-f8dea"}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Interactive Login Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Header & Tabs */}
          <div className="mb-6">
            <div className="flex items-center justify-between pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Masuk ke Akun
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Masukkan kredensial Anda untuk melanjutkan
                </p>
              </div>
              <Link
                to="/register"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Buat Akun Baru <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Quick Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-800 bg-slate-950/60 p-1">
              <button
                type="button"
                className="rounded-xl bg-blue-600 py-2 text-xs font-semibold text-white shadow-sm"
              >
                Masuk
              </button>
              <Link
                to="/register"
                className="rounded-xl py-2 text-center text-xs font-semibold text-slate-400 transition-colors hover:text-white"
              >
                Daftar Baru
              </Link>
            </div>
          </div>

          <FirebaseAlert />

          {/* Error Banner */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-400 animate-in fade-in">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold text-red-300">Gagal Masuk: </span>
                {error}
              </div>
              <button
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                Alamat Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="contoh@gmail.com"
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 transition-all focus:border-blue-500 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  Lupa Sandi?
                </button>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Masukkan kata sandi..."
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 pl-10 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-600 transition-all focus:border-blue-500 focus:bg-slate-950 focus:ring-4 focus:ring-blue-500/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded-md border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/40 focus:ring-offset-0"
                />
                Ingat saya di perangkat ini
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:bg-[position:right_center] hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Sedang Masuk...</span>
                </>
              ) : (
                <>
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Mobile Footer */}
          <p className="mt-8 text-center text-xs text-slate-500 sm:hidden">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-400 hover:text-blue-300 underline"
            >
              Daftar akun baru
            </Link>
          </p>
        </div>
      </div>

      {/* Modal Lupa Password */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => {
                setShowForgotModal(false);
                setForgotMsg({ type: "", text: "" });
              }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <KeyRound className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-bold text-white">Reset Kata Sandi</h3>
            <p className="mt-1 text-xs text-slate-400">
              Masukkan alamat email Anda, kami akan mengirimkan tautan untuk mengatur ulang kata sandi melalui Firebase.
            </p>

            {forgotMsg.text && (
              <div
                className={`mt-4 flex items-start gap-2 rounded-xl p-3 text-xs ${
                  forgotMsg.type === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border border-red-500/30 bg-red-500/10 text-red-300"
                }`}
              >
                {forgotMsg.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                )}
                <span>{forgotMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Email Akun Anda
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-3.5 left-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="nama@email.com"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-60 transition-colors"
                >
                  {forgotLoading ? "Mengirim..." : "Kirim Tautan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
