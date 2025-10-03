-- Setup tabel tera_ulang
CREATE TABLE IF NOT EXISTS tera_ulang (
  id BIGSERIAL PRIMARY KEY,
  status_pemohon TEXT NOT NULL,
  nama_pemilik TEXT NOT NULL,
  nomor_hp TEXT,
  alamat TEXT,
  kecamatan TEXT NOT NULL,
  tanggal_pengajuan DATE NOT NULL,
  timbangan_elektronik INTEGER DEFAULT 0,
  timbangan_sentisimal INTEGER DEFAULT 0,
  timbangan_bobot INTEGER DEFAULT 0,
  timbangan_dacin INTEGER DEFAULT 0,
  timbangan_pegas INTEGER DEFAULT 0,
  timbangan_meja INTEGER DEFAULT 0,
  timbangan_cepat INTEGER DEFAULT 0,
  neraca INTEGER DEFAULT 0,
  anak_timbangan INTEGER DEFAULT 0,
  butuh_skhp TEXT,
  jenis_timbangan TEXT,
  merk TEXT,
  model TEXT,
  no_seri TEXT,
  kapasitas TEXT,
  daya_baca TEXT,
  kelas_timbangan TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tera_ulang ENABLE ROW LEVEL SECURITY;

-- Policy untuk public insert
CREATE POLICY "Allow public insert" ON tera_ulang
  FOR INSERT 
  WITH CHECK (true);

-- Policy untuk admin read/update
CREATE POLICY "Allow admin read" ON tera_ulang
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow admin update" ON tera_ulang
  FOR UPDATE 
  USING (true);