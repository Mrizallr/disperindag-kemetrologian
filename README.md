# 🏛️ Kemetrologian Dashboard - Dinas Perindustrian dan Perdagangan

Sistem pengelolaan data kemetrologian dengan dashboard interaktif dan manajemen data UTTP (Ukur, Takar, Timbang, Panjang).

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Tech Stack](#️-tech-stack)
- [Prasyarat](#-prasyarat)
- [Instalasi](#-instalasi)
- [Konfigurasi Database](#️-konfigurasi-database)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Struktur Project](#-struktur-project)
- [Fitur Dashboard](#-fitur-dashboard)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)

## ✨ Fitur Utama

### 📊 Dashboard Analytics
- **Real-time Statistics** - Total pelaku usaha, UTTP terdaftar, tera ulang bulanan
- **Interactive Charts** - Status tera (pie chart) dan distribusi jenis lapak (bar chart)
- **Monthly Progress** - Tracking pendaftaran baru dan kepatuhan UTTP
- **Recent Data** - Pelaku usaha yang baru didaftarkan

### 🗂️ Data Management
- **CRUD Operations** - Tambah, edit, hapus data pelaku usaha
- **Advanced Filtering** - Filter berdasarkan status, jenis lapak, lokasi
- **Export Data** - Export ke Excel dan PDF
- **Search & Pagination** - Pencarian cepat dengan pagination

### 📝 Content Management
- **Form Tera Ulang** - Input dan kelola data tera ulang UTTP
- **Status Management** - Ubah status permohonan (Menunggu, Diproses, Disetujui, Ditolak)
- **File Upload** - Upload dokumen pendukung
- **User Authentication** - Login system dengan role-based access

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner
- **PDF Generation**: jsPDF + jsPDF-AutoTable

## 📋 Prasyarat

Pastikan sistem Anda memiliki:

- **Node.js** versi 18.0.0 atau lebih baru
- **npm** atau **yarn** package manager
- **Git** untuk version control
- **Akun Supabase** (gratis di [supabase.com](https://supabase.com))

### Cek Versi yang Terinstall:

```bash
node --version    # Harus >= 18.0.0
npm --version     # Harus >= 8.0.0
git --version     # Versi terbaru
```

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Mrizallr/disperindag-kemetrologian.git
cd disperindag-kemetrologian
```

### 2. Install Dependencies

```bash
npm install
```

atau jika menggunakan yarn:

```bash
yarn install
```

### 3. Setup Environment Variables

Buat file `.env.local` di root directory:

```bash
cp .env.example .env.local
```

Edit file `.env.local` dan isi dengan kredensial Supabase Anda:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🗄️ Konfigurasi Database

### 1. Setup Supabase Project

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Klik "New Project"
3. Isi nama project dan password database
4. Tunggu hingga project selesai dibuat
5. Copy **Project URL** dan **API Key** ke file `.env.local`

### 2. Jalankan SQL Setup

Di Supabase SQL Editor, jalankan script berikut secara berurutan:

#### A. Setup Database Schema

```sql
-- Jalankan file: database-schema/pengajuan_tera.sql
-- Script ini membuat tabel untuk data pelaku usaha dan pengajuan tera
```

#### B. Setup Tera Ulang Tables

```sql
-- Jalankan file: tera-ulang-setup.sql
-- Script ini membuat tabel untuk data tera ulang UTTP
```

#### C. Setup Row Level Security (RLS)

```sql
-- Jalankan file: setup-rls.sql
-- Script ini mengatur keamanan akses data
```

### 3. Verifikasi Database

Pastikan tabel-tabel berikut sudah terbuat:

- `pelaku_usaha` - Data pelaku usaha dan UTTP
- `pengajuan_tera` - Data pengajuan tera baru
- `tera_ulang` - Data tera ulang UTTP
- `artikel` - Artikel dan berita (opsional)

## 🏃 Menjalankan Aplikasi

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:5173**

### Production Build

```bash
# Build untuk production
npm run build

# Preview build hasil
npm run preview
```

### Linting & Code Quality

```bash
# Check code quality
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📁 Struktur Project

```
src/
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── radio-group.tsx
│   │   └── ...
│   └── AdminLayout.tsx # Main layout component
├── pages/              # Page components
│   ├── AdminDashboard.tsx    # Dashboard utama
│   ├── DataPelakuUsaha.tsx   # Kelola data pelaku usaha
│   ├── DataPerpanjang.tsx    # Kelola data tera ulang
│   ├── FormTeraUlang.tsx     # Form input tera ulang
│   ├── FormPengajuanTera.tsx # Form pengajuan tera
│   ├── LandingPage.tsx       # Halaman landing
│   └── ...
├── lib/                # Utilities & configurations
│   ├── supabase.ts     # Supabase client setup
│   ├── utils.ts        # Helper functions
│   └── api.ts          # API functions
├── hooks/              # Custom React hooks
└── App.tsx             # Main app component
```

## 📊 Fitur Dashboard

### 1. Dashboard Analytics
- **Statistics Cards**: Total pelaku usaha, UTTP terdaftar, tera ulang bulanan
- **Charts**: Pie chart status tera, bar chart jenis lapak
- **Recent Activity**: Data terbaru yang didaftarkan

### 2. Data Pelaku Usaha
- **CRUD Operations**: Create, Read, Update, Delete
- **Advanced Search**: Pencarian berdasarkan nama, alamat, kecamatan
- **Filtering**: Filter berdasarkan status, jenis lapak
- **Export**: Download data ke Excel/PDF

### 3. Data Tera Ulang
- **Form Input**: Input data tera ulang dengan validasi
- **Status Management**: Ubah status (Menunggu → Diproses → Disetujui/Ditolak)
- **File Upload**: Upload dokumen pendukung
- **Edit Functionality**: Edit data yang sudah ada

## 🔌 API Endpoints

### Supabase Tables

| Table | Description | Key Fields |
|-------|-------------|------------|
| `pelaku_usaha` | Data pelaku usaha | `nama_pemilik`, `alamat`, `kecamatan`, `status` |
| `tera_ulang` | Data tera ulang | `nama_pemilik`, `status_pemohon`, `butuh_skhp` |
| `pengajuan_tera` | Pengajuan tera baru | `nama_perusahaan`, `jenis_uttp`, `status` |

### Authentication

```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

// Logout
const { error } = await supabase.auth.signOut()
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Push ke GitHub** (sudah dilakukan)

2. **Connect ke Vercel**:
   - Buka [vercel.com](https://vercel.com)
   - Import repository GitHub
   - Pilih project `disperindag-kemetrologian`

3. **Set Environment Variables**:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Deploy**: Klik "Deploy"

### Netlify

1. **Build Project**:
   ```bash
   npm run build
   ```

2. **Upload ke Netlify**:
   - Drag & drop folder `dist` ke Netlify
   - Atau connect GitHub repository

3. **Set Environment Variables** di Netlify dashboard

### Manual Server

1. **Build Project**:
   ```bash
   npm run build
   ```

2. **Serve Static Files**:
   ```bash
   # Menggunakan serve
   npx serve -s dist -l 3000
   
   # Atau menggunakan http-server
   npx http-server dist -p 3000
   ```

## 🔧 Troubleshooting

### Common Issues

#### 1. **Supabase Connection Error**
```
Error: Invalid API key or URL
```
**Solusi**:
- Periksa file `.env.local`
- Pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` benar
- Restart development server

#### 2. **Database Table Not Found**
```
Error: relation "pelaku_usaha" does not exist
```
**Solusi**:
- Jalankan SQL setup scripts di Supabase
- Periksa nama tabel di database
- Pastikan RLS policies sudah diatur

#### 3. **Build Errors**
```
Error: Module not found
```
**Solusi**:
- Hapus `node_modules` dan install ulang:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

#### 4. **File Upload Issues**
```
Error: Storage bucket not found
```
**Solusi**:
- Buat bucket "uploads" di Supabase Storage
- Set bucket policy untuk public access

### Performance Tips

1. **Optimize Images**: Gunakan format WebP untuk gambar
2. **Lazy Loading**: Implement lazy loading untuk komponen besar
3. **Code Splitting**: Gunakan dynamic imports untuk route splitting
4. **Database Indexing**: Tambahkan index pada kolom yang sering di-query

### Development Tips

1. **Hot Reload**: Gunakan `npm run dev` untuk development
2. **Type Safety**: Manfaatkan TypeScript untuk type checking
3. **Component Reusability**: Gunakan shadcn/ui components
4. **State Management**: Gunakan React hooks untuk state lokal

## 📞 Support & Contact

Jika mengalami masalah atau butuh bantuan:

1. **Create Issue**: Buat issue di GitHub repository
2. **Check Documentation**: Baca dokumentasi Supabase dan React
3. **Community**: Join Discord/Telegram untuk diskusi

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Contributors

- **Developer**: [Mrizallr](https://github.com/Mrizallr)
- **Organization**: Dinas Perindustrian dan Perdagangan

---

⭐ **Star this repository if you find it helpful!**

**Happy Coding!** 🚀