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
import { toast } from "sonner";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DataPengawasanBBM: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching pengawasan BBM data...');
      
      const { data: supaData, error } = await supabase
        .from("pengawasan_bbm")
        .select("*")
        .order("created_at", { ascending: false });

      console.log('Data:', supaData);
      console.log('Error:', error);

      if (error) {
        console.error("Gagal mengambil data dari Supabase:", error.message);
        toast.error("Gagal mengambil data dari server: " + error.message);
      } else {
        // Transform data untuk kompatibilitas dengan UI
        const transformedData = (supaData || []).map(item => ({
          id: item.id,
          pemilik: item.pemilik,
          nomorSpbu: item.nomor_spbu,
          alamat: item.alamat,
          merek: item.merek,
          status: item.status,
          tanggalPengawasan: item.tanggal_pengawasan,
          petugas: item.petugas
        }));
        setData(transformedData);
        console.log('Data berhasil diambil:', transformedData.length, 'records');
      }
    };

    fetchData();
  }, [location]);

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.pemilik?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nomorSpbu?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alamat?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "semua" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: number) => {
    if (confirm("Apakah yakin ingin menghapus?")) {
      try {
        const { error } = await supabase
          .from("pengawasan_bbm")
          .delete()
          .eq("id", id);
        
        if (error) throw error;

        const updatedData = data.filter((item) => item.id !== id);
        setData(updatedData);
        toast.success("Data berhasil dihapus");
      } catch (error: any) {
        console.error("Gagal menghapus data:", error);
        toast.error("Gagal menghapus data: " + error.message);
      }
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Sesuai":
        return "bg-green-100 text-green-800 border-green-200";
      case "Tidak Sesuai":
        return "bg-red-100 text-red-800 border-red-200";
      case "Dalam Proses":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleExport = () => {
    const exportData = filteredData.map((item) => ({
      Pemilik: item.pemilik,
      "No. SPBU": item.nomorSpbu,
      Alamat: item.alamat,
      Merek: item.merek,
      Status: item.status,
      Tanggal: item.tanggalPengawasan,
      Petugas: item.petugas,
    }));

    const doc = new jsPDF();
    doc.text("Data Pengawasan Pompa Ukur BBM", 14, 15);
    autoTable(doc, {
      head: [
        ["Pemilik", "No. SPBU", "Alamat", "Merek", "Status", "Tanggal", "Petugas"],
      ],
      body: exportData.map((d) => Object.values(d)),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] },
      startY: 20,
    });
    doc.save("data-pengawasan-bbm.pdf");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Pengawasan Pompa Ukur BBM</h1>
            <p className="text-gray-600">
              Kelola data pengawasan pompa ukur BBM di SPBU
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export ke PDF
            </Button>
            <Button asChild>
              <Link to="/admin/tambah-pengawasan-bbm">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari pemilik, nomor SPBU, atau alamat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status Pengawasan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua</SelectItem>
                  <SelectItem value="Sesuai">Sesuai</SelectItem>
                  <SelectItem value="Tidak Sesuai">Tidak Sesuai</SelectItem>
                  <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
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
            <CardTitle>Daftar Pengawasan Pompa Ukur BBM</CardTitle>
            <CardDescription>
              {filteredData.length} data ditampilkan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pemilik</TableHead>
                  <TableHead>No. SPBU</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Merek</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Petugas</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.pemilik}</TableCell>
                    <TableCell>{item.nomorSpbu}</TableCell>
                    <TableCell>{item.alamat}</TableCell>
                    <TableCell>{item.merek}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(item.tanggalPengawasan).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell>{item.petugas}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 bg-white hover:bg-gray-50"
                          onClick={() =>
                            navigate(`/admin/view-pengawasan/${item.id}`)
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
                          <Link to={`/admin/edit-pengawasan/${item.id}`}>
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
              <p className="text-center text-gray-500 py-4">
                Tidak ada data ditemukan
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default DataPengawasanBBM;