# Cara Akses Frontend dengan Benar

## ⚠️ PENTING: Jangan Akses Backend Langsung!

**Backend (127.0.0.1:8000)** = API saja, bukan frontend dengan styling!

**Frontend (localhost:3000)** = Aplikasi Next.js dengan styling lengkap!

## Cara Menjalankan Aplikasi

### 1. Jalankan Backend Server
```bash
cd backend
php artisan serve
```

### 2. Jalankan Frontend Development Server
```bash
cd frontend-l0
npm run dev
```

### 3. Akses Aplikasi di Browser

**Backend API**: http://127.0.0.1:8000
**Frontend App**: http://localhost:3000

**JANGAN akses http://127.0.0.1:8000** untuk melihat antarmuka pengguna - itu hanya API backend!

## Struktur Aplikasi

```
Backend (Laravel): http://127.0.0.1:8000
├── API Endpoints: /api/v1/*
└── Admin Panel: /admin

Frontend (React): http://localhost:5173
├── Home Page
├── Maps Page  
├── Playlist Page
└── Contact Page
```

## Troubleshooting

### Jika Halaman Masih Tidak Ada Styling:

1. **Pastikan Frontend Running:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Clear Browser Cache:**
   - Tekan `Ctrl + Shift + R` (Windows/Linux)
   - Atau `Cmd + Shift + R` (Mac)

3. **Check Console Browser:**
   - Tekan `F12` → Console tab
   - Cek apakah ada error

4. **Pastikan Mengakses Port yang Benar:**
   - Frontend: `localhost:5173` ✅
   - Bukan: `127.0.0.1:8000` ❌ (ini backend!)

### Jika Ada Error di Console:

**Error: "Cannot find module"**
```bash
cd frontend
npm install
```

**Error: "Port already in use"**
- Cek port yang digunakan Vite
- Atau ubah port: `npm run dev -- --port 3000`

## Verifikasi Frontend Berjalan

Setelah `npm run dev`, akan muncul:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose

  ➜  press h + enter to show help
```

**Gunakan URL tersebut untuk mengakses aplikasi!**

