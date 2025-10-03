-- Tabel untuk menyimpan data pengajuan tera ulang
CREATE TABLE pengajuan_tera (
  id SERIAL PRIMARY KEY,
  nama_perusahaan VARCHAR(255) NOT NULL,
  alamat_perusahaan TEXT,
  alamat_uttp TEXT NOT NULL,
  kecamatan VARCHAR(100),
  no_contact VARCHAR(20),
  jenis_uttp VARCHAR(100) NOT NULL,
  nomor_spbu VARCHAR(50),
  jumlah_pompa INTEGER DEFAULT 0,
  jumlah_nozzle INTEGER DEFAULT 0,
  nomor_surat VARCHAR(100),
  tanggal_surat DATE,
  file_surat_url TEXT,
  status VARCHAR(20) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Buat storage bucket untuk file upload (jalankan di Supabase Dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);

-- Policy untuk storage bucket
-- CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
-- CREATE POLICY "Allow public downloads" ON storage.objects FOR SELECT USING (bucket_id = 'documents');