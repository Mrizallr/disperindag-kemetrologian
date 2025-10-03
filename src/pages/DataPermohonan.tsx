import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Eye, RefreshCw, Download, ExternalLink, Edit, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "../lib/supabase";

interface PengajuanTera {
  id: number;
  nama_perusahaan: string;
  alamat_perusahaan?: string;
  alamat_uttp: string;
  kecamatan?: string;
  no_contact?: string;
  jenis_uttp: string;
  nomor_spbu?: string;
  jumlah_pompa?: number;
  jumlah_nozzle?: number;
  nomor_surat?: string;
  tanggal_surat?: string;
  file_surat_url?: string;
  status: string;
  created_at: string;
}

const DataPermohonan: React.FC = () => {
  const [permohonan, setPermohonan] = useState<PengajuanTera[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPermohonan, setSelectedPermohonan] = useState<PengajuanTera | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadPermohonan();
  }, []);

  const loadPermohonan = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pengajuan_tera")
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

  const updateStatus = async () => {
    if (!selectedPermohonan || !newStatus) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from("pengajuan_tera")
        .update({ status: newStatus })
        .eq("id", selectedPermohonan.id);

      if (error) throw error;

      toast.success(`Status berhasil diubah ke ${newStatus}`);
      setShowUpdateDialog(false);
      setNewStatus("");
      loadPermohonan();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal mengubah status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Menunggu</Badge>;
      case "Processing":
        return <Badge variant="outline"><RefreshCw className="w-3 h-3 mr-1" />Diproses</Badge>;
      case "Approved":
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Disetujui</Badge>;
      case "Rejected":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Ditolak</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFileUrl = (filePath: string) => {
    if (!filePath) return null;
    try {
      const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting file URL:', error);
      return null;
    }
  };

  const filteredPermohonan = permohonan.filter((item) =>
    item.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.jenis_uttp?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kecamatan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Data Permohonan Tera
            </h1>
            <p className="text-gray-600 mt-1">Kelola permohonan tera dari masyarakat</p>
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {permohonan.filter(p => p.status === 'Pending').length}
                  </div>
                  <p className="text-sm text-gray-600">Menunggu</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {permohonan.filter(p => p.status === 'Processing').length}
                  </div>
                  <p className="text-sm text-gray-600">Diproses</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {permohonan.filter(p => p.status === 'Approved').length}
                  </div>
                  <p className="text-sm text-gray-600">Disetujui</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {permohonan.filter(p => p.status === 'Rejected').length}
                  </div>
                  <p className="text-sm text-gray-600">Ditolak</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Permohonan ({filteredPermohonan.length})</CardTitle>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari nama perusahaan atau jenis UTTP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredPermohonan.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Tidak ada data permohonan</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Perusahaan</TableHead>
                    <TableHead>Jenis UTTP</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPermohonan.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.nama_perusahaan}</div>
                          <div className="text-sm text-gray-500">{item.no_contact || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.jenis_uttp}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.kecamatan || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{item.nomor_spbu || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell>
                        {getStatusBadge(item.status)}
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
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              setSelectedPermohonan(item);
                              setNewStatus(item.status);
                              setShowUpdateDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Status
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

        {/* Detail Dialog */}
        <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Permohonan</DialogTitle>
            </DialogHeader>
            {selectedPermohonan && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Data Perusahaan</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Nama:</strong> {selectedPermohonan.nama_perusahaan}</p>
                      <p><strong>Contact:</strong> {selectedPermohonan.no_contact || 'N/A'}</p>
                      <p><strong>Alamat:</strong> {selectedPermohonan.alamat_perusahaan || 'N/A'}</p>
                      <p><strong>Alamat UTTP:</strong> {selectedPermohonan.alamat_uttp}</p>
                      <p><strong>Kecamatan:</strong> {selectedPermohonan.kecamatan || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Data UTTP</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Jenis:</strong> {selectedPermohonan.jenis_uttp}</p>
                      <p><strong>SPBU:</strong> {selectedPermohonan.nomor_spbu || 'N/A'}</p>
                      <p><strong>Pompa:</strong> {selectedPermohonan.jumlah_pompa || 0}</p>
                      <p><strong>Nozzle:</strong> {selectedPermohonan.jumlah_nozzle || 0}</p>
                      <p><strong>Status:</strong> {selectedPermohonan.status}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Dokumen</h4>
                  <div className="text-sm">
                    <p><strong>Nomor Surat:</strong> {selectedPermohonan.nomor_surat || 'N/A'}</p>
                    <p><strong>Tanggal Surat:</strong> {selectedPermohonan.tanggal_surat ? formatDate(selectedPermohonan.tanggal_surat) : 'N/A'}</p>
                    {selectedPermohonan.file_surat_url && (
                      <div>
                        <p className="mb-2"><strong>File Surat:</strong></p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = selectedPermohonan.file_surat_url ? getFileUrl(selectedPermohonan.file_surat_url) : null;
                              if (url) {
                                window.open(url, '_blank');
                              } else {
                                toast.error('File tidak dapat diakses');
                              }
                            }}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Lihat File
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = selectedPermohonan.file_surat_url ? getFileUrl(selectedPermohonan.file_surat_url) : null;
                              if (url) {
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = `surat_${selectedPermohonan.nama_perusahaan}.pdf`;
                                link.click();
                              } else {
                                toast.error('File tidak dapat didownload');
                              }
                            }}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Update Status Dialog */}
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Status Permohonan</DialogTitle>
            </DialogHeader>
            {selectedPermohonan && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Permohonan dari: <strong>{selectedPermohonan.nama_perusahaan}</strong>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status Baru</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Menunggu</SelectItem>
                      <SelectItem value="Processing">Diproses</SelectItem>
                      <SelectItem value="Approved">Disetujui</SelectItem>
                      <SelectItem value="Rejected">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                Batal
              </Button>
              <Button onClick={updateStatus} disabled={updating || !newStatus}>
                {updating ? "Mengupdate..." : "Update Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default DataPermohonan;