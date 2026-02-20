# 🚀 FAS Test - Blog CMS Dashboard

Dashboard Admin modern dan responsif untuk manajemen konten blog. Proyek ini dibangun sebagai bagian dari teknis tes menggunakan **React (Vite)**, **TypeScript**, dan **Zustand**.

## 🔗 Repository
- **GitHub:** [https://github.com/elnobrianardi/fas-test.git](https://github.com/elnobrianardi/fas-test.git)

---

## 🛠️ Tech Stack

Aplikasi ini menggunakan kombinasi library modern untuk performa maksimal:

- **Framework:** React 18 (Vite)
- **Language:** TypeScript
- **State Management:** Zustand
- **Styling:** Tailwind CSS + Shadcn/UI
- **Icons:** Lucide React
- **API Integration:** ImgBB API (Cloud Image Hosting)

---

## 🚀 Cara Install & Run

Ikuti langkah-langkah berikut untuk menjalankan proyek di lokal:

### 1. Clone Repository
```
git clone [https://github.com/elnobrianardi/fas-test.git](https://github.com/elnobrianardi/fas-test.git)
cd fas-test
```

### 2. Install Dependencies
```
npm install
```

### 3. Konfigurasi Environment
Buat file .env di root folder dan tambahkan API Key ImgBB (Gunakan prefix VITE_ agar terbaca oleh Vite):

```
VITE_IMGBB_API_KEY=128aa19f55b4860ce9814f749f910113
```

### 4. Jalankan Aplikasi
```
npm run dev
Akses dashboard melalui http://localhost:5173
```

### 🔐 Akses Login (Dummy)
Gunakan kredensial berikut untuk masuk ke dashboard:

```
Email: admin@fas.id
Password: password123
```

### 🏗️ Arsitektur Aplikasi
Aplikasi ini menggunakan pola arsitektur yang modular untuk kemudahan skalabilitas:

✅ State Global: Mengelola data Post dan Category secara terpusat menggunakan Zustand.

✅ Image Handling: Proses upload gambar langsung ke Cloud (ImgBB) dari sisi client menggunakan FormData API.

✅ Routing: Navigasi antar halaman admin menggunakan react-router-dom.

### ✨ Fitur Utama
✅ Dashboard Overview: Statistik jumlah artikel dan kategori secara real-time.

✅ Post Management: CRUD artikel lengkap dengan auto-generated slug dan preview gambar.

✅ Category Management: Manajemen kategori dengan sistem pagination dan slug otomatis.

✅ Cloud Image Upload: Integrasi ImgBB API untuk efisiensi penyimpanan aset gambar.

✅ Responsive Design: Antarmuka yang optimal di berbagai ukuran layar (Desktop & Mobile).