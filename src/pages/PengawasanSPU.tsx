import React, { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Save, Eye, Scale3DIcon } from "lucide-react";
import { toast } from "sonner";

const PengawasanSPU: React.FC = () => {
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
    
    // D. Pengujian - Totalisator Table
    totalisatorAwalPenunjukan: "",
    totalisatorAwalNozle1: "",
    totalisatorAwalNozle2: "",
    totalisatorAkhirPenunjukan: "",
    totalisatorAkhirNozle1: "",
    totalisatorAkhirNozle2: "",
    
    // Bejana Ukur Standar
    bejanaUkurMerek: "",
    bejanaUkurNoSeri: "",
    bejanaUkurKoreksi: "",
    bejanaUkurNoSert: "",
    
    // Hasil Pengujian Table (3 rows)
    hasilPenunjukan1: "20000",
    hasilPenghitung1: "",
    hasilTakaran1: "",
    hasilNozle1MS1_1: "",
    hasilNozle2MS2_1: "",
    hasilKesalahanNozle1_1: "",
    hasilKesalahanNozle2_1: "",
    hasilKetidaktetapanNozle1_1: "",
    hasilKetidaktetapanNozle2_1: "",
    
    hasilPenunjukan2: "20000",
    hasilPenghitung2: "",
    hasilTakaran2: "",
    hasilNozle1MS1_2: "",
    hasilNozle2MS2_2: "",
    hasilKesalahanNozle1_2: "",
    hasilKesalahanNozle2_2: "",
    hasilKetidaktetapanNozle1_2: "",
    hasilKetidaktetapanNozle2_2: "",
    
    hasilPenunjukan3: "20000",
    hasilPenghitung3: "",
    hasilTakaran3: "",
    hasilNozle1MS1_3: "",
    hasilNozle2MS2_3: "",
    hasilKesalahanNozle1_3: "",
    hasilKesalahanNozle2_3: "",
    hasilKetidaktetapanNozle1_3: "",
    hasilKetidaktetapanNozle2_3: "",
    
    // Jumlah cairan uji
    cairanPenunjukan: "",
    cairanNozle1: "",
    cairanNozle2: "",
    cairanTotalisator: "",
    cairanPenakaran: "",
    
    // E. Kesimpulan
    kesimpulan: "",
    
    // Tanda Tangan
    tanggalTempat: "",
    tanggal: "",
    pemilikPengelola: "",
    petugas: "",
    saksi1: "",
    saksi2: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Data pengawasan SPU berhasil disimpan!");
    console.log("Form data:", formData);
  };

  return (
    <AdminLayout>
      <div className="w-full px-6 md:px-10 lg:px-20 py-6 space-y-6">
        <div className="flex items-center gap-3">
          <Scale3DIcon className="w-8 h-8 text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Pengawasan SPU
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Cerapan Pengawasan Pompa Ukur BBM
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
                  <Label htmlFor="pemilik">Pemilik</Label>
                  <Input
                    id="pemilik"
                    value={formData.pemilik}
                    onChange={(e) => handleInputChange("pemilik", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nomorSpbu">Nomor SPBU</Label>
                  <Input
                    id="nomorSpbu"
                    value={formData.nomorSpbu}
                    onChange={(e) => handleInputChange("nomorSpbu", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="alamat">Alamat</Label>
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
              <CardTitle>A. Data Teknis Pompa Ukur BBM</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="merek">Merek</Label>
                  <Input
                    id="merek"
                    value={formData.merek}
                    onChange={(e) => handleInputChange("merek", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="tipeNoSeri">Tipe / No. Seri</Label>
                  <Input
                    id="tipeNoSeri"
                    value={formData.tipeNoSeri}
                    onChange={(e) => handleInputChange("tipeNoSeri", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="qmax">Qmax</Label>
                  <Input
                    id="qmax"
                    value={formData.qmax}
                    onChange={(e) => handleInputChange("qmax", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="media1">Media 1</Label>
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
                  <Label>Lambang Satuan</Label>
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
                  <Label>Gelas Penglihat</Label>
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
                  <Label>Nozle</Label>
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
                  <Label>Penunjukan Harga</Label>
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
                  <Label>Penunjukan Liter</Label>
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
                  <Label>Totalisator</Label>
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
                  <Label>Alat Tambahan</Label>
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
                <Label className="text-base font-semibold">Tanda Tera</Label>
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
                  <Label>Keterangan Hasil Pengujian</Label>
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
                  <Label>Sertifikasi Pasti Pas</Label>
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
                  <Label>Pengecekan oleh SPBU</Label>
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
                  <Label htmlFor="diTeraUlangTerakhir">Ditera/tera ulang terakhir</Label>
                  <Input
                    id="diTeraUlangTerakhir"
                    type="date"
                    value={formData.diTeraUlangTerakhir}
                    onChange={(e) => handleInputChange("diTeraUlangTerakhir", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="tandaTeraSegelan">Tanda Tera & Sistem Penyegelan</Label>
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
              <CardTitle>C. Tindakan Hasil Pengawasan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Penutupan Sementara</Label>
                <RadioGroup
                  value={formData.penutupanSementara}
                  onValueChange={(value) => handleInputChange("penutupanSementara", value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Dilakukan" id="penutupanDilakukan" />
                    <Label htmlFor="penutupanDilakukan">Dilakukan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Tidak Dilakukan" id="penutupanTidakDilakukan" />
                    <Label htmlFor="penutupanTidakDilakukan">Tidak Dilakukan</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="alasanPenutupan">Alasan Penutupan</Label>
                <Textarea
                  id="alasanPenutupan"
                  value={formData.alasanPenutupan}
                  onChange={(e) => handleInputChange("alasanPenutupan", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* D. Pengujian */}
          <Card>
            <CardHeader>
              <CardTitle>D. PENGUJIAN</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tabel 1 - Totalisator */}
              <div>
                <h4 className="font-semibold mb-4">Tabel 1 - Totalisator</h4>
                <div className="flex gap-6">
                  {/* Tabel Totalisator */}
                  <div className="flex-1">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="border border-gray-300 p-2">Penunjukan</th>
                            <th className="border border-gray-300 p-2">Nozle 1 (L)</th>
                            <th className="border border-gray-300 p-2">Nozle 2 (L)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 p-2 font-medium">Awal</td>
                            <td className="border border-gray-300 p-2">
                              <Input
                                type="number"
                                value={formData.totalisatorAwalNozle1}
                                onChange={(e) => handleInputChange("totalisatorAwalNozle1", e.target.value)}
                              />
                            </td>
                            <td className="border border-gray-300 p-2">
                              <Input
                                type="number"
                                value={formData.totalisatorAwalNozle2}
                                onChange={(e) => handleInputChange("totalisatorAwalNozle2", e.target.value)}
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 p-2 font-medium">Akhir</td>
                            <td className="border border-gray-300 p-2">
                              <Input
                                type="number"
                                value={formData.totalisatorAkhirNozle1}
                                onChange={(e) => handleInputChange("totalisatorAkhirNozle1", e.target.value)}
                              />
                            </td>
                            <td className="border border-gray-300 p-2">
                              <Input
                                type="number"
                                value={formData.totalisatorAkhirNozle2}
                                onChange={(e) => handleInputChange("totalisatorAkhirNozle2", e.target.value)}
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  {/* Bejana Ukur Standar */}
                  <div className="w-80">
                    <h5 className="font-medium mb-3">Bejana Ukur Standar</h5>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="bejanaUkurMerek">Merek</Label>
                        <Input
                          id="bejanaUkurMerek"
                          value={formData.bejanaUkurMerek}
                          onChange={(e) => handleInputChange("bejanaUkurMerek", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bejanaUkurNoSeri">No. Seri</Label>
                        <Input
                          id="bejanaUkurNoSeri"
                          value={formData.bejanaUkurNoSeri}
                          onChange={(e) => handleInputChange("bejanaUkurNoSeri", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bejanaUkurKoreksi">Koreksi</Label>
                        <Input
                          id="bejanaUkurKoreksi"
                          value={formData.bejanaUkurKoreksi}
                          onChange={(e) => handleInputChange("bejanaUkurKoreksi", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="bejanaUkurNoSert">No. Sert.</Label>
                        <Input
                          id="bejanaUkurNoSert"
                          value={formData.bejanaUkurNoSert}
                          onChange={(e) => handleInputChange("bejanaUkurNoSert", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel 2 - Hasil Pengujian */}
              <div>
                <h4 className="font-semibold mb-2">Tabel 2 - Hasil Pengujian</h4>
                <p className="text-sm text-gray-600 mb-4">(Kecepatan alir diambil satu kali, disesuaikan dengan cepat alir operasional)</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th rowSpan={2} className="border border-gray-300 p-2">Penunjukan (mL)</th>
                        <th colSpan={2} className="border border-gray-300 p-2">Penghitung (M)</th>
                        <th colSpan={2} className="border border-gray-300 p-2">Takaran (S)</th>
                        <th colSpan={2} className="border border-gray-300 p-2">Kesalahan Penunjukan<br/>(M-S/S×100%)</th>
                        <th colSpan={2} className="border border-gray-300 p-2">Ketidaktetapan (%)</th>
                      </tr>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2">Nozle 1</th>
                        <th className="border border-gray-300 p-2">Nozle 2</th>
                        <th className="border border-gray-300 p-2">Nozle 1 (M-S1)</th>
                        <th className="border border-gray-300 p-2">Nozle 2 (M-S2)</th>
                        <th className="border border-gray-300 p-2">Nozle 1</th>
                        <th className="border border-gray-300 p-2">Nozle 2</th>
                        <th className="border border-gray-300 p-2">Nozle 1</th>
                        <th className="border border-gray-300 p-2">Nozle 2</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Row 1 */}
                      <tr>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilPenunjukan1}
                            onChange={(e) => handleInputChange("hasilPenunjukan1", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilPenghitung1}
                            onChange={(e) => handleInputChange("hasilPenghitung1", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilPenghitung1}
                            onChange={(e) => handleInputChange("hasilPenghitung1", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilNozle1MS1_1}
                            onChange={(e) => handleInputChange("hasilNozle1MS1_1", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilNozle2MS2_1}
                            onChange={(e) => handleInputChange("hasilNozle2MS2_1", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKesalahanNozle1_1}
                            onChange={(e) => handleInputChange("hasilKesalahanNozle1_1", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKesalahanNozle2_1}
                            onChange={(e) => handleInputChange("hasilKesalahanNozle2_1", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKetidaktetapanNozle1_1}
                            onChange={(e) => handleInputChange("hasilKetidaktetapanNozle1_1", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKetidaktetapanNozle2_1}
                            onChange={(e) => handleInputChange("hasilKetidaktetapanNozle2_1", e.target.value)}
                          />
                        </td>
                      </tr>
                      {/* Row 2 */}
                      <tr>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilPenunjukan2}
                            onChange={(e) => handleInputChange("hasilPenunjukan2", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilPenghitung2}
                            onChange={(e) => handleInputChange("hasilPenghitung2", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilPenghitung2}
                            onChange={(e) => handleInputChange("hasilPenghitung2", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilNozle1MS1_2}
                            onChange={(e) => handleInputChange("hasilNozle1MS1_2", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilNozle2MS2_2}
                            onChange={(e) => handleInputChange("hasilNozle2MS2_2", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKesalahanNozle1_2}
                            onChange={(e) => handleInputChange("hasilKesalahanNozle1_2", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKesalahanNozle2_2}
                            onChange={(e) => handleInputChange("hasilKesalahanNozle2_2", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKetidaktetapanNozle1_2}
                            onChange={(e) => handleInputChange("hasilKetidaktetapanNozle1_2", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKetidaktetapanNozle2_2}
                            onChange={(e) => handleInputChange("hasilKetidaktetapanNozle2_2", e.target.value)}
                          />
                        </td>
                      </tr>
                      {/* Row 3 */}
                      <tr>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilPenunjukan3}
                            onChange={(e) => handleInputChange("hasilPenunjukan3", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilPenghitung3}
                            onChange={(e) => handleInputChange("hasilPenghitung3", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilPenghitung3}
                            onChange={(e) => handleInputChange("hasilPenghitung3", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilNozle1MS1_3}
                            onChange={(e) => handleInputChange("hasilNozle1MS1_3", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilNozle2MS2_3}
                            onChange={(e) => handleInputChange("hasilNozle2MS2_3", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKesalahanNozle1_3}
                            onChange={(e) => handleInputChange("hasilKesalahanNozle1_3", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKesalahanNozle2_3}
                            onChange={(e) => handleInputChange("hasilKesalahanNozle2_3", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKetidaktetapanNozle1_3}
                            onChange={(e) => handleInputChange("hasilKetidaktetapanNozle1_3", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.hasilKetidaktetapanNozle2_3}
                            onChange={(e) => handleInputChange("hasilKetidaktetapanNozle2_3", e.target.value)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tabel 3 - Jumlah Cairan Uji */}
              <div>
                <h4 className="font-semibold mb-2">Tabel 3 - Jumlah Cairan Uji</h4>
                <p className="text-sm text-gray-600 mb-4">Jumlah cairan uji yang dikeluarkan berdasarkan :</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2">Penunjukan</th>
                        <th className="border border-gray-300 p-2">Nozle 1 (mL)</th>
                        <th className="border border-gray-300 p-2">Nozle 2 (mL)</th>
                        <th className="border border-gray-300 p-2">Totalisator</th>
                        <th className="border border-gray-300 p-2">Penakaran</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.cairanPenunjukan}
                            onChange={(e) => handleInputChange("cairanPenunjukan", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.cairanNozle1}
                            onChange={(e) => handleInputChange("cairanNozle1", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.cairanNozle2}
                            onChange={(e) => handleInputChange("cairanNozle2", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.cairanTotalisator}
                            onChange={(e) => handleInputChange("cairanTotalisator", e.target.value)}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <Input
                            value={formData.cairanPenakaran}
                            onChange={(e) => handleInputChange("cairanPenakaran", e.target.value)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* E. Kesimpulan */}
          <Card>
            <CardHeader>
              <CardTitle>E. KESIMPULAN</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Textarea
                  id="kesimpulan"
                  value={formData.kesimpulan}
                  onChange={(e) => handleInputChange("kesimpulan", e.target.value)}
                  rows={5}
                  placeholder="Tuliskan kesimpulan hasil pengawasan (minimal 3-5 baris)..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Catatan */}
          <Card>
            <CardHeader>
              <CardTitle>Catatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Toleransi Kesalahan Penunjukan :</strong> ± 0,5 %
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Toleransi Ketidaktetapan :</strong> ± 0,1 %
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tanda Tangan */}
          <Card>
            <CardHeader>
              <CardTitle>Bagian Tanda Tangan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tanggalTempat">Tempat</Label>
                  <Input
                    id="tanggalTempat"
                    value={formData.tanggalTempat}
                    onChange={(e) => handleInputChange("tanggalTempat", e.target.value)}
                    placeholder="Garut"
                  />
                </div>
                <div>
                  <Label htmlFor="tanggal">Tanggal</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => handleInputChange("tanggal", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pemilikPengelola">Pemilik/Pengelola SPBU</Label>
                  <Input
                    id="pemilikPengelola"
                    value={formData.pemilikPengelola}
                    onChange={(e) => handleInputChange("pemilikPengelola", e.target.value)}
                    placeholder="Nama dan tanda tangan"
                  />
                </div>
                <div>
                  <Label htmlFor="petugas">Petugas</Label>
                  <Input
                    id="petugas"
                    value={formData.petugas}
                    onChange={(e) => handleInputChange("petugas", e.target.value)}
                    placeholder="Nama dan tanda tangan"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold">Saksi-saksi:</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Input
                      id="saksi1"
                      value={formData.saksi1}
                      onChange={(e) => handleInputChange("saksi1", e.target.value)}
                      placeholder="Nama saksi 1"
                    />
                  </div>
                  <div>
                    <Input
                      id="saksi2"
                      value={formData.saksi2}
                      onChange={(e) => handleInputChange("saksi2", e.target.value)}
                      placeholder="Nama saksi 2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
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

export default PengawasanSPU;