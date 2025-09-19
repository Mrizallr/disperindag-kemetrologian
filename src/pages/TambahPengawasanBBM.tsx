import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, ArrowLeft, Scale3DIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const TambahPengawasanBBM: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Identitas
    pemilik: "",
    nomorSpbu: "",
    alamat: "",
    
    // A. Data Teknis
    merek: "",
    tipeNoSeri: "",
    qmax: "",
    media1: "",
    media2: "",
    lambangSatuan: "",
    gelassPenglihat: "",
    nozle: "",
    penunjukanHarga: "",
    penunjukanLiter: "",
    totalisator: "",
    alatTambahan: "",
    
    // B. Pemeriksaan
    tandaTeraBerlaku: "",
    tandaTeraKondisi: "",
    keteranganHasilPengujian: "",
    sertifikasiPastiPas: "",
    pengecekanSpbu: "",
    diTeraUlangTerakhir: "",
    tandaTeraSegelan: "",
    
    // C. Tindakan
    penutupanSementara: "",
    alasanPenutupan: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!');
    console.log('Form data:', formData);
    
    setIsLoading(true);

    try {
      console.log('Attempting to save to database...');
      
      // Versi sederhana untuk test
      const insertData = {
        pemilik: formData.pemilik || 'Test Pemilik',
        nomor_spbu: formData.nomorSpbu || 'Test SPBU',
        alamat: formData.alamat || 'Test Alamat',
        merek: formData.merek || 'Default Merek',
        status: "Sesuai",
        tanggal_pengawasan: new Date().toISOString().split('T')[0],
        petugas: "Admin"
      };
      
      console.log('Insert data:', insertData);
      
      const { data, error } = await supabase
        .from("pengawasan_bbm")
        .insert([insertData])
        .select();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Data saved successfully!');
      toast.success("Data pengawasan BBM berhasil disimpan!");
      navigate("/admin/data-pengawasan-bbm");
    } catch (err: any) {
      console.error('Catch error:', err);
      toast.error("Gagal menyimpan data: " + err.message);
    } finally {
      setIsLoading(false);
      console.log('Loading finished');
    }
  };

  return (
    <AdminLayout>
      <div className="w-full px-6 md:px-10 lg:px-20 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/data-pengawasan-bbm")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
          <div>
            <Scale3DIcon className="w-8 h-8 text-purple-600 inline mr-3" />
            <h1 className="text-3xl font-bold inline">Cerapan Pengawasan Pompa Ukur BBM</h1>
            <p className="text-gray-600 mt-2">
              Formulir pengawasan pompa ukur BBM di SPBU
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identitas */}
          <Card>
            <CardHeader>
              <CardTitle>Identitas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pemilik">1. Pemilik</Label>
                  <Input
                    id="pemilik"
                    value={formData.pemilik}
                    onChange={(e) => handleInputChange("pemilik", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nomorSpbu">2. No. SPBU</Label>
                  <Input
                    id="nomorSpbu"
                    value={formData.nomorSpbu}
                    onChange={(e) => handleInputChange("nomorSpbu", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="alamat">3. Alamat</Label>
                <Textarea
                  id="alamat"
                  value={formData.alamat}
                  onChange={(e) => handleInputChange("alamat", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* A. Data Teknis Pompa Ukur BBM */}
          <Card>
            <CardHeader>
              <CardTitle>A. DATA TEKNIS POMPA UKUR BBM</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="merek">1. Merek</Label>
                  <Input
                    id="merek"
                    value={formData.merek}
                    onChange={(e) => handleInputChange("merek", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="tipeNoSeri">2. Tipe / No. Seri</Label>
                  <Input
                    id="tipeNoSeri"
                    value={formData.tipeNoSeri}
                    onChange={(e) => handleInputChange("tipeNoSeri", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="qmax">3. Qmax</Label>
                  <Input
                    id="qmax"
                    value={formData.qmax}
                    onChange={(e) => handleInputChange("qmax", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="media1">4. Media 1</Label>
                  <Input
                    id="media1"
                    value={formData.media1}
                    onChange={(e) => handleInputChange("media1", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="media2">Media 2</Label>
                  <Input
                    id="media2"
                    value={formData.media2}
                    onChange={(e) => handleInputChange("media2", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label>5. Lambang Satuan</Label>
                  <RadioGroup
                    value={formData.lambangSatuan}
                    onValueChange={(value) => handleInputChange("lambangSatuan", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SI" id="si" />
                      <Label htmlFor="si">SI</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Non SI" id="nonsi" />
                      <Label htmlFor="nonsi">Non SI</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>6. Gelas Penglihat</Label>
                  <RadioGroup
                    value={formData.gelassPenglihat}
                    onValueChange={(value) => handleInputChange("gelassPenglihat", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Penuh" id="penuh" />
                      <Label htmlFor="penuh">Penuh</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Kosong" id="kosong" />
                      <Label htmlFor="kosong">Kosong</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>7. Nozle</Label>
                  <RadioGroup
                    value={formData.nozle}
                    onValueChange={(value) => handleInputChange("nozle", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Baik" id="nozleBaik" />
                      <Label htmlFor="nozleBaik">Baik</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rusak" id="nozleRusak" />
                      <Label htmlFor="nozleRusak">Rusak</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>8. Penunjukan Harga</Label>
                  <RadioGroup
                    value={formData.penunjukanHarga}
                    onValueChange={(value) => handleInputChange("penunjukanHarga", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Betul" id="hargaBetul" />
                      <Label htmlFor="hargaBetul">Betul</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Salah" id="hargaSalah" />
                      <Label htmlFor="hargaSalah">Salah</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>9. Penunjukan Liter</Label>
                  <RadioGroup
                    value={formData.penunjukanLiter}
                    onValueChange={(value) => handleInputChange("penunjukanLiter", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Betul" id="literBetul" />
                      <Label htmlFor="literBetul">Betul</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Salah" id="literSalah" />
                      <Label htmlFor="literSalah">Salah</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>10. Totalisator</Label>
                  <RadioGroup
                    value={formData.totalisator}
                    onValueChange={(value) => handleInputChange("totalisator", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Baik" id="totalisatorBaik" />
                      <Label htmlFor="totalisatorBaik">Baik</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rusak" id="totalisatorRusak" />
                      <Label htmlFor="totalisatorRusak">Rusak</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>11. Alat Tambahan</Label>
                  <RadioGroup
                    value={formData.alatTambahan}
                    onValueChange={(value) => handleInputChange("alatTambahan", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ada" id="alatAda" />
                      <Label htmlFor="alatAda">Ada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Tidak ada" id="alatTidakAda" />
                      <Label htmlFor="alatTidakAda">Tidak ada</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* B. Pemeriksaan */}
          <Card>
            <CardHeader>
              <CardTitle>B. PEMERIKSAAN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold">1. Tanda Tera</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
                  <div>
                    <Label className="text-sm">Status Berlaku</Label>
                    <RadioGroup
                      value={formData.tandaTeraBerlaku}
                      onValueChange={(value) => handleInputChange("tandaTeraBerlaku", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Berlaku" id="teraBerlaku" />
                        <Label htmlFor="teraBerlaku">Berlaku</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Tidak Berlaku" id="teraTidakBerlaku" />
                        <Label htmlFor="teraTidakBerlaku">Tidak Berlaku</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label className="text-sm">Kondisi</Label>
                    <RadioGroup
                      value={formData.tandaTeraKondisi}
                      onValueChange={(value) => handleInputChange("tandaTeraKondisi", value)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Baik" id="teraBaik" />
                        <Label htmlFor="teraBaik">Baik</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Rusak" id="teraRusak" />
                        <Label htmlFor="teraRusak">Rusak</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>2. Ket. Hasil Pengujian</Label>
                  <RadioGroup
                    value={formData.keteranganHasilPengujian}
                    onValueChange={(value) => handleInputChange("keteranganHasilPengujian", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ada" id="keteranganAda" />
                      <Label htmlFor="keteranganAda">Ada</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Tidak ada" id="keteranganTidakAda" />
                      <Label htmlFor="keteranganTidakAda">Tidak ada</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>3. Sertifikasi Pasti Pas</Label>
                  <RadioGroup
                    value={formData.sertifikasiPastiPas}
                    onValueChange={(value) => handleInputChange("sertifikasiPastiPas", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sudah" id="sertifikasiSudah" />
                      <Label htmlFor="sertifikasiSudah">Sudah</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Belum" id="sertifikasiBelum" />
                      <Label htmlFor="sertifikasiBelum">Belum</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>4. Pengecekan oleh SPBU</Label>
                  <RadioGroup
                    value={formData.pengecekanSpbu}
                    onValueChange={(value) => handleInputChange("pengecekanSpbu", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Dilakukan" id="pengecekanDilakukan" />
                      <Label htmlFor="pengecekanDilakukan">Dilakukan</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Tidak Dilakukan" id="pengecekanTidakDilakukan" />
                      <Label htmlFor="pengecekanTidakDilakukan">Tidak Dilakukan</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="diTeraUlangTerakhir">5. Ditera/tera ulang terakhir</Label>
                  <Input
                    id="diTeraUlangTerakhir"
                    type="date"
                    value={formData.diTeraUlangTerakhir}
                    onChange={(e) => handleInputChange("diTeraUlangTerakhir", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tandaTeraSegelan">7. Tanda Tera dan sistem penyegelan</Label>
                <Textarea
                  id="tandaTeraSegelan"
                  value={formData.tandaTeraSegelan}
                  onChange={(e) => handleInputChange("tandaTeraSegelan", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* C. Tindakan Hasil Pengawasan */}
          <Card>
            <CardHeader>
              <CardTitle>C. TINDAKAN HASIL PENGAWASAN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>1. Penutupan sementara</Label>
                <RadioGroup
                  value={formData.penutupanSementara}
                  onValueChange={(value) => handleInputChange("penutupanSementara", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Dilakukan" id="penutupanDilakukan" />
                    <Label htmlFor="penutupanDilakukan">Dilakukan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Tidak dilakukan" id="penutupanTidakDilakukan" />
                    <Label htmlFor="penutupanTidakDilakukan">Tidak dilakukan</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="alasanPenutupan">2. Alasan penutupan</Label>
                <Textarea
                  id="alasanPenutupan"
                  value={formData.alasanPenutupan}
                  onChange={(e) => handleInputChange("alasanPenutupan", e.target.value)}
                  placeholder="Berdasarkan hasil pemeriksaan dan pengujian sebagaimana terlampir..."
                />
              </div>
            </CardContent>
          </Card>



          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/admin/data-pengawasan-bbm")}>
              Batal
            </Button>
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Simpan Data
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default TambahPengawasanBBM;