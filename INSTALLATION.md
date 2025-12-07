# 🚀 Panduan Instalasi Cepat

## Langkah-langkah Instalasi

### 1. Persiapan
```bash
# Pastikan Node.js terinstall (versi 18+)
node --version

# Clone repository
git clone https://github.com/Mrizallr/disperindag-kemetrologian.git
cd disperindag-kemetrologian
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database Supabase

1. **Buat Project Supabase**:
   - Kunjungi [supabase.com](https://supabase.com)
   - Klik "Start your project" → "New Project"
   - Isi nama project dan password database

2. **Copy Kredensial**:
   - Di dashboard Supabase, klik "Settings" → "API"
   - Copy **Project URL** dan **anon public key**

3. **Setup Environment**:
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Setup Database Tables

Di Supabase SQL Editor, jalankan script berikut:

#### A. Tabel Pelaku Usaha
```sql
-- Copy dan paste isi file: database-schema/pengajuan_tera.sql
```

#### B. Tabel Tera Ulang
```sql
-- Copy dan paste isi file: tera-ulang-setup.sql
```

#### C. Setup Security
```sql
-- Copy dan paste isi file: setup-rls.sql
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```

Buka browser: **http://localhost:5173**

## ✅ Verifikasi Instalasi

1. **Dashboard terbuka** tanpa error
2. **Data dapat ditambah** di form pelaku usaha
3. **Charts menampilkan data** (mungkin kosong jika belum ada data)
4. **Form tera ulang berfungsi** dengan radio button bulat

## 🔧 Jika Ada Masalah

### Error: "Supabase connection failed"
- Periksa `.env.local` sudah benar
- Restart server: `Ctrl+C` lalu `npm run dev`

### Error: "Table doesn't exist"
- Pastikan SQL scripts sudah dijalankan di Supabase
- Cek di Supabase → Table Editor apakah tabel sudah ada

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 Butuh Bantuan?

Buat issue di GitHub repository dengan detail error yang dialami.