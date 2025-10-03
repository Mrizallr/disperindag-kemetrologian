import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Plus, Edit, Trash2, Eye, Search, RefreshCw, Download, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TeraUlangData {
  id: string;
  nama_pemilik: string;
  kecamatan: string;
  tanggal_pengajuan: string;
  status: string;
  nomor_hp: string;
  alamat: string;
  total_uttp: number;
  status_pemohon: string;
  butuh_skhp: string;
}

export default function DataPerpanjang() {
  const [data, setData] = useState<TeraUlangData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewingItem, setViewingItem] = useState<TeraUlangData | null>(null);
  const [statusItem, setStatusItem] = useState<TeraUlangData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: teraData, error } = await supabase
        .from('tera_ulang')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData = (teraData || []).map(item => ({
        id: item.id.toString(),
        nama_pemilik: item.nama_pemilik,
        kecamatan: item.kecamatan,
        tanggal_pengajuan: item.tanggal_pengajuan,
        status: item.status,
        nomor_hp: item.nomor_hp || '-',
        alamat: item.alamat || '-',
        status_pemohon: item.status_pemohon || '-',
        butuh_skhp: item.butuh_skhp || '-',
        total_uttp: (item.timbangan_elektronik || 0) + (item.timbangan_sentisimal || 0) + 
                   (item.timbangan_bobot || 0) + (item.timbangan_dacin || 0) + 
                   (item.timbangan_pegas || 0) + (item.timbangan_meja || 0) + 
                   (item.timbangan_cepat || 0) + (item.neraca || 0) + (item.anak_timbangan || 0)
      }));

      setData(transformedData);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = 
      item.nama_pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kecamatan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const { error } = await supabase
          .from('tera_ulang')
          .delete()
          .eq('id', parseInt(id));

        if (error) throw error;
        toast.success('Data berhasil dihapus');
        fetchData();
      } catch (error: any) {
        console.error('Error deleting data:', error);
        toast.error('Gagal menghapus data: ' + error.message);
      }
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!statusItem) return;
    
    try {
      const { error } = await supabase
        .from('tera_ulang')
        .update({ status: newStatus })
        .eq('id', parseInt(statusItem.id));

      if (error) throw error;
      toast.success('Status berhasil diubah');
      setStatusItem(null);
      fetchData();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Gagal mengubah status: ' + error.message);
    }
  };

  const handleExport = () => {
    const exportData = filteredData.map((item, index) => ({
      No: index + 1,
      NamaPemilik: item.nama_pemilik,
      Kecamatan: item.kecamatan,
      TanggalPengajuan: new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID'),
      TotalUTTP: item.total_uttp,
      Status: item.status
    }));

    const doc = new jsPDF();
    doc.text('Data Tera Ulang UTTP', 14, 15);
    autoTable(doc, {
      head: [['No', 'Nama Pemilik', 'Kecamatan', 'Tanggal Pengajuan', 'Total UTTP', 'Status']],
      body: exportData.map(d => Object.values(d)),
      foot: [[`Total: ${filteredData.length} data`, '', '', '', '', '']],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [33, 150, 243] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      startY: 20
    });
    doc.save('data-tera-ulang.pdf');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu': return 'bg-yellow-100 text-yellow-800';
      case 'Diproses': return 'bg-blue-100 text-blue-800';
      case 'Disetujui': return 'bg-green-100 text-green-800';
      case 'Ditolak': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-8 h-8 text-blue-600" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Data Tera Ulang UTTP
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola data permohonan tera ulang UTTP
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => navigate('/admin/form-tera-ulang')}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tera Ulang
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Daftar Permohonan Tera Ulang</CardTitle>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Menampilkan {filteredData.length} dari {data.length} data
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari nama pemilik atau kecamatan..."
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
                    <SelectItem value="Menunggu">Menunggu</SelectItem>
                    <SelectItem value="Diproses">Diproses</SelectItem>
                    <SelectItem value="Disetujui">Disetujui</SelectItem>
                    <SelectItem value="Ditolak">Ditolak</SelectItem>
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
                    <TableHead>Nama Pemilik</TableHead>
                    <TableHead>Kecamatan</TableHead>
                    <TableHead>Tanggal Pengajuan</TableHead>
                    <TableHead>Total UTTP</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nama_pemilik}</TableCell>
                      <TableCell>{item.kecamatan}</TableCell>
                      <TableCell>{new Date(item.tanggal_pengajuan).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>{item.total_uttp}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
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
                            onClick={() => setStatusItem(item)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate('/admin/form-tera-ulang', { state: { editData: item } })}
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
              <DialogTitle>Detail Permohonan Tera Ulang</DialogTitle>
            </DialogHeader>
            {viewingItem && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Nama Pemilik</Label>
                    <p>{viewingItem.nama_pemilik}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Status Pemohon</Label>
                    <p>{viewingItem.status_pemohon}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Kecamatan</Label>
                    <p>{viewingItem.kecamatan}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Nomor HP</Label>
                    <p>{viewingItem.nomor_hp}</p>
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Alamat</Label>
                  <p>{viewingItem.alamat}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Tanggal Pengajuan</Label>
                    <p>{new Date(viewingItem.tanggal_pengajuan).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Butuh SKHP</Label>
                    <p>{viewingItem.butuh_skhp}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-semibold">Total UTTP</Label>
                    <p>{viewingItem.total_uttp} alat</p>
                  </div>
                  <div>
                    <Label className="font-semibold">Status</Label>
                    <p>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(viewingItem.status)}`}>
                        {viewingItem.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Status Change Dialog */}
        <Dialog open={!!statusItem} onOpenChange={() => setStatusItem(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ubah Status Permohonan</DialogTitle>
            </DialogHeader>
            {statusItem && (
              <div className="space-y-4">
                <div>
                  <Label className="font-semibold">Nama Pemilik:</Label>
                  <p>{statusItem.nama_pemilik}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status Saat Ini:</Label>
                  <p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(statusItem.status)}`}>
                      {statusItem.status}
                    </span>
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Pilih Status Baru:</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      onClick={() => handleStatusChange('Menunggu')}
                      variant="outline"
                      className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                    >
                      Menunggu
                    </Button>
                    <Button
                      onClick={() => handleStatusChange('Diproses')}
                      variant="outline"
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      Diproses
                    </Button>
                    <Button
                      onClick={() => handleStatusChange('Disetujui')}
                      variant="outline"
                      className="text-green-600 border-green-300 hover:bg-green-50"
                    >
                      Disetujui
                    </Button>
                    <Button
                      onClick={() => handleStatusChange('Ditolak')}
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Ditolak
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}