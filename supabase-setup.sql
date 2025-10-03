-- Setup tabel pengajuan_tera
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

-- Policy untuk public insert (tanpa autentikasi)
CREATE POLICY "Allow public insert" ON pengajuan_tera
  FOR INSERT 
  WITH CHECK (true);

-- Policy untuk admin read/update
CREATE POLICY "Allow admin access" ON pengajuan_tera
  FOR ALL 
  USING (auth.role() = 'authenticated');

-- Setup storage bucket untuk uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Policy untuk storage uploads
CREATE POLICY "Allow public upload" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Allow public read" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'uploads');