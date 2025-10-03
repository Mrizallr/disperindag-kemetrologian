# Database Setup untuk Pengajuan Tera

## Masalah RLS (Row Level Security)

Error "new row violates row-level security policy" terjadi karena Supabase RLS memblokir insert tanpa autentikasi.

## Solusi 1: Setup RLS Policy (Recommended)

1. Buka Supabase Dashboard → SQL Editor
2. Jalankan script dari file `supabase-setup.sql`
3. Atau jalankan query berikut:

```sql
-- Buat tabel pengajuan_tera
CREATE TABLE IF NOT EXISTS pengajuan_tera (
  id BIGSERIAL PRIMARY KEY,
  nama_perusahaan TEXT NOT NULL,
  alamat_perusahaan TEXT,
  alamat_uttp TEXT NOT NULL,
  kecamatan TEXT,
  no_contact TEXT,
  jenis_uttp TEXT NOT NULL,
  nomor_spbu TEXT,
  jumlah_pompa INTEGER DEFAULT 0,
  jumlah_nozzle INTEGER DEFAULT 0,
  nomor_surat TEXT,
  tanggal_surat DATE,
  file_surat_url TEXT,
  status TEXT DEFAULT 'Pending',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pengajuan_tera ENABLE ROW LEVEL SECURITY;

-- Policy untuk public insert
CREATE POLICY "Allow public insert" ON pengajuan_tera
  FOR INSERT 
  WITH CHECK (true);

-- Setup storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'uploads');
```

## Solusi 2: Disable RLS (Tidak Recommended)

Jika masih error, disable RLS sementara:

```sql
ALTER TABLE pengajuan_tera DISABLE ROW LEVEL SECURITY;
```

## Verifikasi Setup

1. Cek tabel sudah ada:
```sql
SELECT * FROM pengajuan_tera LIMIT 1;
```

2. Cek storage bucket:
```sql
SELECT * FROM storage.buckets WHERE id = 'uploads';
```

3. Test insert manual:
```sql
INSERT INTO pengajuan_tera (nama_perusahaan, alamat_uttp, jenis_uttp)
VALUES ('Test Company', 'Test Address', 'Pompa Ukur BBM');
```

## Troubleshooting

- Pastikan environment variables sudah benar di `.env.local`
- Pastikan Supabase project sudah aktif
- Cek di Supabase Dashboard → Authentication → Settings → RLS policies
- Cek di Storage → Settings → Policies

## File yang Diupdate

- `src/lib/api.ts` - API helper untuk submission
- `src/pages/FormPengajuanTera.tsx` - Form dengan error handling
- `supabase-setup.sql` - Script setup database