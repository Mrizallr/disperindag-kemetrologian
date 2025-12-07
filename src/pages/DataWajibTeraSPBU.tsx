import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
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
import { Plus, Edit, Trash2, Eye, Search, Scale, Download } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DataTeraSPBU {
  id: string;
  namaSpbu: string;
  alamat: string;
  nomorIzin: string;
  jenisAlat: string;
  merkAlat: string;
  nomorSeri: string;
  kapasitas: string;
  lajuAlirMin: string;
  lajuAlirMax: string;
  tanggalTera: string;
  tanggalBerlaku: string;
  status: "Aktif" | "Tidak Aktif";
}

const DataWajibTeraSPBU: React.FC = () => {
  const [data, setData] = useState<DataTeraSPBU[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterJenis, setFilterJenis] = useState<string>("all");
  const [filterStartDate, setFilterStartDate] = useState<string>("");
  const [filterEndDate, setFilterEndDate] = useState<string>("");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataTeraSPBU | null>(null);
  const [viewingItem, setViewingItem] = useState<DataTeraSPBU | null>(null);
  const [formData, setFormData] = useState<Omit<DataTeraSPBU, "id">>({
    namaSpbu: "",
    alamat: "",
    nomorIzin: "",
    jenisAlat: "",
    merkAlat: "",
    nomorSeri: "",
    kapasitas: "",
    lajuAlirMin: "",
    lajuAlirMax: "",
    tanggalTera: "",
    tanggalBerlaku: "",
    status: "Aktif",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: teraData, error } = await supabase
        .from('data_tera_spbu')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = (teraData || []).map(item => ({
        id: item.id.toString(),
        namaSpbu: item.nama_spbu,
        alamat: item.alamat,
        nomorIzin: item.nomor_izin,
        jenisAlat: item.jenis_alat,
        merkAlat: item.merk_alat,
        nomorSeri: item.nomor_seri,
        kapasitas: item.kapasitas,
        lajuAlirMin: item.laju_alir_min,
        lajuAlirMax: item.laju_alir_max,
        tanggalTera: item.tanggal_tera,
        tanggalBerlaku: item.tanggal_berlaku,
        status: item.status as "Aktif" | "Tidak Aktif"
      }));

      setData(transformedData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchesSearch = 
      item.namaSpbu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.jenisAlat.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (field: keyof Omit<DataTeraSPBU, "id">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        const { error } = await supabase
          .from('data_tera_spbu')
          .update({
            nama_spbu: formData.namaSpbu,
            alamat: formData.alamat,
            nomor_izin: formData.nomorIzin,
            jenis_alat: formData.jenisAlat,
            merk_alat: formData.merkAlat,
            nomor_seri: formData.nomorSeri,
            kapasitas: formData.kapasitas,
            laju_alir_min: formData.lajuAlirMin,
            laju_alir_max: formData.lajuAlirMax,
            tanggal_tera: formData.tanggalTera,
            tanggal_berlaku: formData.tanggalBerlaku,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', parseInt(editingItem.id));

        if (error) throw error;

        // Update UTTP
        await supabase
          .from("uttp")
          .delete()
          .eq("data_tera_spbu_id", parseInt(editingItem.id));

        await supabase.from("uttp").insert({
          data_tera_spbu_id: parseInt(editingItem.id),
          jenis: formData.jenisAlat,
          merk: formData.merkAlat,
          kondisi: 'Baik',
          tahun_tera: new Date().getFullYear(),
        });

        toast.success("Data berhasil diperbarui");
      } else {
        const { data: newData, error } = await supabase
          .from('data_tera_spbu')
          .insert({
            nama_spbu: formData.namaSpbu,
            alamat: formData.alamat,
            nomor_izin: formData.nomorIzin,
            jenis_alat: formData.jenisAlat,
            merk_alat: formData.merkAlat,
            nomor_seri: formData.nomorSeri,
            kapasitas: formData.kapasitas,
            laju_alir_min: formData.lajuAlirMin,
            laju_alir_max: formData.lajuAlirMax,
            tanggal_tera: formData.tanggalTera,
            tanggal_berlaku: formData.tanggalBerlaku,
            status: formData.status
          })
          .select()
          .single();

        if (error) throw error;

        // Insert UTTP ke tabel uttp
        await supabase.from("uttp").insert({
          data_tera_spbu_id: newData.id,
          jenis: formData.jenisAlat,
          merk: formData.merkAlat,
          kondisi: 'Baik',
          tahun_tera: new Date().getFullYear(),
        });

        toast.success("Data berhasil ditambahkan");
      }
      
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Error saving data:', error);
      toast.error('Gagal menyimpan data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      namaSpbu: "",
      alamat: "",
      nomorIzin: "",
      jenisAlat: "",
      merkAlat: "",
      nomorSeri: "",
      kapasitas: "",
      lajuAlirMin: "",
      lajuAlirMax: "",
      tanggalTera: "",
      tanggalBerlaku: "",
      status: "Aktif",
    });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (item: DataTeraSPBU) => {
    setEditingItem(item);
    setFormData({
      namaSpbu: item.namaSpbu,
      alamat: item.alamat,
      nomorIzin: item.nomorIzin,
      jenisAlat: item.jenisAlat,
      merkAlat: item.merkAlat,
      nomorSeri: item.nomorSeri,
      kapasitas: item.kapasitas,
      lajuAlirMin: item.lajuAlirMin,
      lajuAlirMax: item.lajuAlirMax,
      tanggalTera: item.tanggalTera,
      tanggalBerlaku: item.tanggalBerlaku,
      status: item.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const { error } = await supabase
          .from('data_tera_spbu')
          .delete()
          .eq('id', parseInt(id));

        if (error) throw error;
        toast.success("Data berhasil dihapus");
        fetchData();
      } catch (error: any) {
        console.error('Error deleting data:', error);
        toast.error('Gagal menghapus data: ' + error.message);
      }
    }
  };

  const handleExport = () => {
    // Filter data berdasarkan tanggal jika ada
    let dataToExport = filteredData;
    
    if (filterStartDate || filterEndDate) {
      dataToExport = filteredData.filter((item) => {
        const teraDate = new Date(item.tanggalTera);
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
      NamaSPBU: item.namaSpbu || "-",
      Alamat: item.alamat || "-",
      NomorIzin: item.nomorIzin || "-",
      JenisAlat: item.jenisAlat || "-",
      MerkAlat: item.merkAlat || "-",
      NomorSeri: item.nomorSeri || "-",
      Kapasitas: item.kapasitas || "-",
      LajuAlirMin: item.lajuAlirMin || "-",
      LajuAlirMax: item.lajuAlirMax || "-",
      TanggalTera: new Date(item.tanggalTera).toLocaleDateString('id-ID'),
      TanggalBerlaku: new Date(item.tanggalBerlaku).toLocaleDateString('id-ID'),
      Status: item.status || "-"
    }));

    const doc = new jsPDF("landscape");
    
    let title = "Data Wajib Tera SPBU";
    if (filterStartDate || filterEndDate) {
      title += " - Periode: ";
      if (filterStartDate) title += new Date(filterStartDate).toLocaleDateString("id-ID");
      if (filterStartDate && filterEndDate) title += " s/d ";
      if (filterEndDate) title += new Date(filterEndDate).toLocaleDateString("id-ID");
    }
    
    doc.text(title, 14, 15);
    autoTable(doc, {
      head: [[
        "No", "Nama SPBU", "Alamat", "Nomor Izin", "Jenis Alat", "Merk Alat", 
        "Nomor Seri", "Kapasitas", "Laju Alir Min", "Laju Alir Max", "Tgl Tera", "Tgl Berlaku", "Status"
      ]],
      body: exportData.map(d => Object.values(d)),
      foot: [[`Total: ${dataToExport.length} data`, "", "", "", "", "", "", "", "", "", "", "", ""]],
      styles: { fontSize: 7 },
      headStyles: { fillColor: [33, 150, 243] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
      startY: 20
    });
    
    const fileName = filterStartDate || filterEndDate
      ? `data-tera-spbu-${filterStartDate || 'awal'}-${filterEndDate || 'akhir'}.pdf`
      : "data-tera-spbu.pdf";
    
    doc.save(fileName);
    toast.success(`PDF berhasil diexport (${dataToExport.length} data)`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-blue-600" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Data Wajib Tera - SPBU
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola data wajib tera untuk SPBU
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={showDateFilter} onOpenChange={setShowDateFilter}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
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
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? "Edit Data SPBU" : "Tambah Data SPBU"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="namaSpbu">Nama SPBU</Label>
                      <Input
                        id="namaSpbu"
                        value={formData.namaSpbu}
                        onChange={(e) => handleInputChange("namaSpbu", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nomorIzin">Nomor Izin</Label>
                      <Input
                        id="nomorIzin"
                        value={formData.nomorIzin}
                        onChange={(e) => handleInputChange("nomorIzin", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="alamat">Alamat</Label>
                    <Input
                      id="alamat"
                      value={formData.alamat}
                      onChange={(e) => handleInputChange("alamat", e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="jenisAlat">Jenis Alat</Label>
                      <Input
                        id="jenisAlat"
                        value={formData.jenisAlat}
                        onChange={(e) => handleInputChange("jenisAlat", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="merkAlat">Merk Alat</Label>
                      <Input
                        id="merkAlat"
                        value={formData.merkAlat}
                        onChange={(e) => handleInputChange("merkAlat", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="nomorSeri">Nomor Seri</Label>
                      <Input
                        id="nomorSeri"
                        value={formData.nomorSeri}
                        onChange={(e) => handleInputChange("nomorSeri", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="kapasitas">Kapasitas</Label>
                      <Input
                        id="kapasitas"
                        value={formData.kapasitas}
                        onChange={(e) => handleInputChange("kapasitas", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lajuAlirMin">Laju Alir Min</Label>
                      <Input
                        id="lajuAlirMin"
                        value={formData.lajuAlirMin}
                        onChange={(e) => handleInputChange("lajuAlirMin", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lajuAlirMax">Laju Alir Max</Label>
                      <Input
                        id="lajuAlirMax"
                        value={formData.lajuAlirMax}
                        onChange={(e) => handleInputChange("lajuAlirMax", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="tanggalTera">Tanggal Tera</Label>
                      <Input
                        id="tanggalTera"
                        type="date"
                        value={formData.tanggalTera}
                        onChange={(e) => handleInputChange("tanggalTera", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="tanggalBerlaku">Tanggal Berlaku</Label>
                      <Input
                        id="tanggalBerlaku"
                        type="date"
                        value={formData.tanggalBerlaku}
                        onChange={(e) => handleInputChange("tanggalBerlaku", e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(v) => handleInputChange("status", v)}
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
              <CardTitle>Daftar Data Tera SPBU</CardTitle>
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
                    <TableHead>Nama SPBU</TableHead>
                    <TableHead>Alamat</TableHead>
                    <TableHead>Jenis Alat</TableHead>
                    <TableHead>Tanggal Tera</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.namaSpbu}</TableCell>
                      <TableCell>{item.alamat}</TableCell>
                      <TableCell>{item.jenisAlat}</TableCell>
                      <TableCell>{new Date(item.tanggalTera).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          item.status === 'Aktif' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
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
              <DialogTitle>Detail Data SPBU</DialogTitle>
            </DialogHeader>
            {viewingItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Nama SPBU</Label>
                    <p>{viewingItem.namaSpbu}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Nomor Izin</Label>
                    <p>{viewingItem.nomorIzin}</p>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Alamat</Label>
                  <p>{viewingItem.alamat}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Jenis Alat</Label>
                    <p>{viewingItem.jenisAlat}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Merk Alat</Label>
                    <p>{viewingItem.merkAlat}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Nomor Seri</Label>
                    <p>{viewingItem.nomorSeri}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Kapasitas</Label>
                    <p>{viewingItem.kapasitas}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Laju Alir Min</Label>
                    <p>{viewingItem.lajuAlirMin}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Laju Alir Max</Label>
                    <p>{viewingItem.lajuAlirMax}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Tanggal Tera</Label>
                    <p>{new Date(viewingItem.tanggalTera).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Tanggal Berlaku</Label>
                    <p>{new Date(viewingItem.tanggalBerlaku).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <p>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      viewingItem.status === 'Aktif' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
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

export default DataWajibTeraSPBU;