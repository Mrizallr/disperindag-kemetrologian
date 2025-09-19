import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import AdminLayout from "../components/AdminLayout";
import { Label } from "@/components/ui/label";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Perbarui interface Alat untuk menyesuaikan dengan skema tabel Supabase
interface Alat {
  id?: number;
  nama_alat: string | null;
  kelas_ketelitian: string | null;
  kapasitas: string | null;
  merek: string | null;
  model_type: string | null;
  no_seri: string | null;
  jumlah: string | null; // Diubah dari 'number' menjadi 'string'
  no_sertifikat: string | null;
  tanggal_sertifikat: string | null;
  rekalibrasi: string | null;
  lokasi_terkini: string | null;
}

const defaultForm: Alat = {
  nama_alat: "",
  kelas_ketelitian: "",
  kapasitas: "",
  merek: "",
  model_type: "",
  no_seri: "",
  jumlah: "1", // Diubah dari 'number' menjadi 'string'
  no_sertifikat: "",
  tanggal_sertifikat: "",
  rekalibrasi: "",
  lokasi_terkini: "",
};

const DaftarAlat = () => {
  const [dataAlat, setDataAlat] = useState<Alat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Alat>(defaultForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Mengambil data dari tabel daftar_alat...");
      console.log("Supabase client:", supabase);

      const { data, error, count } = await supabase
        .from("daftar_alat")
        .select("*", { count: "exact" });

      console.log("Respon Supabase:", { data, error, count });
      console.log("Data length:", data?.length);

      if (error) {
        console.error("Gagal mengambil data:", error);
        console.error("Error details:", error.details, error.hint, error.code);
        setMessage({
          text: `Gagal memuat data: ${error.message}`,
          type: "error",
        });
        setDataAlat([]);
      } else {
        console.log("Data berhasil dimuat:", data);
        console.log("Jumlah data:", data?.length || 0);
        setDataAlat(data || []);
        setMessage(null);
      }
    } catch (err) {
      console.error("Kesalahan dalam fetchData:", err);
      setMessage({ text: "Terjadi kesalahan saat memuat data", type: "error" });
      setDataAlat([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    let error = null;
    if (editId) {
      const { error: updateError } = await supabase
        .from("daftar_alat")
        .update(form)
        .eq("id", editId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("daftar_alat")
        .insert(form);
      error = insertError;
    }

    if (error) {
      console.error("Gagal menyimpan data:", error);
      setMessage({ text: "Gagal menyimpan data!", type: "error" });
    } else {
      setMessage({
        text: editId
          ? "Data berhasil diperbarui!"
          : "Data berhasil ditambahkan!",
        type: "success",
      });
    }

    setOpenFormDialog(false);
    setForm(defaultForm);
    setEditId(null);
    fetchData();
    setIsSubmitting(false);
  };

  const handleEdit = (alat: Alat) => {
    setForm(alat);
    setEditId(alat.id ?? null);
    setOpenFormDialog(true);
    setMessage(null);
  };

  const handleDelete = async () => {
    if (!idToDelete) return;
    setIsSubmitting(true);
    const { error } = await supabase
      .from("daftar_alat")
      .delete()
      .eq("id", idToDelete);
    if (error) {
      console.error("Gagal menghapus data:", error);
      setMessage({ text: "Gagal menghapus data!", type: "error" });
    } else {
      setMessage({ text: "Data berhasil dihapus!", type: "success" });
    }
    setOpenDeleteDialog(false);
    setIdToDelete(null);
    fetchData();
    setIsSubmitting(false);
  };

  const openDeleteConfirmation = (id: number) => {
    setIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleExport = () => {
    const filteredData = table
      .getFilteredRowModel()
      .rows.map((row) => row.original);
    const exportData = filteredData.map((item, index) => ({
      No: index + 1,
      Nama: item.nama_alat || "-",
      Kelas: item.kelas_ketelitian || "-",
      Kapasitas: item.kapasitas || "-",
      Merek: item.merek || "-",
      Model: item.model_type || "-",
      NoSeri: item.no_seri || "-",
      Jumlah: item.jumlah || "-",
      NoSertifikat: item.no_sertifikat || "-",
      TglSertifikat: item.tanggal_sertifikat || "-",
      Rekalibrasi: item.rekalibrasi || "-",
      Lokasi: item.lokasi_terkini || "-",
    }));

    const doc = new jsPDF("landscape");
    doc.text("Daftar Alat Standar", 14, 15);
    autoTable(doc, {
      head: [
        [
          "No",
          "Nama Alat",
          "Kelas",
          "Kapasitas",
          "Merek",
          "Model",
          "No Seri",
          "Jumlah",
          "No Sertifikat",
          "Tgl Sertifikat",
          "Rekalibrasi",
          "Lokasi",
        ],
      ],
      body: exportData.map((d) => Object.values(d)),
      foot: [
        [
          "Total: " + filteredData.length + " alat",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
      ],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [33, 150, 243] },
      footStyles: {
        fillColor: [240, 240, 240],
        textColor: [0, 0, 0],
        fontStyle: "bold",
      },
      startY: 20,
    });
    doc.save("daftar alat standar.pdf");
  };

  // Helper untuk membuat label yang lebih mudah dibaca
  const getLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      nama_alat: "Nama Alat",
      kelas_ketelitian: "Kelas Ketelitian",
      kapasitas: "Kapasitas",
      merek: "Merek",
      model_type: "Model/Tipe",
      no_seri: "No. Seri",
      jumlah: "Jumlah",
      no_sertifikat: "No. Sertifikat",
      tanggal_sertifikat: "Tanggal Sertifikat",
      rekalibrasi: "Tanggal Rekalibrasi",
      lokasi_terkini: "Lokasi Terkini",
    };
    return (
      labels[key] ||
      key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
    );
  };

  // Column definitions for TanStack Table
  const columns = useMemo<ColumnDef<Alat>[]>(
    (): ColumnDef<Alat>[] => [
      {
        id: "rowNumber",
        header: "No",
        cell: ({ row }): number =>
          row.index +
          1 +
          (table?.getState().pagination.pageIndex || 0) *
            (table?.getState().pagination.pageSize || 10),
      },
      {
        accessorKey: "nama_alat",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 font-semibold"
          >
            Nama Alat
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }): string => (row.getValue("nama_alat") as string) || "-",
      },
      {
        accessorKey: "kelas_ketelitian",
        header: "Kelas",
        cell: ({ row }): string =>
          (row.getValue("kelas_ketelitian") as string) || "-",
      },
      {
        accessorKey: "kapasitas",
        header: "Kapasitas",
        cell: ({ row }): string => (row.getValue("kapasitas") as string) || "-",
      },
      {
        accessorKey: "merek",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 p-0 font-semibold"
          >
            Merek
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }): string => (row.getValue("merek") as string) || "-",
      },
      {
        accessorKey: "model_type",
        header: "Model",
        cell: ({ row }): string =>
          (row.getValue("model_type") as string) || "-",
      },
      {
        accessorKey: "no_seri",
        header: "No Seri",
        cell: ({ row }): string => (row.getValue("no_seri") as string) || "-",
      },
      {
        accessorKey: "jumlah",
        header: "Jumlah",
        cell: ({ row }): string => (row.getValue("jumlah") as string) || "-",
      },
      {
        accessorKey: "no_sertifikat",
        header: "No Sertifikat",
        cell: ({ row }): string =>
          (row.getValue("no_sertifikat") as string) || "-",
      },
      {
        accessorKey: "tanggal_sertifikat",
        header: "Tgl Sertifikat",
        cell: ({ row }): string =>
          (row.getValue("tanggal_sertifikat") as string) || "-",
      },
      {
        accessorKey: "rekalibrasi",
        header: "Rekalibrasi",
        cell: ({ row }): string =>
          (row.getValue("rekalibrasi") as string) || "-",
      },
      {
        accessorKey: "lokasi_terkini",
        header: "Lokasi",
        cell: ({ row }): string =>
          (row.getValue("lokasi_terkini") as string) || "-",
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }): JSX.Element => {
          const alat = row.original;
          return (
            <div className="flex space-x-2">
              <Button size="sm" onClick={() => handleEdit(alat)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => openDeleteConfirmation(alat.id!)}
              >
                Hapus
              </Button>
            </div>
          );
        },
      },
    ],
    [handleEdit, openDeleteConfirmation]
  );

  const table = useReactTable<Alat>({
    data: dataAlat,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <AdminLayout>
      <Card className="mt-4">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Daftar Alat Standar</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export ke PDF
            </Button>
            <Dialog open={openFormDialog} onOpenChange={setOpenFormDialog}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setForm(defaultForm);
                    setEditId(null);
                  }}
                >
                  + Tambah Alat
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editId ? "Edit Alat" : "Tambah Alat Baru"}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(defaultForm).map(([key]) => (
                      <div key={key} className="space-y-2">
                        <Label htmlFor={key} className="text-sm font-medium">
                          {getLabel(key)}
                        </Label>
                        <Input
                          id={key}
                          name={key}
                          type={
                            key.includes("tanggal") ||
                            key.includes("rekalibrasi")
                              ? "date"
                              : key === "jumlah"
                              ? "number"
                              : "text"
                          }
                          value={(form as any)[key] ?? ""}
                          onChange={handleChange}
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setOpenFormDialog(false)}
                    className="w-full sm:w-auto"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleFormSubmit}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting
                      ? "Menyimpan..."
                      : editId
                      ? "Perbarui"
                      : "Simpan"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {message && (
            <div
              className={`p-4 rounded-md mb-4 text-white ${
                message.type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Search Input */}
          <div className="flex items-center py-4">
            <Input
              placeholder="Cari alat..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <p className="p-4 text-center">Memuat data...</p>
          ) : dataAlat.length === 0 ? (
            <p className="p-4 text-center text-gray-500">
              Tidak ada data alat. Klik "+ Tambah Alat" untuk menambah data.
            </p>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup: any) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header: any) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row: any) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell: any) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          Tidak ada hasil.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Menampilkan{" "}
                  {table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    1}{" "}
                  sampai{" "}
                  {Math.min(
                    (table.getState().pagination.pageIndex + 1) *
                      table.getState().pagination.pageSize,
                    table.getFilteredRowModel().rows.length
                  )}{" "}
                  dari {table.getFilteredRowModel().rows.length} data
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog untuk konfirmasi hapus */}
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Data Alat</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus data alat ini? Aksi ini tidak
              dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDeleteDialog(false)}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default DaftarAlat;
