# Sistem Informasi Karyawan (SI-Karyawan) - Frontend Website

Repositori ini berisi kode sumber frontend untuk aplikasi **Sistem Informasi Karyawan (SI-Karyawan)** yang dibangun menggunakan **Next.js 16 (App Router)** dan **TypeScript**. Frontend ini dirancang dengan gaya modern berbasis *Glassmorphism* dan terhubung langsung ke backend Laravel API.

---

## 🏗️ Fitur Utama Frontend

1. **Autentikasi Pengguna:** Halaman Login terproteksi menggunakan JWT/Sanctum Token yang disimpan aman di LocalStorage.
2. **Dashboard Manajemen:** Menampilkan statistik cepat (Total Karyawan, Aktif, Nonaktif), fitur pencarian karyawan, dan filter status keaktifan.
3. **Manajemen Karyawan (CRUD):**
   * Tambah data karyawan baru lengkap dengan validasi form.
   * Lihat detail data karyawan.
   * Perbarui data karyawan.
   * Hapus data karyawan dengan konfirmasi modal modern.
4. **Desain Responsif & Premium:** Antarmuka bergaya *glassmorphism* yang responsif dan nyaman digunakan di berbagai perangkat.

---

## 🛠️ Stack Teknologi

* **Framework:** Next.js 16 (React 19)
* **Bahasa:** TypeScript
* **Styling:** Vanilla CSS (Desain kustom tanpa pustaka pihak ketiga untuk fleksibilitas tinggi)
* **Koneksi API:** Axios

---

## 🚀 Cara Menjalankan Frontend Lokal

Ikuti langkah-langkah berikut untuk menjalankan server frontend di komputer Anda:

### 1. Persiapan Awal
Pastikan Anda sudah berada di direktori `frontend`:
```bash
cd frontend
```

### 2. Instalasi Dependensi
Instal semua dependensi Node.js yang diperlukan:
```bash
npm install
```

### 3. Konfigurasi Environment File
Secara bawaan, frontend sudah dikonfigurasi untuk terhubung ke API backend lokal yang berjalan di `http://127.0.0.1:8000/api`. Jika backend Anda berjalan di port yang berbeda, Anda dapat menyesuaikannya pada konfigurasi Axios di `src/services/api.ts`.

### 4. Menjalankan Server Pengembangan Lokal
Mulai server Next.js dalam mode pengembangan:
```bash
npm run dev
```
Buka browser Anda dan akses halaman web di `http://localhost:3000`.

### 5. Build Produksi
Jika ingin memeriksa kualitas build produksi Next.js, Anda dapat menjalankan perintah berikut:
```bash
npm run build
npm run start
```
Semua halaman akan dioptimalkan secara statis demi performa terbaik.
