import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const kecamatanList = [
  "Garut Kota",
  "Tarogong Kaler",
  "Tarogong Kidul",
  "Samarang",
  "Leles",
  "Kadungora",
  "Limbangan",
  "Kersamanah",
  "Malangbong",
  "Selaawi",
  "Cibiuk",
  "Leuwigoong",
  "Banyuresmi",
  "Cibatu",
  "Pakenjeng",
  "Karangtengah",
  "Sukawening",
  "Wanaraja",
  "Sucinaraja",
  "Karangpawitan",
  "Talegong",
  "Cisewu",
  "Caringin",
  "Mekarmukti",
  "Bungbulang",
  "Pamulihan",
  "Cilawu",
  "Cikelet",
  "Pameungpeuk",
  "Cibalong",
  "Cisompet",
  "Cisurupan",
  "Garut Selatan",
  "Bayongbong",
  "Singajaya",
];

const spbuList = Array.from(
  { length: 24 },
  (_, i) => `SPBU 34.44${(101 + i).toString()}`
);

interface FormData {
  namaPerusahaan: string;
  alamatPerusahaan: string;
  alamatUttp: string;
  kecamatan: string;
  noContact: string;
  jenisUttp: string;
  nomorSpbu: string;
  jumlahPompa: number;
  jumlahNozzle: number;
  nomorSurat: string;
  tanggalSurat: string;
  fileSurat: File | null;
}

const FormPengajuanTera: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    namaPerusahaan: "",
    alamatPerusahaan: "",
    alamatUttp: "",
    kecamatan: "",
    noContact: "",
    jenisUttp: "",
    nomorSpbu: "",
    jumlahPompa: 0,
    jumlahNozzle: 0,
    nomorSurat: "",
    tanggalSurat: "",
    fileSurat: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    field: keyof FormData,
    value: string | number | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10 MB");
      return;
    }
    handleInputChange("fileSurat", file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload file ke Supabase Storage
      let fileUrl = null;
      if (formData.fileSurat) {
        const fileName = `${Date.now()}_${formData.fileSurat.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("uploads")
          .upload(fileName, formData.fileSurat);

        if (uploadError) throw uploadError;
        fileUrl = uploadData.path;
      }

      // Insert data ke Supabase
      const { error } = await supabase.from("pengajuan_tera").insert({
        nama_perusahaan: formData.namaPerusahaan,
        alamat_perusahaan: formData.alamatPerusahaan,
        alamat_uttp: formData.alamatUttp,
        kecamatan: formData.kecamatan,
        no_contact: formData.noContact,
        jenis_uttp: formData.jenisUttp,
        nomor_spbu: formData.nomorSpbu,
        jumlah_pompa: formData.jumlahPompa,
        jumlah_nozzle: formData.jumlahNozzle,
        nomor_surat: formData.nomorSurat,
        tanggal_surat: formData.tanggalSurat,
        file_surat_url: fileUrl,
        status: "Pending"
      });

      if (error) throw error;

      toast.success("Data tera ulang berhasil disimpan!");
      navigate("/admin/perpanjang");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal mengirim pengajuan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 dark:bg-gray-950 m-0 p-0">
      <div className="w-full px-4 py-8">
        {/* Header dan Deskripsi */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center shadow-md">
                <FileText className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 leading-tight">
              Form Tambah Tera Ulang UTTP
            </h1>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-4 text-sm max-w-3xl mx-auto shadow-inner">
            <p className="text-blue-800 dark:text-blue-300 font-medium">
              Sebelum mengisi, harap siapkan file **Surat Permohonan Tera/Tera
              Ulang** dalam format PDF. Isi form sesuai data surat.
            </p>
          </div>
        </div>

        {/* Card Formulir - Centered */}
        <Card className="shadow-2xl border-0 bg-white dark:bg-slate-800/95 max-w-6xl mx-auto rounded-2xl overflow-hidden backdrop-blur-sm">
          <CardHeader className="text-center py-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <CardTitle className="text-2xl font-bold">
              Formulir Tera Ulang
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* === Bagian Data Perusahaan === */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                      1
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Data Perusahaan & Lokasi
                  </h2>
                </div>

                {/* Grid responsif untuk layar besar */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="namaPerusahaan">
                      Nama Perusahaan (Pemilik/Pemakai UTTP) *
                    </Label>
                    <Input
                      id="namaPerusahaan"
                      value={formData.namaPerusahaan}
                      onChange={(e) =>
                        handleInputChange("namaPerusahaan", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="noContact">No. Contact Person</Label>
                    <Input
                      id="noContact"
                      value={formData.noContact}
                      onChange={(e) =>
                        handleInputChange("noContact", e.target.value)
                      }
                      placeholder="Contoh: 0812xxxx"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="alamatPerusahaan">
                      Alamat Lengkap Perusahaan
                    </Label>
                    <Textarea
                      id="alamatPerusahaan"
                      value={formData.alamatPerusahaan}
                      onChange={(e) =>
                        handleInputChange("alamatPerusahaan", e.target.value)
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="alamatUttp">Alamat Lokasi UTTP *</Label>
                    <Textarea
                      id="alamatUttp"
                      placeholder="Contoh: Jl. ABC No 7, Ds Suka"
                      value={formData.alamatUttp}
                      onChange={(e) =>
                        handleInputChange("alamatUttp", e.target.value)
                      }
                      required
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="kecamatan">Kecamatan (lokasi UTTP)</Label>
                    <Select
                      value={formData.kecamatan}
                      onValueChange={(v) => handleInputChange("kecamatan", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Kecamatan" />
                      </SelectTrigger>
                      <SelectContent>
                        {kecamatanList.map((kec) => (
                          <SelectItem key={kec} value={kec}>
                            {kec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div></div> {/* Space untuk keseimbangan grid */}
                </div>
              </section>

              {/* === Bagian Detail UTTP === */}
              <section className="space-y-6 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                      2
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Detail Alat UTTP
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="jenisUttp">Jenis UTTP *</Label>
                    <Select
                      value={formData.jenisUttp}
                      onValueChange={(v) => handleInputChange("jenisUttp", v)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Jenis UTTP" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pompa Ukur BBM">
                          Pompa Ukur BBM
                        </SelectItem>
                        <SelectItem value="Timbangan Jembatan/AMP/Batching Plant">
                          Timbangan Jembatan/AMP/Batching Plant
                        </SelectItem>
                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="nomorSpbu">Nomor SPBU</Label>
                    <Select
                      value={formData.nomorSpbu}
                      onValueChange={(v) => handleInputChange("nomorSpbu", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih SPBU" />
                      </SelectTrigger>
                      <SelectContent>
                        {spbuList.map((spbu) => (
                          <SelectItem key={spbu} value={spbu}>
                            {spbu}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="jumlahPompa">Jml Pompa / Dispenser</Label>
                    <Input
                      id="jumlahPompa"
                      type="number"
                      min="0"
                      value={formData.jumlahPompa}
                      onChange={(e) =>
                        handleInputChange(
                          "jumlahPompa",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="jumlahNozzle">Jml Nozzle Total</Label>
                    <Input
                      id="jumlahNozzle"
                      type="number"
                      min="0"
                      value={formData.jumlahNozzle}
                      onChange={(e) =>
                        handleInputChange(
                          "jumlahNozzle",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div></div> {/* Space untuk keseimbangan */}
                  <div></div> {/* Space untuk keseimbangan */}
                </div>
              </section>

              {/* === Bagian Dokumen === */}
              <section className="space-y-6 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                      3
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    Dokumen Pendukung
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nomorSurat">Nomor Surat Permohonan</Label>
                    <Input
                      id="nomorSurat"
                      value={formData.nomorSurat}
                      onChange={(e) =>
                        handleInputChange("nomorSurat", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="tanggalSurat">Tanggal Surat</Label>
                    <Input
                      id="tanggalSurat"
                      type="date"
                      value={formData.tanggalSurat}
                      onChange={(e) =>
                        handleInputChange("tanggalSurat", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fileSurat">
                    Upload Surat Permohonan (PDF/DOC) *
                  </Label>
                  <div className="mt-2">
                    <Input
                      id="fileSurat"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="h-13 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-4 px-4 hover:border-blue-400 transition-colors"
                    />
                    {formData.fileSurat && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <span className="text-sm font-medium text-green-700 dark:text-green-300">
                          ✓ {formData.fileSurat.name}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                    Dukungan: PDF atau document. Maksimal ukuran file: 10 MB.
                  </p>
                </div>
              </section>

              {/* Tombol Submit */}
              <div className="pt-12 border-t border-gray-200 dark:border-gray-700">
                <div className="max-w-md mx-auto">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {isSubmitting ? (
                      <>
                        <Upload className="w-5 h-5 mr-2 animate-spin" />
                        Menyimpan Data...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Simpan Tera Ulang
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormPengajuanTera;
