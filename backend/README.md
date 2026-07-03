# Sistem Informasi Karyawan (SI-Karyawan) - Backend API

Repositori ini berisi kode sumber backend untuk aplikasi **Sistem Informasi Karyawan (SI-Karyawan)** yang dibangun menggunakan **Laravel**. Backend ini berfungsi sebagai RESTful API yang melayani semua permintaan data dari aplikasi frontend (Next.js).

---

## 🏗️ Penjelasan Arsitektur Sistem

Aplikasi ini membagi tugas antara Backend dan Frontend menggunakan arsitektur modern:

### 1. Backend (Laravel) - Arsitektur MVC
Backend Laravel mengadopsi pola **MVC (Model-View-Controller)**. Namun, karena sistem ini dirancang sebagai API yang terpisah dari frontend:
* **Model:** Merepresentasikan struktur data tabel `karyawans` dan `users` serta aturan relasinya menggunakan Eloquent ORM.
* **View:** Tidak menggunakan Blade template tradisional, melainkan digantikan oleh representasi data berupa **JSON Response** yang dikirimkan melalui API endpoint.
* **Controller:** Mengelola alur logika aplikasi, validasi data masukan dari klien, autentikasi pengguna, serta pemrosesan data sebelum dikirimkan kembali.

### 2. Frontend (Next.js) - Arsitektur MVVM (Model-View-ViewModel)
Di sisi frontend, Next.js menggunakan pendekatan berbasis komponen React yang sejalan dengan **MVVM**:
* **Model:** Dilambangkan oleh data API yang didapat melalui pustaka Axios di frontend.
* **ViewModel:** Dikelola melalui React State dan `AuthContext` yang memegang logika autentikasi, status loading, dan sinkronisasi data dari API.
* **View:** Merupakan komponen visual UI (`page.tsx`, `tambah/page.tsx`, dll.) yang merender data secara dinamis berdasarkan state terbaru dari ViewModel.

---

## 🛠️ Stack Teknologi

* **Framework:** Laravel 11
* **Database:** SQLite (Sangat praktis untuk pengembangan lokal tanpa perlu konfigurasi DBMS tambahan)
* **Autentikasi:** Laravel Sanctum (Token-based Authentication)
* **Pengujian:** PHPUnit / Laravel Pest

---

## 🚀 Cara Menjalankan Backend Lokal

Ikuti langkah-langkah berikut untuk menjalankan server backend di komputer Anda:

### 1. Persiapan Awal
Pastikan Anda sudah masuk ke direktori `backend`:
```bash
cd backend
```

### 2. Instalasi Dependensi
Instal semua pustaka PHP yang diperlukan menggunakan Composer:
```bash
composer install
```

### 3. Konfigurasi Environment File
Salin file konfigurasi environment dari contoh:
```bash
cp .env.example .env
```
Secara bawaan, konfigurasi database sudah diarahkan ke SQLite:
```ini
DB_CONNECTION=sqlite
```

### 4. Generate Application Key
```bash
php artisan key:generate
```

### 5. Inisialisasi Database (Migrate & Seed)
Buat berkas database SQLite kosong di dalam folder `database/` (jika belum ada), lalu jalankan migrasi tabel beserta data awal (*seeder*):
```bash
# Membuat file database SQLite kosong jika belum tersedia
touch database/database.sqlite

# Menjalankan migrasi dan seeder
php artisan migrate --seed
```
*Catatan: Seeder akan otomatis membuat 1 akun administrator bawaan untuk kebutuhan login:*
* **Email:** `admin@karyawan.com`
* **Password:** `password`

### 6. Jalankan Server Lokal
Mulai server pengembangan Laravel:
```bash
php artisan serve
```
Secara bawaan, server API backend akan berjalan di `http://127.0.0.1:8000`.

---

## 🧪 Menjalankan Pengujian (Unit & Feature Testing)

Proyek ini telah dilengkapi dengan 10 kasus uji otomatis untuk menguji seluruh fungsi API (Login, Create, Read, Update, Delete, dan Validasi). Anda dapat menjalankannya dengan perintah:
```bash
php artisan test
```
