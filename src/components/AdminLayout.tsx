import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { Button } from "@/components/ui/button";
import {
  Scale,
  Home,
  Users,
  Bell,
  FileText,
  LogOut,
  Menu,
  X,
  ClipboardList,
  Repeat,
  Scale3DIcon,
  ChevronDown,
  ChevronRight,
  Database,
  Eye,
} from "lucide-react";

import { toast } from "sonner";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [dataTeraOpen, setDataTeraOpen] = React.useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout berhasil");
      // Force redirect to landing page
      window.location.href = '/';
    } catch (error) {
      toast.error("Gagal logout");
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const sidebarItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    // { icon: Bell, label: "Notifikasi", path: "/admin/notifikasi" }, // Fitur dalam pengembangan
    // {
    //   icon: Users,
    //   label: "Data Wajib Teras",
    //   path: "/admin/data-pelaku-usaha",
    // },
    {
      icon: ClipboardList,
      label: "Data Permohonan",
      path: "/admin/permohonan",
    },
    { icon: Repeat, label: "Tera Ulang", path: "/admin/perpanjang" },
    { icon: Scale3DIcon, label: "Pengawasan BBM", path: "/admin/data-pengawasan-bbm" },
    { icon: Scale, label: "Daftar Alat ", path: "/admin/alat" },
    { icon: FileText, label: "Artikel", path: "/admin/artikel" },
  ];

  const dataTeraItems = [
    { label: "SPBU", path: "/admin/data-tera/spbu" },
    { label: "Pasar", path: "/admin/data-tera/pasar" },
    { label: "Umum", path: "/admin/data-tera/umum" },
  ];

  const isDataTeraActive = dataTeraItems.some(item => location.pathname.startsWith(item.path));

  React.useEffect(() => {
    if (isDataTeraActive) {
      setDataTeraOpen(true);
    }
  }, [isDataTeraActive]);

  // Auto logout when navigating away from admin (not refresh)
  React.useEffect(() => {
    const handlePopState = () => {
      // Check if navigating away from admin pages
      setTimeout(() => {
        if (!window.location.pathname.startsWith('/admin')) {
          logout();
        }
      }, 100);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [logout]);

  return (
    <div className="flex h-screen w-screen">
      {/* Sidebar */}
      <aside
        className={`
            fixed lg:static z-40 top-0 left-0 h-screen w-64 bg-background border-r border-border shadow-lg
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 p-6 border-b border-border">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-background">
              <img
                src="/logo-disperindag.png"
                alt="Logo Disperindag"
                className="object-contain w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">Kemetrologian</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {/* Menu items sebelum Data Tera */}
              {sidebarItems.slice(0, 2).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              
              {/* Data Tera Dropdown - Setelah Data Wajib Teras */}
              <div className="space-y-1">
                <button
                  onClick={() => setDataTeraOpen(!dataTeraOpen)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDataTeraActive
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <Database className="w-5 h-5" />
                  <span className="flex-1 text-left">Data Tera</span>
                  {dataTeraOpen ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
                
                {dataTeraOpen && (
                  <div className="ml-8 space-y-1">
                    {dataTeraItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                          location.pathname.startsWith(item.path)
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Sisa menu items */}
              {sidebarItems.slice(2).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-md"
        >
          {sidebarOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-slate-50 p-4 pt-16 lg:pt-8">
        <div className="h-fit">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
