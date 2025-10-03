import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';

const kecamatanList = [
  'Garut Kota', 'Tarogong Kaler', 'Tarogong Kidul', 'Samarang', 'Leles', 'Kadungora',
  'Limbangan', 'Kersamanah', 'Malangbong', 'Selaawi', 'Cibiuk', 'Leuwigoong',
  'Banyuresmi', 'Cibatu', 'Pakenjeng', 'Karangtengah', 'Sukawening', 'Wanaraja',
  'Sucinaraja', 'Karangpawitan', 'Talegong', 'Cisewu', 'Caringin', 'Mekarmukti',
  'Bungbulang', 'Pamulihan', 'Cilawu', 'Cikelet', 'Pameungpeuk', 'Cibalong',
  'Cisompet', 'Cisurupan', 'Garut Selatan', 'Bayongbong', 'Singajaya'
];

interface FormData {
  status_pemohon: string;
  nama_pemilik: string;
  nomor_hp: string;
  alamat: string;
  kecamatan: string;
  tanggal_pengajuan: string;
  timbangan_elektronik: number;
  timbangan_sentisimal: number;
  timbangan_bobot: number;
  timbangan_dacin: number;
  timbangan_pegas: number;
  timbangan_meja: number;
  timbangan_cepat: number;
  neraca: number;
  anak_timbangan: number;
  butuh_skhp: string;
  jenis_timbangan: string;
  merk: string;
  model: string;
  no_seri: string;
  kapasitas: string;
  daya_baca: string;
  kelas_timbangan: string;
}

export default function FormTeraUlang() {
  const location = useLocation();
  const navigate = useNavigate();
  const pelakuUsaha = location.state?.pelakuUsaha;
  const editData = location.state?.editData;

  const [formData, setFormData] = useState<FormData>({
    status_pemohon: editData?.status_pemohon || '',
    nama_pemilik: editData?.nama_pemilik || pelakuUsaha?.nama_pemilik || '',
    nomor_hp: editData?.nomor_hp || pelakuUsaha?.nomor_hp || '',
    alamat: editData?.alamat || pelakuUsaha?.alamat || '',
    kecamatan: editData?.kecamatan || pelakuUsaha?.kecamatan || '',
    tanggal_pengajuan: editData?.tanggal_pengajuan || new Date().toISOString().split('T')[0],
    timbangan_elektronik: editData?.timbangan_elektronik || 0,
    timbangan_sentisimal: editData?.timbangan_sentisimal || 0,
    timbangan_bobot: editData?.timbangan_bobot || 0,
    timbangan_dacin: editData?.timbangan_dacin || 0,
    timbangan_pegas: editData?.timbangan_pegas || 0,
    timbangan_meja: editData?.timbangan_meja || 0,
    timbangan_cepat: editData?.timbangan_cepat || 0,
    neraca: editData?.neraca || 0,
    anak_timbangan: editData?.anak_timbangan || 0,
    butuh_skhp: editData?.butuh_skhp || '',
    jenis_timbangan: editData?.jenis_timbangan || '',
    merk: editData?.merk || '',
    model: editData?.model || '',
    no_seri: editData?.no_seri || '',
    kapasitas: editData?.kapasitas || '',
    daya_baca: editData?.daya_baca || '',
    kelas_timbangan: editData?.kelas_timbangan || ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editData) {
        // Update existing data
        const { error } = await supabase
          .from('tera_ulang')
          .update(formData)
          .eq('id', parseInt(editData.id));

        if (error) throw error;
        toast.success('Data tera ulang berhasil diperbarui!');
      } else {
        // Insert new data
        const { error } = await supabase
          .from('tera_ulang')
          .insert([formData]);

        if (error) throw error;
        toast.success('Data tera ulang berhasil disimpan!');
      }

      navigate('/admin/perpanjang');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Terjadi kesalahan saat menyimpan data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/perpanjang')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Form Permohonan Tera Ulang UTTP Di Kantor</h1>
              <p className="text-gray-600">Input data tera ulang UTTP</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Pemohon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status Pemohon *</Label>
                <RadioGroup 
                  value={formData.status_pemohon} 
                  onValueChange={(value) => handleInputChange('status_pemohon', value)}
                  className="flex flex-col gap-3 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Pemilik UTTP" id="pemilik" className="rounded-full" />
                    <Label htmlFor="pemilik" className="cursor-pointer">Pemilik UTTP</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Kuasa Pemilik UTTP / Pihak Ketiga / Perantara" id="kuasa" className="rounded-full" />
                    <Label htmlFor="kuasa" className="cursor-pointer">Kuasa Pemilik UTTP / Pihak Ketiga / Perantara</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nama_pemilik">Nama Pemilik/Kuasa Pemilik UTTP *</Label>
                  <Input
                    id="nama_pemilik"
                    value={formData.nama_pemilik}
                    onChange={(e) => handleInputChange('nama_pemilik', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nomor_hp">Nomor HP</Label>
                  <Input
                    id="nomor_hp"
                    value={formData.nomor_hp}
                    onChange={(e) => handleInputChange('nomor_hp', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="alamat">Alamat</Label>
                <Textarea
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => handleInputChange('alamat', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="kecamatan">Kecamatan asal UTTP *</Label>
                  <Select value={formData.kecamatan} onValueChange={(value) => handleInputChange('kecamatan', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kecamatan" />
                    </SelectTrigger>
                    <SelectContent>
                      {kecamatanList.map((kec) => (
                        <SelectItem key={kec} value={kec}>{kec}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tanggal_pengajuan">Tanggal Pengajuan Permohonan *</Label>
                  <Input
                    id="tanggal_pengajuan"
                    type="date"
                    value={formData.tanggal_pengajuan}
                    onChange={(e) => handleInputChange('tanggal_pengajuan', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Jumlah Timbangan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'timbangan_elektronik', label: 'Timbangan Elektronik', placeholder: 'Masukkan Jumlah Timbangan Elektronik' },
                  { key: 'timbangan_sentisimal', label: 'Timbangan Sentisimal', placeholder: 'Masukkan Jumlah Timbangan Sentisimal' },
                  { key: 'timbangan_bobot', label: 'Timbangan Bobot Ingsut', placeholder: 'Masukkan Jumlah Timbangan Bobot Ingsut' },
                  { key: 'timbangan_dacin', label: 'Timbangan Dacin', placeholder: 'Masukkan Jumlah Timbangan Dacin' },
                  { key: 'timbangan_pegas', label: 'Timbangan Pegas', placeholder: 'Masukkan Jumlah Timbangan Pegas' },
                  { key: 'timbangan_meja', label: 'Timbangan Meja', placeholder: 'Masukkan Jumlah Timbangan Meja' },
                  { key: 'timbangan_cepat', label: 'Timbangan Cepat', placeholder: 'Masukkan Jumlah Timbangan Cepat' },
                  { key: 'neraca', label: 'Neraca', placeholder: 'Masukkan Jumlah Neraca' },
                  { key: 'anak_timbangan', label: 'Anak Timbangan', placeholder: 'Masukkan Jumlah Anak Timbangan' }
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="number"
                      min="0"
                      placeholder={placeholder}
                      value={formData[key as keyof FormData]}
                      onChange={(e) => handleInputChange(key as keyof FormData, parseInt(e.target.value) || 0)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informasi SKHP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Apakah Membutuhkan Surat Keterangan Hasil Pengujian (SKHP)?</Label>
                <RadioGroup 
                  value={formData.butuh_skhp} 
                  onValueChange={(value) => handleInputChange('butuh_skhp', value)}
                  className="flex gap-6 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Ya" id="skhp_ya" className="rounded-full" />
                    <Label htmlFor="skhp_ya" className="cursor-pointer">Ya</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Tidak" id="skhp_tidak" className="rounded-full" />
                    <Label htmlFor="skhp_tidak" className="cursor-pointer">Tidak</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.butuh_skhp === 'Ya' && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-4">
                    <p className="font-semibold mb-2">Petunjuk Pengisian:</p>
                    <p>1. Jika UTTP lebih dari satu, data masing-masing timbangan diisi berurutan menggunakan tanda garis miring ( / )</p>
                    <p className="ml-4 text-gray-500">Contoh Data Merk: Metler/Krisbow/Tora</p>
                    <p>2. Jika data tidak tersedia berikan tanda strip ( - )</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jenis_timbangan">Jenis Timbangan *</Label>
                      <Select value={formData.jenis_timbangan} onValueChange={(value) => handleInputChange('jenis_timbangan', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Jenis Timbangan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Timbangan Elektronik">Timbangan Elektronik</SelectItem>
                          <SelectItem value="Neraca">Neraca</SelectItem>
                          <SelectItem value="Anak Timbangan">Anak Timbangan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="merk">Merk *</Label>
                      <Input
                        id="merk"
                        value={formData.merk}
                        onChange={(e) => handleInputChange('merk', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="model">Model / Tipe</Label>
                      <Input
                        id="model"
                        value={formData.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="no_seri">No Seri</Label>
                      <Input
                        id="no_seri"
                        value={formData.no_seri}
                        onChange={(e) => handleInputChange('no_seri', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="kapasitas">Kapasitas (kg)</Label>
                      <Input
                        id="kapasitas"
                        value={formData.kapasitas}
                        onChange={(e) => handleInputChange('kapasitas', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="daya_baca">Daya Baca (gram)</Label>
                      <Input
                        id="daya_baca"
                        value={formData.daya_baca}
                        onChange={(e) => handleInputChange('daya_baca', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="kelas_timbangan">Kelas Timbangan (jika tersedia)</Label>
                      <Select value={formData.kelas_timbangan} onValueChange={(value) => handleInputChange('kelas_timbangan', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kelas Timbangan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="II">II</SelectItem>
                          <SelectItem value="III">III</SelectItem>
                          <SelectItem value="IIII">IIII</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/perpanjang')}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Menyimpan...' : 'Simpan Tera Ulang'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}