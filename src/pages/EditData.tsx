import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "../lib/supabase"; // pastikan path-nya sesuai
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface UttpItem {
  jenis: string;
  merk: string;
  kondisi: string;
  tahun_tera: string;
}

interface FormDataType {
  id: number;
  nama_pemilik: string;
  lokasi: string;
  jenis_lapak: string;
  jenis_dagangan: string;
  uttpList: UttpItem[];
  catatan: string;
  status_tera: string;
  tahun_tera_terakhir: number;
}

interface UttpType {
  id: number;
  name: string;
  icon: string;
}

const uttpTypes = [
  { id: "te", name: "Timbangan Elektronik (TE)", icon: "⚖️" },
  { id: "tm", name: "Timbangan Meja (TM)", icon: "⚖️" },
  { id: "cb", name: "Timbangan Sensticimal (CB)", icon: "📏" },
  { id: "tbi", name: "Timbangan Bobot Ingsut (TBI)", icon: "👶" },
  { id: "tf", name: "Timbangan Pegas (TP)", icon: "📦" },
  { id: "dl", name: "Dacin Logam (DL)", icon: "⚖️" },
  { id: "at", name: "Anak Timbangan (AT)", icon: "🏋️" },
];

const EditData: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<FormDataType | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("pelaku_usaha")
        .select("*, uttp(*)")
        .eq("id", id)
        .single();

      if (error) {
        toast.error("Gagal mengambil data dari server.");
        console.error(error);
      } else {
        const uttpList =
          data.uttp?.map((u: any) => ({
            jenis: u.jenis,
            merk: u.merk,
            kondisi: u.kondisi,
            tahun_tera: new Date(u.tahun_tera).toISOString().split("T")[0],
          })) || [];

        const mappedData: FormDataType = {
          id: data.id,
          nama_pemilik: data.nama_pemilik,
          lokasi: data.lokasi,
          jenis_lapak: data.jenis_lapak,
          jenis_dagangan: data.jenis_dagangan,
          status_tera: data.status_tera,
          tahun_tera_terakhir: data.tahun_tera_terakhir,
          catatan: data.catatan || "",
          uttpList,
        };

        setFormData(mappedData);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (field: keyof FormDataType, value: string) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleUttpChange = (
    index: number,
    field: keyof UttpItem,
    value: string
  ) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newList = [...prev.uttpList];
      newList[index][field] = value;
      return { ...prev, uttpList: newList };
    });
  };

  const addUttpField = () => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            uttpList: [
              ...prev.uttpList,
              { jenis: "", merk: "", kondisi: "", tahun_tera: "" },
            ],
          }
        : prev
    );
  };

  const removeUttpField = (index: number) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const newList = prev.uttpList.filter((_, i) => i !== index);
      return { ...prev, uttpList: newList };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsLoading(true);

    // Update data pelaku_usaha
    const { error: updateError } = await supabase
      .from("pelaku_usaha")
      .update({
        nama_pemilik: formData.nama_pemilik,
        lokasi: formData.lokasi,
        jenis_lapak: formData.jenis_lapak,
        jenis_dagangan: formData.jenis_dagangan,
        status_tera: formData.status_tera,
        tahun_tera_terakhir: formData.tahun_tera_terakhir,
        catatan: formData.catatan,
      })
      .eq("id", formData.id);

    if (updateError) {
      toast.error("Gagal menyimpan data utama");
      console.error(updateError);
      setIsLoading(false);
      return;
    }

    // Opsional: update UTTP (hapus lama, tambah baru)
    const { error: deleteError } = await supabase
      .from("uttp")
      .delete()
      .eq("pelaku_usaha_id", formData.id);

    if (deleteError) {
      toast.error("Gagal menghapus UTTP lama");
      console.error(deleteError);
      setIsLoading(false);
      return;
    }

    const uttpInsertData = formData.uttpList.map((u) => ({
      pelaku_usaha_id: formData.id,
      jenis: u.jenis,
      merk: u.merk,
      kondisi: u.kondisi,
      tahun_tera: new Date(u.tahun_tera).getFullYear(), // Convert date string to year integer
    }));

    const { error: insertError } = await supabase
      .from("uttp")
      .insert(uttpInsertData);

    if (insertError) {
      toast.error("Gagal menambahkan UTTP baru");
      console.error(insertError);
    } else {
      toast.success("Data berhasil diperbarui!");
      navigate("/admin/data-pelaku-usaha");
    }

    setIsLoading(false);
  };
  if (!formData) return <div className="p-10">Memuat data...</div>;

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
            <h1 className="text-3xl font-bold">Edit Data Pelaku Usaha</h1>
            <p className="text-gray-600">
              Perbarui informasi pelaku usaha dan daftar UTTP
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <Card className="shadow-md w-full">
            <CardHeader></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Daftar UTTP</h2>
                <Button type="button" onClick={addUttpField}>
                  + Tambah UTTP
                </Button>
              </div>

              {formData.uttpList.map((uttp, index) => (
                <Card key={index} className="border shadow-sm mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Save className="w-5 h-5 text-blue-600" /> UTTP{" "}
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
                        onValueChange={(v) =>
                          handleUttpChange(index, "jenis", v)
                        }
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
            </CardContent>
          </Card>

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
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditData;
