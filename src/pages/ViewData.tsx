import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  MapPin,
  Store,
  Box,
  Scale,
  NotebookPen,
  Weight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const ViewData: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any | null>(null);

  const renderUttpByJenis = () => {
    if (!data.uttp || data.uttp.length === 0) {
      return (
        <p className="text-muted-foreground italic">Tidak ada data UTTP.</p>
      );
    }

    const jenisCounts = data.uttp.reduce(
      (acc: Record<string, number>, item: any) => {
        const jenis = item.jenis || "Tidak diketahui";
        acc[jenis] = (acc[jenis] || 0) + 1;
        return acc;
      },
      {}
    );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
        {Object.entries(jenisCounts).map(([jenis, count]) => (
          <div
            key={jenis}
            className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <div className="flex-shrink-0 p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
              <Weight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {jenis}
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {count as number}
                <span className="text-base font-normal"> unit</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: pelakuUsaha, error } = await supabase
        .from("pelaku_usaha")
        .select("*, uttp(*)")
        .eq("id", id)
        .single();

      if (error || !pelakuUsaha) {
        console.error("Gagal memuat data:", error);
        navigate("/admin/data-pelaku-usaha");
      } else {
        setData(pelakuUsaha);
      }
    };

    if (id) fetchData();
  }, [id, navigate]);

  if (!data)
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <p>Memuat data...</p>
        </div>
      </AdminLayout>
    );

  const renderUttp = (uttp: any, index: number) => (
    <Card key={index} className="w-full">
      <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
        <div className="flex items-center space-x-2">
          <Scale className="h-4 w-4 text-blue-600" />
          <h4 className="font-semibold text-sm text-blue-600">
            UTTP {index + 1}
          </h4>
        </div>
        <Badge
          variant={uttp.kondisi === "Baik" ? "default" : "destructive"}
          className="text-xs"
        >
          {uttp.kondisi || "Tidak diketahui"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-1 p-4 pt-2 text-sm text-muted-foreground">
        <div className="flex justify-between items-center">
          <strong>Jenis:</strong>
          <span>{uttp?.jenis || "-"}</span>
        </div>
        <div className="flex justify-between items-center">
          <strong>Merk:</strong>
          <span>{uttp?.merk || "-"}</span>
        </div>
        <div className="flex justify-between items-center">
          <strong>Tahun Tera:</strong>
          <span>{uttp?.tahun_tera || "-"}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AdminLayout>
      <div className="space-y-8 p-4 md:p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Detail Pelaku Usaha
        </h1>

        {/* Pelaku Usaha Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-blue-700">
              <User className="h-5 w-5" />
              Informasi Utama
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-sm text-gray-700 dark:text-gray-300">
            <div className="space-y-1">
              <p className="text-muted-foreground">Nama Pemilik</p>
              <p className="font-medium text-lg">{data.nama_pemilik}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Lokasi</p>
              <p className="font-medium text-lg flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-500" />
                {data.lokasi}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Jenis Lapak</p>
              <p className="font-medium text-lg flex items-center gap-1">
                <Store className="h-4 w-4 text-gray-500" />
                {data.jenis_lapak}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Jenis Dagangan</p>
              <p className="font-medium text-lg flex items-center gap-1">
                <Box className="h-4 w-4 text-gray-500" />
                {data.jenis_dagangan}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* UTTP Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-blue-700">
              <Weight className="h-5 w-5" />
              Ringkasan UTTP
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              Total UTTP: {data.uttp ? data.uttp.length : 0}
            </p>
            {renderUttpByJenis()}
          </CardContent>
        </Card>

        {/* Individual UTTP Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-blue-700">
              <Scale className="h-5 w-5" />
              Detail UTTP
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.uttp && data.uttp.length > 0 ? (
              data.uttp.map((uttpItem: any, index: number) =>
                renderUttp(uttpItem, index)
              )
            ) : (
              <p className="text-sm italic text-muted-foreground col-span-full">
                Tidak ada data UTTP
              </p>
            )}
          </CardContent>
        </Card>

        {/* Catatan Tambahan Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-blue-700">
              <NotebookPen className="h-5 w-5" />
              Catatan Tambahan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm italic text-muted-foreground">
              {data.catatan || "Tidak ada catatan."}
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            Kembali
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewData;
