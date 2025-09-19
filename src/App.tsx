import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { supabase } from "./lib/supabase"; // pastikan path-nya sesuai
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import DataPelakuUsaha from "./pages/DataPelakuUsaha";
import TambahData from "./pages/TambahData";
import EditData from "./pages/EditData";
import NotifikasiPage from "./pages/NotifikasiPage";
import ArtikelPage from "./pages/ArtikelPage";
import TambahArtikel from "./pages/TambahArtikel";
import ViewData from "./pages/ViewData";
import EditArtikel from "./pages/EditArtikel";
import SingleArticlePage from "./pages/SingleArticlePage";
import DaftarAlat from "./pages/DaftarAlat";
import DataPermohonan from "./pages/DataPermohonan";
import DataWajibTeraSPBU from "./pages/DataWajibTeraSPBU";
import DataWajibTeraPasar from "./pages/DataWajibTeraPasar";
import DataWajibTeraUmum from "./pages/DataWajibTeraUmum";
import PengawasanSPU from "./pages/PengawasanSPU";
import DataPengawasanBBM from "./pages/DataPengawasanBBM";
import TambahPengawasanBBM from "./pages/TambahPengawasanBBM";
import ViewPengawasanBBM from "./pages/ViewPengawasanBBM";
import EditPengawasanBBM from "./pages/EditPengawasanBBM";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";

// Auth context (tanpa username/password manual)
const AuthContext = React.createContext<{
  isAuthenticated: boolean;
  logout: () => void;
}>({
  isAuthenticated: false,
  logout: () => {},
});

export const useAuth = () => React.useContext(AuthContext);

// Route protection
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    // Clear localStorage
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthContext.Provider value={{ isAuthenticated, logout }}>
        <Router>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data-pelaku-usaha"
              element={
                <ProtectedRoute>
                  <DataPelakuUsaha />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tambah-data"
              element={
                <ProtectedRoute>
                  <TambahData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-data/:id"
              element={
                <ProtectedRoute>
                  <EditData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/notifikasi"
              element={
                <ProtectedRoute>
                  <NotifikasiPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/artikel"
              element={
                <ProtectedRoute>
                  <ArtikelPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tambah-artikel"
              element={
                <ProtectedRoute>
                  <TambahArtikel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-artikel/:id"
              element={
                <ProtectedRoute>
                  <EditArtikel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/view-data/:id"
              element={
                <ProtectedRoute>
                  <ViewData />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/perpanjang"
              element={
                <ProtectedRoute>
                  <ViewData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/permohonan"
              element={
                <ProtectedRoute>
                  <DataPermohonan />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/alat"
              element={
                <ProtectedRoute>
                  <DaftarAlat />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data-tera/spbu"
              element={
                <ProtectedRoute>
                  <DataWajibTeraSPBU />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data-tera/pasar"
              element={
                <ProtectedRoute>
                  <DataWajibTeraPasar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data-tera/umum"
              element={
                <ProtectedRoute>
                  <DataWajibTeraUmum />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/pengawasan-spu"
              element={
                <ProtectedRoute>
                  <PengawasanSPU />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/data-pengawasan-bbm"
              element={
                <ProtectedRoute>
                  <DataPengawasanBBM />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tambah-pengawasan-bbm"
              element={
                <ProtectedRoute>
                  <TambahPengawasanBBM />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/view-pengawasan/:id"
              element={
                <ProtectedRoute>
                  <ViewPengawasanBBM />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/edit-pengawasan/:id"
              element={
                <ProtectedRoute>
                  <EditPengawasanBBM />
                </ProtectedRoute>
              }
            />
            <Route path="/artikel/:id" element={<SingleArticlePage />} />
          </Routes>
          <Toaster />
        </div>
        </Router>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
