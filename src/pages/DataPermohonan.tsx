import React, { useState, useEffect, useMemo } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

interface Permohonan {
  id: number;
  nama_pemohon: string;
  email: string;
  telepon: string;
  alamat: string;
  jenis_permohonan: string;
  jenis_alat: string;
  merek_alat: string;
  kapasitas: string;
  tahun_pembuatan: string;
  status: string;
  tanggal_permohonan: string;
  tanggal_diproses: string | null;
  catatan_admin: string | null;
  dokumen_pendukung: string | null;
  created_at: string;
}

const DataPermohonan: React.FC = () => {
  const [permohonan, setPermohonan] = useState<Permohonan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterJenis, setFilterJenis] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPermohonan, setSelectedPermohonan] = useState<Permohonan | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<string>("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    loadPermohonan();
  }, []);

  const loadPermohonan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("permohonan")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPermohonan(data || []);
    } catch (error) {
      console.error("Error loading applications:", error);
      toast.error("Gagal memuat data permohonan");
    } finally {
      setLoading(false);
    }
  };

  const processApplication = async () => {
    if (!selectedPermohonan || !processStatus) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("permohonan")
        .update({
          status: processStatus,
          tanggal_diproses: new Date().toISOString(),
          catatan_admin: adminNotes,
        })
        .eq("id", selectedPermohonan.id);

      if (error) throw error;

      toast.success("Permohonan berhasil diproses");
      setShowProcessDialog(false);
      setProcessStatus("");
      setAdminNotes("");
      loadPermohonan();
    } catch (error) {
      console.error("Error processing application:", error);
      toast.error("Gagal memproses permohonan");
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>;
      case "approved":
        return <Badge variant="default">Disetujui</Badge>;
      case "rejected":
        return <Badge variant="destructive">Ditolak</Badge>;
      case "processing":
        return <Badge variant="outline">Diproses</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-orange-500" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "processing":
        return <RefreshCw className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  // Filter and search logic
  const filteredPermohonan = useMemo(() => {
    return permohonan.filter((item) => {
      const matchesSearch =
        item.nama_pemohon.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.jenis_alat.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.merek_alat.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === "all" || item.status === filterStatus;
      const matchesJenis = filterJenis === "all" || item.jenis_permohonan === filterJenis;

      return matchesSearch && matchesStatus && matchesJenis;
    });
  }, [permohonan, searchTerm, filterStatus, filterJenis]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPermohonan.length / itemsPerPage);
  const paginatedPermohonan = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPermohonan.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPermohonan, currentPage, itemsPerPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const stats = {
    total: permohonan.length,
    pending: permohonan.filter((p) => p.status === "pending").length,
    approved: permohonan.filter((p) => p.status === "approved").length,
    rejected: permohonan.filter((p) => p.status === "rejected").length,
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Data Permohonan
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola permohonan tera dan tera ulang dari masyarakat
            </p>
          </div>
          <Button onClick={loadPermohonan} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Permohonan</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <p className="text-sm text-gray-600">Menunggu</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <p className="text-sm text-gray-600">Disetujui</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <p className="text-sm text-gray-600">Ditolak</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter Controls */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari nama pemohon, email, atau jenis alat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="processing">Diproses</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterJenis} onValueChange={setFilterJenis}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Jenis Permohonan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="tera_baru">Tera Baru</SelectItem>
                    <SelectItem value="tera_ulang">Tera Ulang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Daftar Permohonan</span>
              <Badge variant="outline">
                {filteredPermohonan.length} dari {permohonan.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPermohonan.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || filterStatus !== "all" || filterJenis !== "all"
                    ? "Tidak ada hasil"
                    : "Tidak ada permohonan"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || filterStatus !== "all" || filterJenis !== "all"
                    ? "Coba ubah filter atau kata kunci pencarian"
                    : "Permohonan baru akan muncul di sini"}
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pemohon</TableHead>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Alat</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedPermohonan.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.nama_pemohon}</div>
                              <div className="text-sm text-gray-500">{item.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {item.jenis_permohonan === "tera_baru" ? "Tera Baru" : "Tera Ulang"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.jenis_alat}</div>
                              <div className="text-sm text-gray-500">{item.merek_alat}</div>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(item.tanggal_permohonan)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(item.status)}
                              {getStatusBadge(item.status)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedPermohonan(item);
                                  setShowDetailDialog(true);
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Detail
                              </Button>
                              {item.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPermohonan(item);
                                    setShowProcessDialog(true);
                                  }}
                                >
                                  Proses
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t">
                    <div className="text-sm text-gray-600">
                      Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredPermohonan.length)} dari {filteredPermohonan.length} permohonan
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Sebelumnya
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        Selanjutnya
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detail Permohonan</DialogTitle>
            </DialogHeader>
            {selectedPermohonan && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Data Pemohon
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Nama:</strong> {selectedPermohonan.nama_pemohon}</p>
                        <p><strong>Email:</strong> {selectedPermohonan.email}</p>
                        <p><strong>Telepon:</strong> {selectedPermohonan.telepon}</p>
                        <p><strong>Alamat:</strong> {selectedPermohonan.alamat}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Data Alat
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Jenis Alat:</strong> {selectedPermohonan.jenis_alat}</p>
                        <p><strong>Merek:</strong> {selectedPermohonan.merek_alat}</p>
                        <p><strong>Kapasitas:</strong> {selectedPermohonan.kapasitas}</p>
                        <p><strong>Tahun Pembuatan:</strong> {selectedPermohonan.tahun_pembuatan}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Status & Tanggal
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Status:</strong> {getStatusBadge(selectedPermohonan.status)}</p>
                      <p><strong>Tanggal Permohonan:</strong> {formatDate(selectedPermohonan.tanggal_permohonan)}</p>
                    </div>
                    <div>
                      {selectedPermohonan.tanggal_diproses && (
                        <p><strong>Tanggal Diproses:</strong> {formatDate(selectedPermohonan.tanggal_diproses)}</p>
                      )}
                      {selectedPermohonan.catatan_admin && (
                        <p><strong>Catatan Admin:</strong> {selectedPermohonan.catatan_admin}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Process Dialog */}
        <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Proses Permohonan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status</label>
                <Select value={processStatus} onValueChange={setProcessStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Diproses</SelectItem>
                    <SelectItem value="approved">Disetujui</SelectItem>
                    <SelectItem value="rejected">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Catatan Admin</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Tambahkan catatan atau alasan..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowProcessDialog(false)}>
                Batal
              </Button>
              <Button onClick={processApplication} disabled={processing || !processStatus}>
                {processing ? "Memproses..." : "Proses"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default DataPermohonan;