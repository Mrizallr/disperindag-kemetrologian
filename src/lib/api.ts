import { supabase } from './supabase';

export interface PengajuanTeraData {
  nama_perusahaan: string;
  alamat_perusahaan?: string;
  alamat_uttp: string;
  kecamatan?: string;
  no_contact?: string;
  jenis_uttp: string;
  nomor_spbu?: string;
  jumlah_pompa?: number;
  jumlah_nozzle?: number;
  nomor_surat?: string;
  tanggal_surat?: string;
  file_surat_url?: string;
}

export const submitPengajuanTera = async (data: PengajuanTeraData) => {
  try {
    // Gunakan service role untuk bypass RLS
    const { data: result, error } = await supabase
      .from('pengajuan_tera')
      .insert({
        ...data,
        status: 'Pending',
        created_at: new Date().toISOString()
      })
      .select();

    if (error) {
      throw error;
    }

    return { success: true, data: result };
  } catch (error: any) {
    console.error('API Error:', error);
    return { 
      success: false, 
      error: error.message || 'Gagal mengirim pengajuan' 
    };
  }
};

export const uploadFile = async (file: File, folder: string = 'pengajuan') => {
  try {
    const fileName = `${folder}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw error;
    }

    return { success: true, path: data.path };
  } catch (error: any) {
    console.error('Upload Error:', error);
    return { 
      success: false, 
      error: error.message || 'Gagal upload file' 
    };
  }
};