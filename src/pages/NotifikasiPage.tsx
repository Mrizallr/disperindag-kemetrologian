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
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle,
  RefreshCw,
  Calendar,
  Search,
  Filter,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { supabase, type Notifikasi, type PelakuUsaha } from "../lib/supabase";

const NotifikasiPage: React.FC = () => {
  const [notifikasi, setNotifikasi] = useState<Notifikasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [extending, setExtending] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJenis, setFilterJenis] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadNotifikasi();
  }, []);

  const loadNotifikasi = async () => {
    try {
      console.log('Loading notifikasi...');
      
      const { data, error } = await supabase
        .from("notifikasi")
        .select("*")
        .order("created_at", { ascending: false });

      console.log('Notifikasi data:', data);
      console.log('Notifikasi error:', error);

      if (error) throw error;
      
      // Transform data untuk kompatibilitas dengan UI
      const transformedData = (data || []).map(item => ({
        ...item,
        pelaku_usaha: item.pelaku_usaha_id ? {
          nama_pemilik: `Pelaku Usaha ${item.pelaku_usaha_id}`,
          lokasi: 'Lokasi tidak diketahui'
        } : null
      }));
      
      setNotifikasi(transformedData);
      console.log('Notifikasi loaded:', transformedData.length, 'records');
    } catch (error) {
      console.error("Error loading notifications:", error);
      toast.error("Gagal memuat notifikasi");
    } finally {
      setLoading(false);
    }
  };



  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from("notifikasi")
        .update({ dibaca: true })
        .eq("id", id);

      if (error) throw error;

      setNotifikasi((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, dibaca: true } : notif
        )
      );
      toast.success("Notifikasi ditandai sebagai dibaca");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Gagal menandai notifikasi");
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifikasi")
        .update({ dibaca: true })
        .eq("dibaca", false);

      if (error) throw error;

      setNotifikasi((prev) =>
        prev.map((notif) => ({ ...notif, dibaca: true }))
      );
      toast.success("Semua notifikasi ditandai sebagai dibaca");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Gagal menandai semua notifikasi");
    }
  };

  const extendTera = async (pelakuUsahaId: number) => {
    setExtending(pelakuUsahaId);
    try {
      // Calculate new expiry date (1 year from now)
      const newExpiryDate = new Date();
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);

      const { error } = await supabase
        .from("pelaku_usaha")
        .update({
          tanggal_exp_tera: newExpiryDate.toISOString().split("T")[0],
          tanggal_tera_terakhir: new Date().toISOString().split("T")[0],
          status_tera: "Aktif",
        })
        .eq("id", pelakuUsahaId);

      if (error) throw error;

      // Mark related notifications as read
      await supabase
        .from("notifikasi")
        .update({ dibaca: true })
        .eq("pelaku_usaha_id", pelakuUsahaId);

      toast.success("Tera berhasil diperpanjang 1 tahun");
      loadNotifikasi();
    } catch (error) {
      console.error("Error extending tera:", error);
      toast.error("Gagal memperpanjang tera");
    } finally {
      setExtending(null);
    }
  };

  const getNotificationIcon = (jenis: string) => {
    switch (jenis) {
      case "permohonan_baru":
        return <Bell className="w-5 h-5 text-blue-600" />;
      case "tera_exp_warning":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case "tera_expired":
        return <Clock className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBadge = (jenis: string) => {
    switch (jenis) {
      case "permohonan_baru":
        return <Badge variant="default">Permohonan Baru</Badge>;
      case "tera_exp_warning":
        return <Badge variant="secondary">Peringatan</Badge>;
      case "tera_expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  // Filter and search logic
  const filteredNotifikasi = useMemo(() => {
    return notifikasi.filter((notif) => {
      const matchesSearch =
        notif.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.pesan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notif.pelaku_usaha?.nama_pemilik || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesJenis = filterJenis === "all" || notif.jenis === filterJenis;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "read" && notif.dibaca) ||
        (filterStatus === "unread" && !notif.dibaca);

      return matchesSearch && matchesJenis && matchesStatus;
    });
  }, [notifikasi, searchTerm, filterJenis, filterStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredNotifikasi.length / itemsPerPage);
  const paginatedNotifikasi = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNotifikasi.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNotifikasi, currentPage, itemsPerPage]);

  const unreadCount = notifikasi.filter((n) => !n.dibaca).length;

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
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
              <Bell className="w-8 h-8 text-blue-600" />
              Notifikasi
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount} baru
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola notifikasi sistem dan peringatan tera
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button onClick={markAllAsRead} variant="outline">
                <CheckCheck className="w-4 h-4 mr-2" />
                Tandai Semua Dibaca
              </Button>
            )}
            <Button onClick={loadNotifikasi} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {unreadCount}
              </div>
              <p className="text-sm text-gray-600">Notifikasi Belum Dibaca</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">
                {
                  notifikasi.filter((n) => n.jenis === "tera_exp_warning")
                    .length
                }
              </div>
              <p className="text-sm text-gray-600">Peringatan Tera</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {notifikasi.filter((n) => n.jenis === "tera_expired").length}
              </div>
              <p className="text-sm text-gray-600">Tera Expired</p>
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
                    placeholder="Cari notifikasi atau nama pelaku usaha..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={filterJenis} onValueChange={setFilterJenis}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="permohonan_baru">
                      Permohonan Baru
                    </SelectItem>
                    <SelectItem value="tera_exp_warning">Peringatan</SelectItem>
                    <SelectItem value="tera_expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="unread">Belum Dibaca</SelectItem>
                    <SelectItem value="read">Sudah Dibaca</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Daftar Notifikasi</span>
              <Badge variant="outline">
                {filteredNotifikasi.length} dari {notifikasi.length}
              </Badge>
            </CardTitle>
            <CardDescription>
              Semua notifikasi sistem dan peringatan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredNotifikasi.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm || filterJenis !== "all" || filterStatus !== "all"
                    ? "Tidak ada hasil"
                    : "Tidak ada notifikasi"}
                </h3>
                <p className="text-gray-500">
                  {searchTerm || filterJenis !== "all" || filterStatus !== "all"
                    ? "Coba ubah filter atau kata kunci pencarian"
                    : "Semua notifikasi akan muncul di sini"}
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedNotifikasi.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        notif.dibaca
                          ? "bg-gray-50 border-gray-200"
                          : "bg-blue-50 border-blue-200 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {getNotificationIcon(notif.jenis)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-gray-900">
                                {notif.judul}
                              </h4>
                              {getNotificationBadge(notif.jenis)}
                              {!notif.dibaca && (
                                <Badge variant="outline" className="text-xs">
                                  Baru
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2">{notif.pesan}</p>
                            {notif.pelaku_usaha && (
                              <p className="text-sm text-blue-600 font-medium mb-1">
                                👤 {notif.pelaku_usaha.nama_pemilik} •{" "}
                                {notif.pelaku_usaha.lokasi}
                              </p>
                            )}
                            <p className="text-xs text-gray-500">
                              📅 {formatDate(notif.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!notif.dibaca && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => markAsRead(notif.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Tandai Dibaca
                            </Button>
                          )}
                          {notif.pelaku_usaha_id &&
                            (notif.jenis === "tera_exp_warning" ||
                              notif.jenis === "tera_expired") && (
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() =>
                                  extendTera(notif.pelaku_usaha_id!)
                                }
                                disabled={extending === notif.pelaku_usaha_id}
                              >
                                {extending === notif.pelaku_usaha_id ? (
                                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <Calendar className="w-4 h-4 mr-1" />
                                )}
                                Perpanjang Tera
                              </Button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t">
                    <div className="text-sm text-gray-600">
                      Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{" "}
                      {Math.min(
                        currentPage * itemsPerPage,
                        filteredNotifikasi.length
                      )}{" "}
                      dari {filteredNotifikasi.length} notifikasi
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Sebelumnya
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: Math.min(5, totalPages) },
                          (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <Button
                                key={pageNum}
                                variant={
                                  currentPage === pageNum
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setCurrentPage(pageNum)}
                                className="w-8 h-8 p-0"
                              >
                                {pageNum}
                              </Button>
                            );
                          }
                        )}
                        {totalPages > 5 && (
                          <>
                            <span className="px-2 text-gray-500">...</span>
                            <Button
                              variant={
                                currentPage === totalPages
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(totalPages)}
                              className="w-8 h-8 p-0"
                            >
                              {totalPages}
                            </Button>
                          </>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
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
      </div>
    </AdminLayout>
  );
};

export default NotifikasiPage;
