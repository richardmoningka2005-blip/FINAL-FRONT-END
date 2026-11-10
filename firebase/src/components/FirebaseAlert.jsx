import { AlertTriangle, ExternalLink } from "lucide-react";

export default function FirebaseAlert() {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const isDefaultOrEmpty =
    !apiKey ||
    apiKey === "your_api_key_here" ||
    apiKey.includes("DemoPlaceholder");

  if (!isDefaultOrEmpty) return null;

  return (
    <div className="mb-6 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-amber-900 shadow-sm backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="text-xs sm:text-sm">
          <p className="font-bold text-amber-950">
            Perhatian: Konfigurasi Firebase Belum Lengkap!
          </p>
          <p className="mt-1 text-amber-800 leading-relaxed">
            Pastikan kredensial Firebase Anda sudah terisi pada file{" "}
            <code className="rounded-md bg-amber-200/60 px-1.5 py-0.5 font-mono text-xs font-semibold text-amber-950">
              .env
            </code>{" "}
            dan fitur <strong>Email/Password</strong> telah diaktifkan di Firebase Console.
          </p>
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 font-semibold text-amber-900 hover:text-amber-950 hover:underline"
          >
            Buka Firebase Console <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
