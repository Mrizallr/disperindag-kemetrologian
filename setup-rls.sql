-- Jalankan di Supabase Dashboard > SQL Editor

-- 1. Buat tabel pengajuan_tera
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS dan buat policy untuk public insert
ALTER TABLE pengajuan_tera ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON pengajuan_tera
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow admin read" ON pengajuan_tera
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow admin update" ON pengajuan_tera
  FOR UPDATE 
  USING (true);

-- 3. Setup storage bucket uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Storage policies
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'uploads');

CREATE POLICY "Allow public download" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'uploads' AND auth.role() IS NOT NULL);