import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FirebaseAlert from "../components/FirebaseAlert";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  Sparkles,
  Check,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, currentUser } = useAuth();
  const navigate = useNavigate();

  // Jika sudah login, redirect ke dashboard
  if (currentUser) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  // Kalkulasi kekuatan kata sandi secara interaktif
  const passwordCriteria = useMemo(() => {
    return {
      length: password.length >= 6,
      number: /\d/.test(password),
      upper: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  }, [password]);

  const passwordScore = useMemo(() => {
    let score = 0;
    if (passwordCriteria.length) score += 25;
    if (passwordCriteria.number) score += 25;
    if (passwordCriteria.upper) score += 25;
    if (passwordCriteria.special) score += 25;
    return score;
  }, [passwordCriteria]);

  const strengthLabel = useMemo(() => {
    if (!password) return { text: "Belum diisi", color: "text-slate-500", bar: "bg-slate-700" };
    if (passwordScore <= 25) return { text: "Sangat Lemah", color: "text-red-400", bar: "bg-red-500" };
    if (passwordScore <= 50) return { text: "Cukup", color: "text-amber-400", bar: "bg-amber-500" };
    if (passwordScore <= 75) return { text: "Baik", color: "text-blue-400", bar: "bg-blue-500" };
    return { text: "Sangat Kuat", color: "text-emerald-400", bar: "bg-emerald-500" };
  }, [password, passwordScore]);

  const isPasswordMatch = confirmPassword.length > 0 && password === confirmPassword;
  const isPasswordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  function getErrorMessage(code) {
    switch (code) {
      case "auth/email-already-in-use":
        return "Email ini sudah terdaftar. Silakan gunakan menu Masuk atau gunakan email lain.";
      case "auth/invalid-email":
        return "Format alamat email tidak valid.";
      case "auth/weak-password":
        return "Kata sandi terlalu lemah. Minimal 6 karakter.";
      case "auth/operation-not-allowed":
        return "Metode Email/Password belum diaktifkan di Firebase Console.";
      case "auth/network-request-failed":
        return "Gagal terhubung. Pastikan perangkat Anda terkoneksi ke internet.";
      default:
        return "Pendaftaran akun gagal. Silakan coba lagi.";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Silakan isi semua data formulir.");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi harus terdiri dari minimal 6 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok dengan kata sandi yang dibuat.");
      return;
    }

    try {
      setLoading(true);
      await register(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background Animated Gradient Blobs */}
      <div className="pointer-events-none absolute -top-40 right-10 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -left-40 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-cyan-600/15 blur-3xl" />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left Section: Interactive Showcase (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-10 bg-gradient-to-br from-indigo-950/60 via-purple-950/40 to-slate-950 border-r border-slate-800">
          <div>
            {/* Project Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white">
                  Firebase Portal
                </span>
                <span className="block text-xs font-medium text-purple-400">
                  Registrasi Pengguna
                </span>
              </div>
            </div>

            {/* Feature Highlight */}
            <div className="mt-12 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
                <Sparkles className="h-3.5 w-3.5" />
                Akun Instan & Gratis
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                Mulai Perjalanan Anda Hari Ini.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Buat akun hanya dalam beberapa detik. Nikmati integrasi Firebase Authentication dengan keamanan enkripsi modern.
              </p>
            </div>
          </div>

          {/* Interactive Feature List */}
          <div className="space-y-3 pt-6">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3.5 backdrop-blur-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-200">Verifikasi Email Mandiri</p>
                <p className="text-slate-500">Kirim email verifikasi langsung dari dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3.5 backdrop-blur-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <Shield className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-200">Protected Routes</p>
                <p className="text-slate-500">Akses dashboard terlindungi token JWT Firebase</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Form Register */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          {/* Header & Tabs */}
          <div className="mb-6">
            <div className="flex items-center justify-between pb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Buat Akun Baru
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Daftarkan email Anda untuk membuka akses sistem
                </p>
              </div>
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Sudah Punya Akun? <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 rounded-2xl border border-slate-800 bg-slate-950/60 p-1">
              <Link
                to="/login"
                className="rounded-xl py-2 text-center text-xs font-semibold text-slate-400 transition-colors hover:text-white"
              >
                Masuk
              </Link>
              <button
                type="button"
                className="rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white shadow-sm"
              >
                Daftar Baru
              </button>
            </div>
          </div>

          <FirebaseAlert />

          {/* Error Banner */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs sm:text-sm text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold text-red-300">Pendaftaran Gagal: </span>
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
                  placeholder="nama@email.com"
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 pl-10 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 transition-all focus:border-indigo-500 focus:bg-slate-950 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-slate-400">
                Kata Sandi
              </label>
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
                  placeholder="Minimal 6 karakter"
                  required
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 pl-10 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-600 transition-all focus:border-indigo-500 focus:bg-slate-950 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="mt-2.5 rounded-xl border border-slate-800/80 bg-slate-950/50 p-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Kekuatan Sandi:</span>
                    <span className={`font-semibold ${strengthLabel.color}`}>
                      {strengthLabel.text}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full transition-all duration-300 ${strengthLabel.bar}`}
                      style={{ width: `${passwordScore}%` }}
                    />
                  </div>

                  {/* Checklist */}
                  <div className="mt-2.5 grid grid-cols-2 gap-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {passwordCriteria.length ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-slate-600" />
                      )}
                      <span className={passwordCriteria.length ? "text-slate-300" : "text-slate-500"}>
                        Min. 6 Karakter
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {passwordCriteria.number ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-slate-600" />
                      )}
                      <span className={passwordCriteria.number ? "text-slate-300" : "text-slate-500"}>
                        Ada Angka (0-9)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {passwordCriteria.upper ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-slate-600" />
                      )}
                      <span className={passwordCriteria.upper ? "text-slate-300" : "text-slate-500"}>
                        Huruf Besar (A-Z)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {passwordCriteria.special ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-slate-600" />
                      )}
                      <span className={passwordCriteria.special ? "text-slate-300" : "text-slate-500"}>
                        Simbol Spesial
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Confirm Password */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400">
                  Konfirmasi Kata Sandi
                </label>
                {isPasswordMatch && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <Check className="h-3 w-3" /> Cocok
                  </span>
                )}
                {isPasswordMismatch && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-red-400">
                    <X className="h-3 w-3" /> Belum Cocok
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Ulangi kata sandi Anda..."
                  required
                  className={`w-full rounded-2xl border bg-slate-950/80 pl-10 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-600 transition-all focus:bg-slate-950 focus:outline-none ${
                    isPasswordMismatch
                      ? "border-red-500/80 focus:border-red-500 focus:ring-4 focus:ring-red-500/20"
                      : isPasswordMatch
                      ? "border-emerald-500/80 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      : "border-slate-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:bg-[position:right_center] hover:shadow-xl hover:shadow-indigo-500/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <>
                  <span>Daftar Akun Baru</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Mobile Footer */}
          <p className="mt-8 text-center text-xs text-slate-500 sm:hidden">
            Sudah memiliki akun?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-400 hover:text-indigo-300 underline"
            >
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
