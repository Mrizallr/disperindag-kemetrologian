import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Globe,
  Download,
  Scale,
} from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  tanggal_tera?: string;
  tanggal_berlaku?: string;
};

interface DataTeraUmum {
  id: string;
  namaWajibTera: string;
  jenisWajibTera: "Perusahaan" | "Perorangan";
  namaUsaha: string;
  namaPemilik: string;
  alamat: string;
  nomorIzin: string;
  uttpList: UttpItem[];
  kapasitas: string;
  dayaBaca: string;
  tanggalTera: string;
  tanggalBerlaku: string;
  status: "Aktif" | "Tidak Aktif";
}

const DataWajibTeraUmum: React.FC = () => {
  const [data, setData] = useState<DataTeraUmum[]>([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataTeraUmum | null>(null);
  const [viewingItem, setViewingItem] = useState<DataTeraUmum | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterJenis, setFilterJenis] = useState<string>("all");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [formData, setFormData] = useState<Omit<DataTeraUmum, "id">>({
    namaWajibTera: "",
    jenisWajibTera: "Perusahaan",
    namaUsaha: "",
    namaPemilik: "",
    alamat: "",
    nomorIzin: "",
    uttpList: [{ jenis: "", merk: "", kondisi: "", tahun_tera: "" }],
    kapasitas: "",
    dayaBaca: "",
    tanggalTera: "",
    tanggalBerlaku: "",
    status: "Aktif",
  });

  // Fetch data dari database
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching data tera umum...");

      const { data: teraData, error } = await supabase
        .from("data_tera_umum")
        .select(
          `
          *,
          uttp:uttp!data_tera_umum_id(
            id,
            jenis,
            merk,
            kondisi,
            tahun_tera,
            tanggal_tera,
            tanggal_berlaku
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform data untuk kompatibilitas dengan UI
      const transformedData = (teraData || []).map((item) => ({
        id: item.id.toString(),
        namaWajibTera: item.nama_wajib_tera,
        jenisWajibTera: item.jenis_wajib_tera as "Perusahaan" | "Perorangan",
        namaUsaha: item.nama_usaha,
        namaPemilik: item.nama_pemilik,
        alamat: item.alamat,
        nomorIzin: item.nomor_izin,
        uttpList: (item.uttp || []).map((u: any) => ({
          jenis: u.jenis,
          merk: u.merk,
          kondisi: u.kondisi,
          tahun_tera: u.tahun_tera?.toString() || "",
          tanggal_tera: u.tanggal_tera || '',
          tanggal_berlaku: u.tanggal_berlaku || '',
        })),
        kapasitas: item.kapasitas || "",
        dayaBaca: item.daya_baca || "",
        tanggalTera: item.tanggal_tera,
        tanggalBerlaku: item.tanggal_berlaku,
        status: item.status as "Aktif" | "Tidak Aktif",
      }));

      setData(transformedData);
      console.log("Data loaded:", transformedData.length, "records");
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.namaWajibTera.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaUsaha.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaPemilik.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesJenis =
      filterJenis === "all" || item.jenisWajibTera === filterJenis;

    return matchesSearch && matchesStatus && matchesJenis;
  });

  const handleInputChange = (
    field: keyof Omit<DataTeraUmum, "id">,
    value: string | UttpItem[]
  ) => {
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
    setLoading(true);

    try {
      if (editingItem) {
        // Update data
        const { error } = await supabase
          .from("data_tera_umum")
          .update({
            nama_wajib_tera: formData.namaWajibTera,
            jenis_wajib_tera: formData.jenisWajibTera,
            nama_usaha: formData.namaUsaha,
            nama_pemilik: formData.namaPemilik,
            alamat: formData.alamat,
            nomor_izin: formData.nomorIzin,
            kapasitas: formData.kapasitas,
            daya_baca: formData.dayaBaca,
            status: formData.status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", parseInt(editingItem.id));

        if (error) throw error;

        // Update UTTP
        await supabase
          .from("uttp")
          .delete()
          .eq("data_tera_umum_id", parseInt(editingItem.id));

        for (const uttp of formData.uttpList) {
          if (uttp.jenis) {
            const teraDate = new Date(uttp.tahun_tera || new Date());
            const expDate = new Date(teraDate);
            expDate.setFullYear(expDate.getFullYear() + 1);
            
            await supabase.from("uttp").insert({
              data_tera_umum_id: parseInt(editingItem.id),
              jenis: uttp.jenis,
              merk: uttp.merk,
              kondisi: uttp.kondisi,
              tahun_tera: teraDate.getFullYear(),
              tanggal_tera: uttp.tahun_tera || new Date().toISOString().split('T')[0],
              tanggal_berlaku: expDate.toISOString().split('T')[0],
            });
          }
        }

        toast.success("Data berhasil diperbarui");
      } else {
        // Insert data baru
        const { data: newData, error } = await supabase
          .from("data_tera_umum")
          .insert({
            nama_wajib_tera: formData.namaWajibTera,
            jenis_wajib_tera: formData.jenisWajibTera,
            nama_usaha: formData.namaUsaha,
            nama_pemilik: formData.namaPemilik,
            alamat: formData.alamat,
            nomor_izin: formData.nomorIzin,
            kapasitas: formData.kapasitas,
            daya_baca: formData.dayaBaca,
            status: formData.status,
          })
          .select()
          .single();

        if (error) throw error;

        // Insert UTTP
        for (const uttp of formData.uttpList) {
          if (uttp.jenis) {
            const teraDate = new Date(uttp.tahun_tera || new Date());
            const expDate = new Date(teraDate);
            expDate.setFullYear(expDate.getFullYear() + 1);
            
            await supabase.from("uttp").insert({
              data_tera_umum_id: newData.id,
              jenis: uttp.jenis,
              merk: uttp.merk,
              kondisi: uttp.kondisi,
              tahun_tera: teraDate.getFullYear(),
              tanggal_tera: uttp.tahun_tera || new Date().toISOString().split('T')[0],
              tanggal_berlaku: expDate.toISOString().split('T')[0],
            });
          }
        }

        toast.success("Data berhasil ditambahkan");
      }

      resetForm();
      fetchData();
      
      // Trigger refresh untuk dashboard
      window.dispatchEvent(new CustomEvent('dataUpdated', { 
        detail: { type: 'tera_umum', action: editingItem ? 'update' : 'create' } 
      }));
    } catch (error: any) {
      console.error("Error saving data:", error);
      toast.error("Gagal menyimpan data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      namaWajibTera: "",
      jenisWajibTera: "Perusahaan",
      namaUsaha: "",
      namaPemilik: "",
      alamat: "",
      nomorIzin: "",
      uttpList: [{ jenis: "", merk: "", kondisi: "", tahun_tera: "" }],
      kapasitas: "",
      dayaBaca: "",
      tanggalTera: "",
      tanggalBerlaku: "",
      status: "Aktif",
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: DataTeraUmum) => {
    setEditingItem(item);
    setFormData({
      namaWajibTera: item.namaWajibTera,
      jenisWajibTera: item.jenisWajibTera,
      namaUsaha: item.namaUsaha,
      namaPemilik: item.namaPemilik,
      alamat: item.alamat,
      nomorIzin: item.nomorIzin,
      uttpList: item.uttpList,
      kapasitas: item.kapasitas,
      dayaBaca: item.dayaBaca,
      tanggalTera: item.tanggalTera,
      tanggalBerlaku: item.tanggalBerlaku,
      status: item.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        // Hapus UTTP terlebih dahulu
        const { error: uttpError } = await supabase
          .from('uttp')
          .delete()
          .eq('data_tera_umum_id', parseInt(id));

        if (uttpError) {
          console.log('UTTP delete failed:', uttpError.message);
        }

        // Kemudian hapus data tera umum
        const { error } = await supabase
          .from("data_tera_umum")
          .delete()
          .eq("id", parseInt(id));

        if (error) throw error;

        toast.success("Data berhasil dihapus");
        fetchData();
        
        // Trigger refresh untuk dashboard
        window.dispatchEvent(new CustomEvent('dataUpdated', { 
          detail: { type: 'tera_umum', action: 'delete' } 
        }));
      } catch (error: any) {
        console.error("Error deleting data:", error);
        toast.error("Gagal menghapus data: " + error.message);
      }
    }
  };

  const handleExport = () => {
    // Filter data berdasarkan tanggal jika ada
    let dataToExport = filteredData;
    
    if (filterStartDate || filterEndDate) {
      dataToExport = filteredData.filter((item) => {
        // Ambil tanggal tera dari UTTP pertama
        const teraDate = item.uttpList.length > 0 && item.uttpList[0].tanggal_tera
          ? new Date(item.uttpList[0].tanggal_tera)
          : null;
        
        if (!teraDate) return false;
        
        const startDate = filterStartDate ? new Date(filterStartDate) : null;
        const endDate = filterEndDate ? new Date(filterEndDate) : null;
        
        if (startDate && endDate) {
          return teraDate >= startDate && teraDate <= endDate;
        } else if (startDate) {
          return teraDate >= startDate;
        } else if (endDate) {
          return teraDate <= endDate;
        }
        
        return true;
      });
    }

    const exportData = dataToExport.map((item, index) => ({
      No: index + 1,
      NamaUsaha: item.namaUsaha,
      NamaPemilik: item.namaPemilik,
      Alamat: item.alamat,
      NomorIzin: item.nomorIzin,
      JenisUTTP: item.uttpList.map((u) => u.jenis).join(", "),
      MerkUTTP: item.uttpList.map((u) => u.merk).join(", "),
      Kapasitas: item.kapasitas,
      TanggalTera: item.uttpList.length > 0 && item.uttpList[0].tanggal_tera
        ? new Date(item.uttpList[0].tanggal_tera).toLocaleDateString("id-ID")
        : "-",
      TanggalBerlaku: item.uttpList.length > 0 && item.uttpList[0].tanggal_berlaku
        ? new Date(item.uttpList[0].tanggal_berlaku).toLocaleDateString("id-ID")
        : "-",
      Status: item.status,
    }));

    const doc = new jsPDF("landscape");
    
    // Title dengan info filter tanggal
    let title = "Data Tera Umum";
    if (filterStartDate || filterEndDate) {
      title += " - Periode: ";
      if (filterStartDate) title += new Date(filterStartDate).toLocaleDateString("id-ID");
      if (filterStartDate && filterEndDate) title += " s/d ";
      if (filterEndDate) title += new Date(filterEndDate).toLocaleDateString("id-ID");
    }
    
    doc.text(title, 14, 15);
    autoTable(doc, {
      head: [
        [
          "No",
          "Nama Usaha",
          "Nama Pemilik",
          "Alamat",
          "No Izin",
          "Jenis UTTP",
          "Merk UTTP",
          "Kapasitas",
          "Tgl Tera",
          "Tgl Berlaku",
          "Status",
        ],
      ],
      body: exportData.map((d) => Object.values(d)),
      foot: [
        [
          "Total: " + dataToExport.length + " data",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
      ],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      startY: 20,
    });
    
    const fileName = filterStartDate || filterEndDate
      ? `data-tera-umum-${filterStartDate || 'awal'}-${filterEndDate || 'akhir'}.pdf`
      : "data-tera-umum.pdf";
    
    doc.save(fileName);
    toast.success(`PDF berhasil diexport (${dataToExport.length} data)`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Globe className="w-8 h-8 text-purple-600" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Data Wajib Tera - Umum
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola data wajib tera untuk masyarakat umum
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showDateFilter} onOpenChange={setShowDateFilter}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Export Data ke PDF</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Filter data berdasarkan tanggal tera (opsional)
                  </p>
                  <div>
                    <Label htmlFor="startDate">Tanggal Mulai</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={filterStartDate}
                      onChange={(e) => setFilterStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Tanggal Akhir</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={filterEndDate}
                      onChange={(e) => setFilterEndDate(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterStartDate("");
                        setFilterEndDate("");
                      }}
                    >
                      Reset Filter
                    </Button>
                    <Button
                      onClick={() => {
                        handleExport();
                        setShowDateFilter(false);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Data
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Data Umum" : "Tambah Data Umum"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 max-h-96 overflow-y-auto"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="namaWajibTera">Nama Wajib Tera</Label>
                      <Input
                        id="namaWajibTera"
                        value={formData.namaWajibTera}
                        onChange={(e) =>
                          handleInputChange("namaWajibTera", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="jenisWajibTera">Jenis Wajib Tera</Label>
                      <Select
                        value={formData.jenisWajibTera}
                        onValueChange={(v) =>
                          handleInputChange(
                            "jenisWajibTera",
                            v as "Perusahaan" | "Perorangan"
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih jenis" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Perusahaan">Perusahaan</SelectItem>
                          <SelectItem value="Perorangan">Perorangan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="namaUsaha">Nama Usaha</Label>
                      <Input
                        id="namaUsaha"
                        value={formData.namaUsaha}
                        onChange={(e) =>
                          handleInputChange("namaUsaha", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="namaPemilik">Nama Pemilik</Label>
                      <Input
                        id="namaPemilik"
                        value={formData.namaPemilik}
                        onChange={(e) =>
                          handleInputChange("namaPemilik", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="alamat">Alamat</Label>
                    <Input
                      id="alamat"
                      value={formData.alamat}
                      onChange={(e) =>
                        handleInputChange("alamat", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="nomorIzin">Nomor Izin</Label>
                    <Input
                      id="nomorIzin"
                      value={formData.nomorIzin}
                      onChange={(e) =>
                        handleInputChange("nomorIzin", e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Daftar UTTP */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg font-semibold">
                        Daftar UTTP
                      </Label>
                      <Button type="button" onClick={addUttpField} size="sm">
                        <Plus className="w-4 h-4 mr-2" /> Tambah UTTP
                      </Button>
                    </div>

                    {formData.uttpList.map((uttp, index) => (
                      <Card key={index} className="border">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Scale className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">
                                UTTP {index + 1}
                              </span>
                            </div>
                            {formData.uttpList.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-100"
                                onClick={() => removeUttpField(index)}
                              >
                                Hapus
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                          <div>
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
                          <div>
                            <Label>Merk</Label>
                            <Input
                              value={uttp.merk}
                              onChange={(e) =>
                                handleUttpChange(index, "merk", e.target.value)
                              }
                            />
                          </div>
                          <div>
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
                          <div>
                            <Label>Tanggal Tera</Label>
                            <Input
                              type="date"
                              value={uttp.tahun_tera}
                              onChange={(e) =>
                                handleUttpChange(
                                  index,
                                  "tahun_tera",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="kapasitas">Kapasitas</Label>
                      <Input
                        id="kapasitas"
                        value={formData.kapasitas}
                        onChange={(e) =>
                          handleInputChange("kapasitas", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dayaBaca">Daya Baca</Label>
                      <Input
                        id="dayaBaca"
                        value={formData.dayaBaca}
                        onChange={(e) =>
                          handleInputChange("dayaBaca", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(v) =>
                        handleInputChange(
                          "status",
                          v as "Aktif" | "Tidak Aktif"
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aktif">Aktif</SelectItem>
                        <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Batal
                    </Button>
                    <Button type="submit">
                      {editingItem ? "Perbarui" : "Simpan"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Data Tera Umum</CardTitle>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Menampilkan {filteredData.length} dari {data.length} data
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari nama wajib tera, usaha, atau pemilik..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterJenis} onValueChange={setFilterJenis}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="Perusahaan">Perusahaan</SelectItem>
                    <SelectItem value="Perorangan">Perorangan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <p>Loading...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Wajib Tera</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Nama Pemilik</TableHead>
                    <TableHead>Tanggal Tera</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.namaWajibTera}
                      </TableCell>
                      <TableCell>{item.jenisWajibTera}</TableCell>
                      <TableCell>{item.namaPemilik}</TableCell>
                      <TableCell>
                        {item.uttpList.length > 0 && item.uttpList[0].tanggal_tera 
                          ? new Date(item.uttpList[0].tanggal_tera).toLocaleDateString('id-ID')
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            item.status === "Aktif"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingItem(item)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={!!viewingItem} onOpenChange={() => setViewingItem(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Data Umum</DialogTitle>
            </DialogHeader>
            {viewingItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Nama Wajib Tera</Label>
                    <p>{viewingItem.namaWajibTera}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Jenis Wajib Tera</Label>
                    <p>{viewingItem.jenisWajibTera}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Nama Usaha</Label>
                    <p>{viewingItem.namaUsaha}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Nama Pemilik</Label>
                    <p>{viewingItem.namaPemilik}</p>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Alamat</Label>
                  <p>{viewingItem.alamat}</p>
                </div>
                <div>
                  <Label className="font-semibold">Nomor Izin</Label>
                  <p>{viewingItem.nomorIzin}</p>
                </div>

                {/* UTTP List */}
                <div>
                  <Label className="font-semibold">Daftar UTTP</Label>
                  <div className="mt-2 space-y-2">
                    {viewingItem.uttpList.map((uttp, index) => (
                      <div
                        key={index}
                        className="p-3 border rounded-lg bg-gray-50"
                      >
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <strong>Jenis:</strong> {uttp.jenis}
                          </div>
                          <div>
                            <strong>Merk:</strong> {uttp.merk}
                          </div>
                          <div>
                            <strong>Kondisi:</strong> {uttp.kondisi}
                          </div>
                          <div>
                            <strong>Tanggal Tera:</strong>{" "}
                            {uttp.tanggal_tera 
                              ? new Date(uttp.tanggal_tera).toLocaleDateString('id-ID')
                              : '-'
                            }
                          </div>
                          <div>
                            <strong>Tanggal Berlaku:</strong>{" "}
                            {uttp.tanggal_berlaku 
                              ? new Date(uttp.tanggal_berlaku).toLocaleDateString('id-ID')
                              : '-'
                            }
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Kapasitas</Label>
                    <p>{viewingItem.kapasitas}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Daya Baca</Label>
                    <p>{viewingItem.dayaBaca}</p>
                  </div>
                </div>

                <div>
                  <Label className="font-semibold">Status</Label>
                  <p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        viewingItem.status === "Aktif"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {viewingItem.status}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default DataWajibTeraUmum;
