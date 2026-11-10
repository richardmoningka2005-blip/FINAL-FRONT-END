# Proyek Firebase Authentication & Dashboard

Proyek React + Vite yang terintegrasi dengan **Firebase Authentication** (Email & Password), dilengkapi rute terlindungi (`ProtectedRoute`), halaman Login, Register, dan Dashboard pengguna dengan styling Tailwind CSS.

---

## 🚀 Panduan Memulai

### 1. Jalankan Server Development
```bash
npm run dev
```

### 2. Hubungkan dengan Proyek Firebase Anda
Buka [Firebase Console](https://console.firebase.google.com/), buat proyek baru (atau gunakan proyek yang ada), lalu ikuti 2 langkah ini:

#### A. Aktifkan Fitur Email/Password
1. Buka menu **Build** → **Authentication**.
2. Klik tab **Sign-in method**.
3. Pilih **Email/Password** dan aktifkan statusnya (**Enable**), lalu simpan (**Save**).

#### B. Masukkan Kunci Konfigurasi Firebase
Buka **Project Settings** (ikon roda gigi di kiri atas) → scroll ke bagian **Your apps** → pilih aplikasi Web `</>`.
Salin konfigurasi Firebase dan masukkan ke dalam file `.env` di root proyek ini:

```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=nama-proyek-anda.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=nama-proyek-anda
VITE_FIREBASE_STORAGE_BUCKET=nama-proyek-anda.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:...
```
*(Atau Anda juga dapat mengisi langsung variabel konfigurasi pada file `src/firebase.js`)*

---

## 📁 Struktur File Utama

- [src/firebase.js](src/firebase.js): Inisialisasi Firebase App dan Auth
- [src/context/AuthContext.jsx](src/context/AuthContext.jsx): Context provider untuk state login, register, dan logout
- [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx): Komponen pembatas akses (hanya untuk pengguna yang sudah login)
- [src/components/FirebaseAlert.jsx](src/components/FirebaseAlert.jsx): Notifikasi pengingat jika konfigurasi Firebase belum diisi
- [src/pages/Login.jsx](src/pages/Login.jsx): Halaman masuk dengan penanganan pesan error lengkap
- [src/pages/Register.jsx](src/pages/Register.jsx): Halaman pendaftaran akun baru
- [src/pages/Dashboard.jsx](src/pages/Dashboard.jsx): Dashboard informasi akun pengguna dan tombol keluar
