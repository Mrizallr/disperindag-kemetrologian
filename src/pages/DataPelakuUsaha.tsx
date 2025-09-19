import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Download,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DataPelakuUsaha: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenisLapak, setFilterJenisLapak] = useState("semua");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching data...');
      
      const { data: supaData, error } = await supabase
        .from("pelaku_usaha")
        .select(`
          *,
          uttp(
            id,
            jenis,
            merk,
            kondisi,
            tahun_tera
          )
        `)
        .order("created_at", { ascending: false });

      console.log('Data:', supaData);
      console.log('Error:', error);

      if (error) {
        console.error("Gagal mengambil data dari Supabase:", error.message);
        toast.error("Gagal mengambil data dari server: " + error.message);
      } else {
        setData(supaData || []);
        console.log('Data berhasil diambil:', supaData?.length, 'records');
      }
    };

    fetchData();
  }, [location]);

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.nama_pemilik?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesJenis =
      filterJenisLapak === "semua" || item.jenis_lapak === filterJenisLapak;
    const matchesStatus =
      filterStatus === "semua" || item.status_tera === filterStatus;

    return matchesSearch && matchesJenis && matchesStatus;
  });

  const handleDelete = async (id: number) => {
    if (confirm("Apakah yakin ingin menghapus? Data UTTP terkait juga akan dihapus.")) {
      try {
        // Hapus UTTP terkait dulu
        const { error: uttpError } = await supabase
          .from("uttp")
          .delete()
          .eq("pelaku_usaha_id", id);

        if (uttpError) throw uttpError;

        // Baru hapus pelaku usaha
        const { error: pelakuError } = await supabase
          .from("pelaku_usaha")
          .delete()
          .eq("id", id);
        
        if (pelakuError) throw pelakuError;

        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        toast.success("Data berhasil dihapus");
      } catch (error: any) {
        console.error("Gagal menghapus data:", error);
        toast.error("Gagal menghapus data: " + error.message);
      }
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Aktif":
        return "default";
      case "Perlu Tera Ulang":
        return "secondary";
      case "Tidak Aktif":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-100 text-green-800 border-green-200";
      case "Perlu Tera Ulang":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Tidak Aktif":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleExport = () => {
    const exportData = filteredData.map((item, index) => ({
      No: index + 1,
      Nama: item.nama_pemilik,
      Lapak: item.jenis_lapak,
      Lokasi: item.lokasi,
      Dagangan: item.jenis_dagangan,
      UTTP: item.uttp?.length || 0,
      Status: item.status_tera,
      Tahun: item.tanggal_tera_terakhir
        ? new Date(item.tanggal_tera_terakhir).getFullYear()
        : "-",  
    }));

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text("LAPORAN DATA PELAKU USAHA", 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text("Dinas Perindustrian dan Perdagangan", 105, 28, { align: 'center' });
    
    // Info
    doc.setFontSize(10);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 14, 40);
    doc.text(`Total Data: ${filteredData.length} pelaku usaha`, 14, 46);
    
    // Garis pemisah
    doc.line(14, 50, 196, 50);
    
    autoTable(doc, {
      head: [
        ["No", "Nama Pemilik", "Jenis Lapak", "Lokasi", "Jenis Dagangan", "UTTP", "Status Tera", "Tahun"],
      ],
      body: exportData.map((d) => Object.values(d)),
      startY: 55,
      styles: { 
        fontSize: 9,
        cellPadding: 3,
        halign: 'center'
      },
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 }, // No
        1: { halign: 'left', cellWidth: 35 },   // Nama
        2: { halign: 'center', cellWidth: 20 }, // Lapak
        3: { halign: 'left', cellWidth: 30 },   // Lokasi
        4: { halign: 'left', cellWidth: 30 },   // Dagangan
        5: { halign: 'center', cellWidth: 15 }, // UTTP
        6: { halign: 'center', cellWidth: 25 }, // Status
        7: { halign: 'center', cellWidth: 15 }  // Tahun
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Halaman ${i} dari ${pageCount}`, 105, 285, { align: 'center' });
    }
    
    doc.save(`Data-Pelaku-Usaha-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Data Pelaku Usaha</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola data pelaku usaha dan UTTP mereka
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export ke PDF
            </Button>
            <Button asChild>
              <Link to="/admin/tambah-data">
                <Plus className="w-4 h-4 mr-2" />
                Tambah
              </Link>
            </Button>
          </div>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 items-center">
              <Filter className="w-4 h-4" />
              Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Cari nama atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select
                value={filterJenisLapak}
                onValueChange={setFilterJenisLapak}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Jenis Lapak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua</SelectItem>
                  <SelectItem value="Kios">Kios</SelectItem>
                  <SelectItem value="Los">Los</SelectItem>
                  <SelectItem value="PKL">PKL</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status Tera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Perlu Tera Ulang">
                    Perlu Tera Ulang
                  </SelectItem>
                  <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterJenisLapak("semua");
                  setFilterStatus("semua");
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabel */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Pelaku Usaha</CardTitle>
            <CardDescription>
              {filteredData.length} data ditampilkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Lapak</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Dagangan</TableHead>
                  <TableHead>UTTP</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.nama_pemilik}</TableCell>
                    <TableCell>{item.jenis_lapak}</TableCell>
                    <TableCell>{item.lokasi}</TableCell>
                    <TableCell>{item.jenis_dagangan}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.uttp?.length || 0} unit
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(item.status_tera)}>
                        {item.status_tera}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.tanggal_tera_terakhir
                        ? new Date(item.tanggal_tera_terakhir).getFullYear()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 bg-white hover:bg-gray-50"
                          onClick={() =>
                            navigate(`/admin/view-data/${item.id}`)
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-700 bg-white hover:bg-gray-50"
                          asChild
                        >
                          <Link to={`/admin/edit-data/${item.id}`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-white hover:bg-gray-50"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredData.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                Tidak ada data ditemukan
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DataPelakuUsaha;
