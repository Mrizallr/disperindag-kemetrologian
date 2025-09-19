import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Scale3DIcon, Edit } from "lucide-react";

const ViewPengawasanBBM: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Mock data - sesuaikan dengan data dari DataPengawasanBBM
    const mockData = {
      id: parseInt(id || "1"),
      pemilik: "PT Pertamina Retail",
      nomorSpbu: "34.401.15",
      alamat: "Jl. Raya Garut No. 123",
      merek: "Tokico",
      status: "Sesuai",
      tanggalPengawasan: "2024-01-15",
      petugas: "Ahmad Fauzi",
      catatan: "Pompa dalam kondisi baik, semua parameter sesuai standar"
    };
    setData(mockData);
  }, [id]);

  if (!data) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full px-6 md:px-10 lg:px-20 py-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/data-pengawasan-bbm")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
          </Button>
          <div>
            <Scale3DIcon className="w-8 h-8 text-purple-600 inline mr-3" />
            <h1 className="text-3xl font-bold inline">Detail Pengawasan BBM</h1>
            <p className="text-gray-600 mt-2">
              Detail hasil pengawasan pompa ukur BBM
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Informasi Pengawasan
              <Button
                onClick={() => navigate(`/admin/edit-pengawasan/${data.id}`)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Data
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-semibold text-gray-700">Pemilik:</label>
                <p className="text-gray-900">{data.pemilik}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">No. SPBU:</label>
                <p className="text-gray-900">{data.nomorSpbu}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Alamat:</label>
                <p className="text-gray-900">{data.alamat}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Merek:</label>
                <p className="text-gray-900">{data.merek}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Status:</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  data.status === 'Sesuai' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {data.status}
                </span>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Tanggal Pengawasan:</label>
                <p className="text-gray-900">{new Date(data.tanggalPengawasan).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <label className="font-semibold text-gray-700">Petugas:</label>
                <p className="text-gray-900">{data.petugas}</p>
              </div>
            </div>
            
            {data.catatan && (
              <div className="mt-6">
                <label className="font-semibold text-gray-700">Catatan:</label>
                <p className="text-gray-900 mt-2 p-4 bg-gray-50 rounded-lg">{data.catatan}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default ViewPengawasanBBM;