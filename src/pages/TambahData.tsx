import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, ArrowLeft, Scale } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const uttpTypes = [
  { id: "te", name: "Timbangan Elektronik (TE)", icon: "⚖️" },
  { id: "tm", name: "Timbangan Meja (TM)", icon: "⚖️" },
  { id: "cb", name: "Timbangan Sensticimal (CB)", icon: "📏" },
  { id: "tbi", name: "Timbangan Bobot Ingsut (TBI)", icon: "👶" },
  { id: "tf", name: "Timbangan Pegas (TP)", icon: "📦" },
  { id: "dl", name: "Dacin Logam (DL)", icon: "⚖️" },
  { id: "at", name: "Anak Timbangan (AT)", icon: "🏋️" },
];

type UttpItem = {
  jenis: string;
  merk: string;
  kondisi: string;
  tahun_tera: string;
};

const TambahData: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama_pemilik: "",
    lokasi: "",
    jenis_lapak: "",
    jenis_dagangan: "",
    uttpList: [{ jenis: "", merk: "", kondisi: "", tahun_tera: "" }],
    catatan: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUttpChange = <K extends keyof UttpItem>(
    index: number,
    field: K,
    value: string
  ) => {
    const updatedList = [...formData.uttpList];
    updatedList[index][field] = value;
    setFormData((prev) => ({ ...prev, uttpList: updatedList }));
  };

  const addUttpField = () => {
    setFormData((prev) => ({
      ...prev,
      uttpList: [
        ...prev.uttpList,
        { jenis: "", merk: "", kondisi: "", tahun_tera: "" },
      ],
    }));
  };

  const removeUttpField = (index: number) => {
    const updatedList = [...formData.uttpList];
    updatedList.splice(index, 1);
    setFormData((prev) => ({ ...prev, uttpList: updatedList }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const expDate = new Date();
      expDate.setFullYear(expDate.getFullYear() + 1);
      const expDateStr = expDate.toISOString().split('T')[0];

      // Insert pelaku usaha dulu
      const { data: pelakuData, error: pelakuError } = await supabase
        .from("pelaku_usaha")
        .insert([
          {
            nama_pemilik: formData.nama_pemilik,
            lokasi: formData.lokasi,
            jenis_lapak: formData.jenis_lapak,
            jenis_dagangan: formData.jenis_dagangan,
            catatan: formData.catatan,
            status_tera: "Aktif",
            tanggal_tera_terakhir: today,
            tanggal_exp_tera: expDateStr
          },
        ])
        .select('id');

      if (pelakuError) throw pelakuError;

      const pelakuUsahaId = pelakuData[0].id;

      // Insert UTTP jika ada
      if (formData.uttpList.length > 0) {
        const uttpData = formData.uttpList
          .filter(uttp => uttp.jenis) // hanya yang ada jenisnya
          .map(uttp => ({
            pelaku_usaha_id: pelakuUsahaId,
            jenis: uttp.jenis,
            merk: uttp.merk || '',
            kondisi: uttp.kondisi || 'Baik',
            tahun_tera: uttp.tahun_tera ? new Date(uttp.tahun_tera).getFullYear() : null
          }));

        if (uttpData.length > 0) {
          const { error: uttpError } = await supabase
            .from("uttp")
            .insert(uttpData);

          if (uttpError) throw uttpError;
        }
      }

      toast.success("Data berhasil disimpan!");
      navigate("/admin/data-pelaku-usaha");
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal menyimpan data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // [UI tetap sama seperti yang kamu berikan, tidak diubah]
  // [kode form dan tampilan dibiarkan sama, hanya fungsi handleSubmit yang diganti agar menyimpan ke Supabase dengan benar]

  return (
    <AdminLayout>
      <div className="w-full px-6 md:px-10 lg:px-20 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/data-pelaku-usaha")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Tambah Data Pelaku Usaha</h1>
            <p className="text-gray-600">
              Isi data lengkap beserta UTTP yang digunakan
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informasi Pelaku Usaha */}
          <Card className="shadow-md w-full">
            <CardHeader>
              <CardTitle>Informasi Pelaku Usaha</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Nama Pemilik</Label>
                <Input
                  value={formData.nama_pemilik}
                  onChange={(e) =>
                    handleInputChange("nama_pemilik", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Lokasi</Label>
                <Input
                  value={formData.lokasi}
                  onChange={(e) => handleInputChange("lokasi", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Jenis Lapak</Label>
                <Select
                  value={formData.jenis_lapak}
                  onValueChange={(v) => handleInputChange("jenis_lapak", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis lapak" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kios">Kios</SelectItem>
                    <SelectItem value="Los">Los</SelectItem>
                    <SelectItem value="PKL">PKL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-3">
                <Label>Jenis Dagangan</Label>
                <Input
                  value={formData.jenis_dagangan}
                  onChange={(e) =>
                    handleInputChange("jenis_dagangan", e.target.value)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Daftar UTTP */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Daftar UTTP</h2>
              <Button type="button" onClick={addUttpField}>
                <Plus className="w-4 h-4 mr-2" /> Tambah UTTP
              </Button>
            </div>

            {formData.uttpList.map((uttp, index) => (
              <Card key={index} className="border shadow-sm mt-4">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-blue-600" /> UTTP{" "}
                      {index + 1}
                    </div>
                    {formData.uttpList.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-100"
                        onClick={() => removeUttpField(index)}
                      >
                        Hapus
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Jenis UTTP</Label>
                    <Select
                      value={uttp.jenis}
                      onValueChange={(v) => handleUttpChange(index, "jenis", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis UTTP" />
                      </SelectTrigger>
                      <SelectContent>
                        {uttpTypes.map((t) => (
                          <SelectItem key={t.id} value={t.name}>
                            {t.icon} {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Merk</Label>
                    <Input
                      value={uttp.merk}
                      onChange={(e) =>
                        handleUttpChange(index, "merk", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Kondisi</Label>
                    <Select
                      value={uttp.kondisi}
                      onValueChange={(v) =>
                        handleUttpChange(index, "kondisi", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kondisi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baik">Baik</SelectItem>
                        <SelectItem value="Rusak">Rusak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tahun Tera</Label>
                    <Input
                      type="date"
                      value={uttp.tahun_tera}
                      onChange={(e) =>
                        handleUttpChange(index, "tahun_tera", e.target.value)
                      }
                      className="border border-gray-300 rounded px-3 py-2 w-full"
                      placeholder="Pilih tanggal tera"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Catatan Tambahan */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Catatan Tambahan</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.catatan}
                onChange={(e) => handleInputChange("catatan", e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/data-pelaku-usaha")}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />{" "}
              {isLoading ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default TambahData;
