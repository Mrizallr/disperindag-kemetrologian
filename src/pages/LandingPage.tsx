import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Scale,
  Clock,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Shield,
  Users,
  FileText,
  Calendar,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Star,
  Award,
  Zap,
  Moon,
  Sun,
  Sparkles,
  CheckCircle,
  TrendingUp,
  Globe,
  Cpu,
} from "lucide-react";
import { ThemeToggle } from "../components/theme-toggle";
import { supabase, type Artikel } from "../lib/supabase";

const LandingPage: React.FC = () => {
  const [artikel, setArtikel] = useState<Artikel[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [stats, setStats] = useState({
    totalAlat: 0,
    totalPelakuUsaha: 0,
    totalUttp: 0,
    totalArtikel: 0
  });

  useEffect(() => {
    loadArtikel();
    loadStats();

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadStats = async () => {
    try {
      // Get total alat from daftar_alat
      const { count: totalAlat } = await supabase
        .from('daftar_alat')
        .select('*', { count: 'exact', head: true });

      // Get total pelaku usaha from pelaku_usaha
      const { count: totalPelakuUsaha } = await supabase
        .from('pelaku_usaha')
        .select('*', { count: 'exact', head: true });

      // Get total UTTP from uttp table
      const { count: totalUttp } = await supabase
        .from('uttp')
        .select('*', { count: 'exact', head: true });

      // Get total artikel
      const { count: totalArtikel } = await supabase
        .from('artikel')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalAlat: totalAlat || 0,
        totalPelakuUsaha: totalPelakuUsaha || 0,
        totalUttp: totalUttp || 0,
        totalArtikel: totalArtikel || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadArtikel = async () => {
    try {
      const { data, error } = await supabase
        .from("artikel")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      setArtikel(data || []);
    } catch (error) {
      console.error("Error loading articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Beranda", href: "#hero" },
    { label: "Layanan", href: "#layanan" },
    { label: "Jadwal", href: "#jadwal" },
    { label: "Artikel", href: "#artikel" },
    { label: "Kontak", href: "#kontak" },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Enhanced Header with Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50
            ? "backdrop-blur-md shadow-lg border-b border-white/10 dark:border-slate-700/30"
            : ""
        }`}
      >
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => scrollToSection("hero")}
            >
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 border border-blue-200 dark:border-white/20 p-1">
                <img 
                  src="/logo-disperindag.png" 
                  alt="Logo Disperindag" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors">
                  Kemetrologian
                </h1>
                <p className="text-xs text-gray-600 dark:text-white/70">
                  Disperindag ESDM
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href.slice(1))}
                  className="relative px-4 py-2 text-gray-800 dark:text-white/90 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium group bg-transparent"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                </button>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="outline"
                className="rounded-full px-6 py-2 text-gray-800 border-gray-300 hover:bg-gray-100 dark:text-white dark:border-white/30 dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                asChild
              >
                <a href="/login">
                  <Shield className="w-4 h-4 mr-2" />
                  Admin Login
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-800 dark:text-white/90 hover:bg-white/10 backdrop-blur-sm transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ${
              mobileMenuOpen ? "max-h-80 opacity-100 mt-4" : "max-h-0 opacity-0"
            }`}
          >
            <nav className="flex flex-col space-y-2 py-4 border-t border-gray-200 dark:border-white/20 bg-white/90 dark:bg-black/20 backdrop-blur-md rounded-lg">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(item.href.slice(1))}
                  className="px-4 py-3 text-gray-800 dark:text-white/90 hover:text-blue-600 dark:hover:text-white transition-colors duration-200 text-left font-medium bg-transparent"
                >
                  {item.label}
                </button>
              ))}
              <div className="mx-4 mt-4 flex items-center justify-between">
                <ThemeToggle />
                <Button
                  variant="outline"
                  className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 dark:text-white dark:border-white/30 dark:hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  asChild
                >
                  <a href="/login">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Login
                  </a>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section
        id="hero"
        className="flex-grow pt-24 md:pt-32 pb-20 px-4 flex items-center justify-center relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/10 dark:bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-400/10 dark:bg-green-400/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-400/10 dark:bg-purple-400/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="container mx-auto text-center max-w-6xl relative z-10">
          <Badge
            variant="secondary"
            className="mb-8 px-6 py-3 text-sm font-semibold rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 dark:from-blue-900/30 dark:to-purple-900/30 dark:text-blue-300 animate-fade-in-up hover:scale-105 transition-transform duration-300 border border-blue-200 dark:border-blue-800 shadow-lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Layanan Digital Kemetrologian Terdepan
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-slate-100 mb-8 leading-tight tracking-tight animate-fade-in-up delay-200">
            Selamat Datang di Website
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 dark:from-blue-400 dark:via-purple-400 dark:to-green-400 animate-gradient">
              {" "}
              Layanan Kemetrologian
            </span>
            <br />
            <span className="text-2xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-gray-600 to-gray-800 dark:from-slate-400 dark:to-slate-300">
              Disperindag ESDM Kabupaten Garut
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-700 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-400">
            Platform berbasis web yang memudahkan masyarakat dan pelaku usaha dalam mengakses informasi, 
            mengajukan permohonan, serta memantau layanan kemetrologian dengan cepat dan transparan.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-600">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full px-8 py-4 text-base md:text-lg group"
              asChild
            >
              <a
                href="https://forms.google.com/your-form-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Ajukan Permohonan
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full px-8 py-4 text-base md:text-lg group"
              onClick={() => scrollToSection("jadwal")}
            >
              <FileText className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Panduan Layanan
            </Button>
          </div>

          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mt-20 max-w-5xl mx-auto">
            <div className="text-center animate-fade-in-up delay-800 group hover:scale-105 transition-transform duration-300 p-6 bg-white/10 dark:bg-slate-800/20 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-800/30">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                {stats.totalAlat}+
              </div>
              <div className="text-gray-600 dark:text-slate-400 font-medium">
                Alat Standar
              </div>
            </div>
            <div className="text-center animate-fade-in-up delay-1000 group hover:scale-105 transition-transform duration-300 p-6 bg-white/10 dark:bg-slate-800/20 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-800/30">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 dark:text-green-400 mb-2 group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors">
                {stats.totalPelakuUsaha}+
              </div>
              <div className="text-gray-600 dark:text-slate-400 font-medium">
                Pelaku Usaha
              </div>
            </div>
            <div className="text-center animate-fade-in-up delay-1200 group hover:scale-105 transition-transform duration-300 p-6 bg-white/10 dark:bg-slate-800/20 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-800/30">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                {stats.totalUttp}+
              </div>
              <div className="text-gray-600 dark:text-slate-400 font-medium">
                UTTP Terdaftar
              </div>
            </div>
            <div className="text-center animate-fade-in-up delay-1400 group hover:scale-105 transition-transform duration-300 p-6 bg-white/10 dark:bg-slate-800/20 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-slate-700/30 hover:bg-white/20 dark:hover:bg-slate-800/30">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-colors">
                {stats.totalArtikel}+
              </div>
              <div className="text-gray-600 dark:text-slate-400 font-medium">
                Artikel & Berita
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </div>
      </section>



      {/* Enhanced Services Section */}
      <section
        id="layanan"
        className="py-24 px-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
      >
        <div className="w-full px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Layanan Kemetrologian Disperindag ESDM
            </h2>
            <p className="text-xl text-gray-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Layanan Kemetrologian Disperindag ESDM mencakup tera, tera ulang, pengawasan UTTP, serta konsultasi dan pengaduan. 
              Melalui layanan ini, masyarakat dan pelaku usaha dapat memastikan alat ukur, takar, timbang, dan perlengkapannya (UTTP) 
              tetap sesuai standar, adil, dan transparan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transform hover:-translate-y-2 hover:scale-105">
              <CardHeader className="p-8 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Tera/Tera Ulang
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  Pemeriksaan pertama kali pada UTTP sebelum digunakan secara resmi dan berkala pada UTTP yang sudah pernah ditera sebelumnya
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Pemeriksaan pertama kali UTTP
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                    Pemeriksaan berkala UTTP
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transform hover:-translate-y-2 hover:scale-105">
              <CardHeader className="p-8 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Pengawasan UTTP
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  Pemeriksaan di lapangan untuk memastikan alat ukur/timbang sesuai standar dan tidak merugikan konsumen
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Pemeriksaan lapangan
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Perlindungan konsumen
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden transform hover:-translate-y-2 hover:scale-105">
              <CardHeader className="p-8 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Konsultasi & Pengaduan
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                  Layanan bagi masyarakat jika ada dugaan kecurangan dalam penggunaan alat ukur
                </CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Konsultasi gratis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-orange-500" />
                    Penanganan pengaduan
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Schedule Section */}
      <section id="jadwal" className="py-24 px-4">
        <div className="w-full px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Jadwal Layanan Tera
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Informasi jadwal pelayanan tera dan tera ulang
            </p>
          </div>

          <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 hover:shadow-3xl transition-all duration-500">
            <CardHeader className="p-0 mb-8">
              <CardTitle className="flex items-center gap-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                Jadwal Operasional
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-10">
              <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3 text-xl">
                    <Clock className="w-6 h-6 text-blue-600" />
                    Hari Kerja
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        Senin - Kamis
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        08:00 - 15:30
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 px-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        Jumat
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        08:00 - 15:00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-6 text-xl">
                    Catatan Penting
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <ArrowRight className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Pendaftaran ditutup 30 menit sebelum jam tutup
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <ArrowRight className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Bawa dokumen persyaratan lengkap
                      </span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <ArrowRight className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Alat dalam kondisi bersih dan siap tera
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
                <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-6 text-2xl flex items-center gap-3">
                  <Shield className="w-6 h-6" />
                  Persyaratan Tera
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-blue-800 dark:text-blue-300">
                      <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Surat permohonan tera/tera ulang</span>
                    </li>
                    <li className="flex items-start gap-3 text-blue-800 dark:text-blue-300">
                      <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Fotocopy KTP dan SIUP (untuk usaha)</span>
                    </li>
                  </ul>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-blue-800 dark:text-blue-300">
                      <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Alat ukur/timbang dalam kondisi baik</span>
                    </li>
                    <li className="flex items-start gap-3 text-blue-800 dark:text-blue-300">
                      <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                      <span>Biaya tera sesuai tarif yang berlaku</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <div className="w-full px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Testimoni Pengguna
            </h2>
            <p className="text-xl text-gray-700 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Kepercayaan dan kepuasan pengguna adalah prioritas utama kami
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-slate-100">PT. Maju Bersama</h4>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Retail & Trading</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                "Pelayanan tera di Disperindag ESDM sangat memuaskan. Petugas profesional dan proses cepat. Alat timbangan kami sekarang sudah tersertifikasi resmi."
              </p>
            </Card>

            <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mr-4">
                  <Scale className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-slate-100">CV. Sukses Mandiri</h4>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Manufacturing</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                "Proses tera ulang sangat mudah dan tidak ribet. Petugas datang langsung ke pabrik kami. Sertifikat langsung jadi dalam 2 hari kerja."
              </p>
            </Card>

            <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-slate-100">Toko Berkah Jaya</h4>
                  <p className="text-sm text-gray-600 dark:text-slate-400">Retail Store</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                "Layanan konsultasi sangat membantu. Ketika ada masalah dengan timbangan, langsung ditangani dengan baik. Terima kasih Disperindag ESDM!"
              </p>
            </Card>
          </div>
          
          <div className="text-center mt-16">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-8 max-w-2xl mx-auto">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200 mb-4">
                  Bagikan Pengalaman Anda
                </h3>
                <p className="text-blue-800 dark:text-blue-300 mb-6 leading-relaxed">
                  Sudah menggunakan layanan kemetrologian kami? Bagikan testimoni Anda untuk membantu pelaku usaha lainnya.
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <a href="mailto:info@kemetrologian.go.id?subject=Testimoni Layanan Kemetrologian">
                    <Mail className="w-5 h-5 mr-2" />
                    Kirim Testimoni
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-white dark:bg-slate-900">
        <div className="w-full px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xl text-gray-700 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Informasi penting seputar layanan kemetrologian Disperindag ESDM
            </p>
          </div>

          <div className="space-y-6">
            <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  Apa itu layanan kemetrologian?
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                  Layanan kemetrologian adalah pelayanan untuk memastikan alat ukur, takar, timbang, dan perlengkapannya (UTTP) 
                  sesuai standar yang berlaku. Meliputi tera pertama kali, tera ulang, pengawasan, serta konsultasi dan pengaduan.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  Bagaimana cara mengajukan permohonan tera?
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                  Siapkan dokumen persyaratan (surat permohonan, fotocopy KTP, SIUP untuk usaha), bawa alat dalam kondisi bersih, 
                  datang ke kantor Disperindag ESDM pada jam kerja, atau hubungi kami untuk informasi lebih lanjut.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  Berapa lama proses tera dan berapa biayanya?
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <p className="text-gray-700 dark:text-slate-300 leading-relaxed">
                  Proses tera biasanya memakan waktu 1-3 hari kerja tergantung jenis dan jumlah alat. 
                  Biaya tera sesuai dengan tarif yang ditetapkan pemerintah. Hubungi kami untuk informasi tarif terbaru.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Articles Section */}
      {artikel.length > 0 && (
        <section
          id="artikel"
          className="py-24 px-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm"
        >
          <div className="w-full px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Artikel & Berita Terbaru
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Informasi terkini seputar kemetrologian dan layanan kami
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artikel.map((item, index) => (
                <Card
                  key={item.id}
                  className={`group hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-2xl overflow-hidden flex flex-col transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {item.gambar_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.gambar_url}
                        alt={item.judul}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.currentTarget.src = `https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=600`;
                        }}
                      />
                    </div>
                  )}
                  <CardHeader className="p-6 pb-4 flex-grow">
                    <CardTitle className="line-clamp-2 text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                      {item.judul}
                    </CardTitle>
                    <CardDescription className="line-clamp-3 text-gray-600 dark:text-gray-400 text-base leading-relaxed">
                      {item.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
                      <span className="flex items-center gap-2 font-medium">
                        <Users className="w-4 h-4" />
                        {item.author}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center group/btn"
                      asChild
                    >
                      <a href={`/artikel/${item.id}`}>
                        Baca Selengkapnya
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Enhanced Contact Section */}
      <section
        id="kontak"
        className="w-full py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="w-full px-4 relative z-10">
          <div className="text-center mb-20">
            <Badge className="mb-6 px-6 py-3 text-sm font-semibold rounded-full bg-white/10 text-white border border-white/20 backdrop-blur-sm">
              <Phone className="w-4 h-4 mr-2" />
              Hubungi Kami
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Siap Membantu Anda 24/7
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Tim ahli kami siap memberikan konsultasi dan dukungan teknis untuk kebutuhan kemetrologian Anda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-500 group transform hover:-translate-y-2">
              <CardHeader className="p-8">
                <CardTitle className="text-white flex items-center gap-4 text-xl font-bold">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  Alamat Kantor
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/90 p-8 pt-0">
                <p className="leading-relaxed">
                  Dinas Perindustrian dan Perdagangan ESDM
                  <br />
                  Jl. Merdeka Raya No. 15
                  <br />
                  Jakarta Pusat, DKI Jakarta 10110
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-500 group transform hover:-translate-y-2">
              <CardHeader className="p-8">
                <CardTitle className="text-white flex items-center gap-4 text-xl font-bold">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  Kontak Langsung
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/90 space-y-4 p-8 pt-0">
                <div className="flex items-center gap-3 hover:text-white transition-colors">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span>(021) 3456-7890</span>
                </div>
                <div className="flex items-center gap-3 hover:text-white transition-colors">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>info@kemetrologian.go.id</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl hover:bg-white/15 transition-all duration-500 group transform hover:-translate-y-2">
              <CardHeader className="p-8">
                <CardTitle className="text-white flex items-center gap-4 text-xl font-bold">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  Jam Operasional
                </CardTitle>
              </CardHeader>
              <CardContent className="text-white/90 space-y-3 p-8 pt-0">
                <div className="flex justify-between">
                  <span>Senin - Kamis</span>
                  <span className="font-semibold">08:00 - 15:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Jumat</span>
                  <span className="font-semibold">08:00 - 15:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Online Support</span>
                  <span className="font-semibold text-green-400">24/7</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16 px-4 border-t border-slate-800">
        <div className="w-full px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 group mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <Scale className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="font-bold text-2xl text-slate-200 group-hover:text-white transition-colors">
                    Kemetrologian Digital
                  </span>
                  <p className="text-sm text-slate-400">
                    Disperindag ESDM - Era Digital 4.0
                  </p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 max-w-md">
                Platform digital terdepan untuk layanan kemetrologian dengan teknologi AI, IoT, dan Blockchain. 
                Melayani dengan inovasi, integritas, dan kepercayaan.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors cursor-pointer">
                  <Phone className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-200 mb-4">Layanan</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Smart Tera & Tera Ulang</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Business Registry</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blockchain Certificate</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Analytics Dashboard</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-200 mb-4">Dukungan</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Panduan Pengguna</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Kontak Support</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Status Sistem</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
              <div>
                <p className="text-base mb-1 text-slate-300">
                  © 2024 Dinas Perindustrian dan Perdagangan ESDM
                </p>
                <p className="text-sm text-slate-500">
                  Semua hak dilindungi undang-undang • Powered by Advanced Technology
                </p>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <a href="#" className="hover:text-blue-400 transition-colors">Kebijakan Privasi</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Syarat & Ketentuan</a>
                <a href="#" className="hover:text-blue-400 transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
