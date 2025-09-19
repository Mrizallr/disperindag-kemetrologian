import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Eye,
  FileText,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { supabase, type Artikel } from "../lib/supabase";

const ArtikelPage: React.FC = () => {
  const [artikel, setArtikel] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Inisialisasi status filter dengan 'all' untuk menghindari masalah nilai string kosong
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadArtikel();
  }, []);

  const loadArtikel = async () => {
    setLoading(true); // Pastikan loading true saat memulai pemuatan
    try {
      const { data, error } = await supabase
        .from("artikel")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArtikel(data || []);
      toast.success("Artikel berhasil dimuat"); // Tambahkan toast sukses
    } catch (error: any) {
      // Tipe error untuk penanganan yang lebih baik
      console.error("Gagal memuat artikel:", error.message);
      toast.error(`Gagal memuat artikel: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteArtikel = async (id: number) => {
    // PENTING: Dalam aplikasi nyata, ganti ini dengan modal konfirmasi kustom.
    // window.confirm tidak diizinkan di lingkungan ini.
    console.log(`Mencoba menghapus artikel dengan ID: ${id}`); // Log untuk debugging
    toast.info("Menghapus artikel..."); // Tampilkan toast info segera

    try {
      const { error } = await supabase.from("artikel").delete().eq("id", id);

      if (error) throw error;

      setArtikel((prev) => prev.filter((item) => item.id !== id));
      toast.success("Artikel berhasil dihapus");
    } catch (error: any) {
      console.error("Gagal menghapus artikel:", error.message);
      toast.error(`Gagal menghapus artikel: ${error.message}`);
    }
  };

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";

    try {
      const { error } = await supabase
        .from("artikel")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      setArtikel((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, status: newStatus as "draft" | "published" }
            : item
        )
      );
      toast.success(
        `Artikel berhasil ${
          newStatus === "published" ? "dipublikasi" : "dijadikan draft"
        }`
      );
    } catch (error: any) {
      console.error("Gagal memperbarui status artikel:", error.message);
      toast.error(`Gagal mengubah status artikel: ${error.message}`);
    }
  };

  // Filter data berdasarkan pencarian dan filter
  const filteredData = artikel.filter((item) => {
    const matchesSearch =
      item.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    // Periksa filter status 'all'
    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string) => {
    return status === "published" ? "default" : "secondary";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-4" />
          <p>Memuat artikel...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 p-4 md:p-8">
        {/* Header Halaman */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Kelola Artikel
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Kelola artikel yang akan ditampilkan di landing page
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={loadArtikel} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Segarkan
            </Button>
            <Button asChild>
              <Link to="/admin/tambah-artikel">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Artikel
              </Link>
            </Button>
          </div>
        </div>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {artikel.length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Artikel
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {artikel.filter((item) => item.status === "published").length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dipublikasi
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {artikel.filter((item) => item.status === "draft").length}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Draf</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative col-span-1 md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari judul atau penulis..." // placeholder text
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {/* Mengubah nilai dari "" menjadi "all" */}
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="published">Dipublikasi</SelectItem>
                  <SelectItem value="draft">Draf</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all"); // Mengubah menjadi 'all' untuk konsistensi
                }}
              >
                Reset Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabel Data */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Daftar Artikel</CardTitle>
            <CardDescription>
              Menampilkan {filteredData.length} dari {artikel.length} artikel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Judul</TableHead>
                    <TableHead>Penulis</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.judul}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {item.excerpt.substring(0, 100)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.author}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {item.status === "published" ? "Dipublikasi" : "Draf"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleStatus(item.id, item.status)}
                            title={
                              item.status === "published"
                                ? "Jadikan Draf"
                                : "Publikasikan"
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            title="Edit Artikel"
                          >
                            <Link to={`/admin/edit-artikel/${item.id}`}>
                              <Edit className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteArtikel(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {artikel.length === 0
                    ? "Belum ada artikel"
                    : "Tidak ada artikel yang sesuai dengan filter"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ArtikelPage;
