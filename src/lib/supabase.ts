import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface PelakuUsaha {
  id: number
  nama_pemilik: string
  jenis_lapak: 'Kios' | 'Los' | 'PKL'
  lokasi: string
  jenis_dagangan: string
  catatan?: string
  tanggal_tera_terakhir: string
  tanggal_exp_tera: string
  status_tera: 'Aktif' | 'Perlu Tera Ulang' | 'Tidak Aktif'
  created_at: string
  updated_at: string
}

export interface Artikel {
  id: number
  judul: string
  konten: string
  excerpt: string
  gambar_url?: string
  status: 'draft' | 'published'
  author: string
  created_at: string
  updated_at: string
}

export interface Notifikasi {
  pelaku_usaha: any
  id: number
  jenis: 'permohonan_baru' | 'tera_exp_warning' | 'tera_expired'
  judul: string
  pesan: string
  pelaku_usaha_id?: number
  dibaca: boolean
  created_at: string
}

export interface PermohonanTera {
  id: number
  nama_pemohon: string
  email: string
  telepon: string
  jenis_permohonan: 'tera_baru' | 'tera_ulang'
  deskripsi: string
  status: 'pending' | 'diproses' | 'selesai' | 'ditolak'
  created_at: string
}