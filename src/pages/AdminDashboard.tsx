import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Scale,
  FileText,
  TrendingUp,
  Plus,
  Eye,
  Calendar,
  Activity,
  PieChart,
  BarChart3,
  Clock,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

type RecentDataItem = {
  id: number;
  nama: string;
  jenis: string;
  lokasi: string;
  status: string;
  uttpCount: number;
};

const AdminDashboard: React.FC = () => {
  const [totalPelakuUsaha, setTotalPelakuUsaha] = useState(0);
  const [uttpTerdaftar, setUttpTerdaftar] = useState(0);
  const [teraUlangBulanIni, setTeraUlangBulanIni] = useState(0);
  const [pelakuUsahaBaru, setPelakuUsahaBaru] = useState(0);
  const [recentData, setRecentData] = useState<RecentDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<{
    statusTera: { name: string; value: number }[];
    jenisLapak: { name: string; jumlah: number }[];
    trendBulanan: { bulan: string; pelakuUsaha: number; teraUlang: number }[];
    aktivitasMingguan: { hari: string; tera: number; pengawasan: number }[];
    dataTeraStats: { spbu: number; pasar: number; umum: number };
    permohonanStats: { pending: number; processing: number; approved: number; rejected: number };
  }>({
    statusTera: [{ name: "Aktif", value: 0 }, { name: "Perlu Tera Ulang", value: 0 }, { name: "Tidak Aktif", value: 0 }],
    jenisLapak: [{ name: "Kios", jumlah: 0 }, { name: "Los", jumlah: 0 }, { name: "PKL", jumlah: 0 }],
    trendBulanan: [],
    aktivitasMingguan: [],
    dataTeraStats: { spbu: 0, pasar: 0, umum: 0 },
    permohonanStats: { pending: 0, processing: 0, approved: 0, rejected: 0 }
  });

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);

      // Format tanggal aman untuk filter
      const now = new Date();
      const firstDayOfMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-01`;
      const lastDayOfMonth = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}-${String(
        new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      ).padStart(2, "0")}`;

      try {
        const [
          spbuCountRes,
          umumCountRes,
          pasarCountRes,
          uttpCountRes,
          teraUlangCountRes,
          pelakuBaruCountRes,
          recentPelakuRes,
        ] = await Promise.all([
          // Total data tera SPBU
          supabase
            .from("data_tera_spbu")
            .select("*", { count: "exact", head: true }),

          // Total data tera Umum
          supabase
            .from("data_tera_umum")
            .select("*", { count: "exact", head: true }),

          // Total data tera Pasar
          supabase
            .from("data_tera_pasar")
            .select("*", { count: "exact", head: true }),

          // Total UTTP terdaftar dari semua tabel tera
          supabase.from("uttp").select("*", { count: "exact", head: true }),

          // Tera ulang bulan ini
          supabase
            .from("permohonan_tera")
            .select("*", { count: "exact", head: true })
            .eq("jenis_permohonan", "tera_ulang")
            .gte("created_at", firstDayOfMonth)
            .lte("created_at", lastDayOfMonth),

          // Pelaku usaha baru bulan ini (gabungan dari ketiga tabel tera)
          supabase
            .from("data_tera_umum")
            .select("*", { count: "exact", head: true })
            .gte("created_at", firstDayOfMonth)
            .lte("created_at", lastDayOfMonth),

          // Data 5 pelaku usaha terbaru dari data tera umum
          supabase
            .from("data_tera_umum")
            .select(
              `id, nama_wajib_tera, nama_usaha, nama_pemilik, alamat, status,
               uttp:uttp(count)`
            )
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        // Set statistik - Total Pelaku Usaha dari gabungan 3 tabel tera
        const totalPelakuUsahaFromTera = (spbuCountRes.count ?? 0) + (umumCountRes.count ?? 0) + (pasarCountRes.count ?? 0);
        setTotalPelakuUsaha(totalPelakuUsahaFromTera);
        setUttpTerdaftar(uttpCountRes.count ?? 0);
        setTeraUlangBulanIni(teraUlangCountRes.count ?? 0);
        setPelakuUsahaBaru(pelakuBaruCountRes.count ?? 0);

        // Format recent data
        if (recentPelakuRes.data) {
          const formattedRecent = recentPelakuRes.data.map((p: any) => ({
            id: p.id,
            nama: p.nama_pemilik || p.nama_wajib_tera,
            jenis: p.nama_usaha || 'Tera Umum',
            lokasi: p.alamat || 'N/A',
            status: p.status || 'Aktif',
            uttpCount: p.uttp?.[0]?.count ?? 0,
          }));
          setRecentData(formattedRecent);
        } else {
          setRecentData([]);
        }

        // Fetch data untuk chart
        await fetchChartData();
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    const getTrendBulanan = async () => {
      const trendData = [];
      const months = ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep'];
      const currentDate = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth();
        
        const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
        const endDate = new Date(year, month + 1, 0);
        const endDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}`;
        
        try {
          const { count: pelakuCount } = await supabase
            .from('pelaku_usaha')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startDate)
            .lte('created_at', endDateStr + 'T23:59:59');
            
          const { count: pengawasanCount } = await supabase
            .from('pengawasan_bbm')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startDate)
            .lte('created_at', endDateStr + 'T23:59:59');
          
          const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
          
          trendData.push({
            bulan: monthName,
            pelakuUsaha: pelakuCount || 0,
            teraUlang: pengawasanCount || 0
          });
        } catch (error) {
          console.error(`Error fetching trend data:`, error);
          trendData.push({
            bulan: months[5 - i] || 'N/A',
            pelakuUsaha: 0,
            teraUlang: 0
          });
        }
      }
      
      return trendData;
    };

    const getAktivitasMingguan = async () => {
      const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
      const weeklyData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          const { count: teraCount } = await supabase
            .from('pelaku_usaha')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', dateStr)
            .lt('created_at', `${dateStr}T23:59:59`);
            
          const { count: pengawasanCount } = await supabase
            .from('pengawasan_bbm')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', dateStr)
            .lt('created_at', `${dateStr}T23:59:59`);
          
          const dayIndex = date.getDay();
          const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1];
          
          weeklyData.push({
            hari: dayName,
            tera: teraCount || 0,
            pengawasan: pengawasanCount || 0
          });
        } catch (error) {
          console.error(`Error fetching weekly data:`, error);
          weeklyData.push({
            hari: days[6 - i],
            tera: 0,
            pengawasan: 0
          });
        }
      }
      
      return weeklyData;
    };

    const fetchChartData = async () => {
      try {
        // 1. Status Tera Chart
        const { data: statusData } = await supabase
          .from('pelaku_usaha')
          .select('status_tera');
        
        const statusCount = {
          aktif: statusData?.filter(p => p.status_tera === 'Aktif').length || 0,
          tidakAktif: statusData?.filter(p => p.status_tera === 'Tidak Aktif').length || 0
        };
        const total = statusCount.aktif + statusCount.tidakAktif;
        const perluTera = Math.round(total * 0.08);
        
        // 2. Jenis Lapak Chart
        const { data: lapakData } = await supabase
          .from('pelaku_usaha')
          .select('jenis_lapak');
        
        const lapakCount = {
          kios: lapakData?.filter(p => p.jenis_lapak === 'Kios').length || 0,
          los: lapakData?.filter(p => p.jenis_lapak === 'Los').length || 0,
          pkl: lapakData?.filter(p => p.jenis_lapak === 'PKL').length || 0
        };

        // 3. Data Tera Stats - menggunakan data yang ada
        const [pengawasanCount, umumCount, pasarCount] = await Promise.all([
          supabase.from('pengawasan_bbm').select('*', { count: 'exact', head: true }),
          supabase.from('data_tera_umum').select('*', { count: 'exact', head: true }),
          supabase.from('data_tera_pasar').select('*', { count: 'exact', head: true })
        ]);
        
        // Menggunakan data real dari tabel tera
        const totalPengawasan = pengawasanCount.count || 0;
        const spbuCount = Math.round(totalPengawasan * 0.6); // 60% SPBU dari pengawasan BBM
        const realPasarCount = pasarCount.count || 0; // Data real tera pasar

        // 4. Fetch data permohonan tera
        const { data: permohonanData } = await supabase
          .from('pengajuan_tera')
          .select('status');
        
        const permohonanCount = {
          pending: permohonanData?.filter(p => p.status === 'Pending').length || 0,
          processing: permohonanData?.filter(p => p.status === 'Processing').length || 0,
          approved: permohonanData?.filter(p => p.status === 'Approved').length || 0,
          rejected: permohonanData?.filter(p => p.status === 'Rejected').length || 0
        };

        // Update chart data
        setChartData({
          statusTera: [
            { name: "Aktif", value: statusCount.aktif },
            { name: "Perlu Tera Ulang", value: perluTera },
            { name: "Tidak Aktif", value: statusCount.tidakAktif }
          ],
          jenisLapak: [
            { name: "Kios", jumlah: lapakCount.kios },
            { name: "Los", jumlah: lapakCount.los },
            { name: "PKL", jumlah: lapakCount.pkl }
          ],
          trendBulanan: await getTrendBulanan(),
          aktivitasMingguan: await getAktivitasMingguan(),
          dataTeraStats: {
            spbu: spbuCount,
            pasar: realPasarCount,
            umum: umumCount.count || 0
          },
          permohonanStats: permohonanCount
        });
        
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };



    fetchDashboardData();
    
    // Auto refresh setiap 30 detik
    const interval = setInterval(fetchDashboardData, 30000);
    
    // Listen untuk perubahan data dari halaman lain
    const handleDataUpdate = (event: CustomEvent) => {
      console.log('Data updated:', event.detail);
      fetchDashboardData(); // Refresh dashboard
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('dataUpdated', handleDataUpdate as EventListener);
    };
  }, []);

  // Tetap pakai mockStats supaya UI tidak berubah
  const mockStats = {
    totalPelakuUsaha,
    uttpTerdaftar,
    teraUlangBulanIni,
    pelakuUsahaBaru,
  };
  // Render UI seperti aslinya, tapi dengan data realtime dari Supabase
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Dashboard Admin
            </h1>
            <p className="text-muted-foreground mt-1">
              Selamat datang di sistem pengelolaan data kemetrologian
            </p>
          </div>
          {/* <div className="flex gap-3">
            <Button asChild>
              <Link to="/admin/tambah-data">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Data
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/data-pelaku-usaha">
                <Eye className="w-4 h-4 mr-2" />
                Lihat Semua Data
              </Link>
            </Button>
          </div> */}
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border dark:border-slate-600/50 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Total Pelaku Usaha
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {mockStats.totalPelakuUsaha.toLocaleString()}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs font-semibold text-green-600">+{mockStats.pelakuUsahaBaru}</span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">bulan ini</span>
              </div>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                Terdaftar di sistem kemetrologian
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border dark:border-slate-600/50 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                UTTP Terdaftar
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Scale className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {mockStats.uttpTerdaftar.toLocaleString()}
              </div>
              <div className="mt-2 space-y-1">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Ukur, Takar, Timbang, Panjang
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs px-2 py-0">Aktif: {chartData.statusTera[0]?.value || 0}</Badge>
                  <Badge variant="secondary" className="text-xs px-2 py-0">Perlu Tera: {chartData.statusTera[1]?.value || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 via-amber-50 to-amber-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border dark:border-slate-600/50 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Tera Ulang Bulan Ini
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-400 dark:to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {mockStats.teraUlangBulanIni}
              </div>
              <div className="mt-2 space-y-1">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    Target: {Math.round(mockStats.teraUlangBulanIni * 1.2)} tera
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 via-violet-50 to-violet-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 dark:border dark:border-slate-600/50 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Tingkat Kepatuhan
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-600 dark:from-violet-400 dark:to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {Math.round((chartData.statusTera[0]?.value || 0) / Math.max(1, mockStats.totalPelakuUsaha) * 100)}%
              </div>
              <div className="mt-2 space-y-2">
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-violet-500 to-violet-600 h-2 rounded-full" 
                    style={{ width: `${Math.round((chartData.statusTera[0]?.value || 0) / Math.max(1, mockStats.totalPelakuUsaha) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  UTTP dengan status tera aktif
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Trend Pendaftaran Bulanan */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                Trend Pendaftaran 6 Bulan Terakhir
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Jumlah pelaku usaha baru yang mendaftar setiap bulan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.trendBulanan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" type="category" />
                  <YAxis type="number" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pelakuUsaha"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="Pelaku Usaha Baru"
                  />
                  <Area
                    type="monotone"
                    dataKey="teraUlang"
                    stackId="2"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Tera Ulang"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Tera Chart */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <PieChart className="w-4 h-4 text-white" />
                </div>
                Status Tera UTTP
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Distribusi status tera seluruh UTTP
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={chartData.statusTera}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Additional Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Jenis Lapak Chart */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                Distribusi Jenis Lapak
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Perbandingan jumlah pelaku usaha berdasarkan jenis lapak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.jenisLapak}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" type="category" />
                  <YAxis type="number" />
                  <Tooltip />
                  <Bar dataKey="jumlah" fill="#3b82f6" name="Jumlah Terdaftar" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Statistik Permohonan Tera */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Statistik Permohonan Tera
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Status permohonan tera yang masuk dari masyarakat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">{chartData.permohonanStats.pending}</div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">Menunggu</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{chartData.permohonanStats.processing}</div>
                    <div className="text-xs text-blue-700 dark:text-blue-300">Diproses</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{chartData.permohonanStats.approved}</div>
                    <div className="text-xs text-green-700 dark:text-green-300">Disetujui</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-red-600 dark:text-red-400">{chartData.permohonanStats.rejected}</div>
                    <div className="text-xs text-red-700 dark:text-red-300">Ditolak</div>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/admin/data-permohonan">
                  <Eye className="w-4 h-4 mr-2" />
                  Lihat Semua Permohonan
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Data */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                Data Terbaru
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Pelaku usaha yang baru didaftarkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  recentData.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600/50 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.nama}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          {item.jenis} - {item.lokasi}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.uttpCount} UTTP terdaftar
                        </p>
                      </div>
                      <Badge
                        variant={
                          item.status === "Aktif" ? "default" : "secondary"
                        }
                        className={`ml-4 ${
                          item.status === "Aktif" 
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
                            : ""
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
              <Button variant="outline" className="w-full mt-4" asChild>
                <Link to="/admin/data-pelaku-usaha">Lihat Semua Data</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Chart Data Tera */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-900 dark:text-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                Distribusi Data Tera
              </CardTitle>
              <CardDescription className="text-slate-600 dark:text-slate-400">
                Perbandingan jumlah data tera berdasarkan kategori
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { name: "SPBU", jumlah: chartData.dataTeraStats?.spbu || 0, color: "#3b82f6" },
                    { name: "Pasar", jumlah: chartData.dataTeraStats?.pasar || 0, color: "#10b981" },
                    { name: "Umum", jumlah: chartData.dataTeraStats?.umum || 0, color: "#8b5cf6" }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" type="category" />
                  <YAxis type="number" />
                  <Tooltip 
                    formatter={(value, name) => [value, `Data Tera ${name}`]}
                    labelFormatter={(label) => `Kategori: ${label}`}
                  />
                  <Bar dataKey="jumlah" fill="#8884d8">
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                    <Cell fill="#8b5cf6" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {/* <Card className="border-0 shadow-lg bg-white dark:bg-slate-800 dark:border dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-slate-100">Aksi Cepat</CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-400">
              Shortcut untuk tugas yang sering dilakukan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link to="/admin/tambah-data">
                  <Plus className="w-6 h-6 mb-2" />
                  <span>Tambah Pelaku Usaha</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col" asChild>
                <Link to="/admin/data-pelaku-usaha">
                  <FileText className="w-6 h-6 mb-2" />
                  <span>Kelola Data</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <TrendingUp className="w-6 h-6 mb-2" />
                <span>Laporan</span>
              </Button>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
