import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface FormData {
  judul: string;
  konten: string;
  excerpt: string;
  gambar_url: string;
  status: 'draft' | 'published';
  author: string;
}

const TambahArtikel: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    judul: '',
    konten: '',
    excerpt: '',
    gambar_url: '',
    status: 'draft',
    author: 'Admin'
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!');
    console.log('Form data:', formData);
    
    setIsLoading(true);

    try {
      console.log('Attempting to save article...');
      
      const insertData = {
        judul: formData.judul,
        konten: formData.konten,
        excerpt: formData.excerpt,
        gambar_url: formData.gambar_url || null,
        status: formData.status,
        author: formData.author || 'Admin'
      };
      
      console.log('Insert data:', insertData);
      
      const { data, error } = await supabase
        .from('artikel')
        .insert([insertData])
        .select();

      console.log('Supabase response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Article saved successfully!');
      toast.success('Artikel berhasil ditambahkan!');
      navigate('/admin/artikel');
    } catch (error: any) {
      console.error('Catch error:', error);
      toast.error(`Gagal menyimpan artikel: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      console.log('Loading finished');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/admin/artikel')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tambah Artikel</h1>
            <p className="text-gray-600 mt-1">
              Buat artikel baru untuk ditampilkan di landing page
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informasi Artikel */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Informasi Artikel
              </CardTitle>
              <CardDescription>
                Data dasar artikel yang akan dipublikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul Artikel *</Label>
                <Input
                  id="judul"
                  value={formData.judul}
                  onChange={(e) => handleInputChange('judul', e.target.value)}
                  placeholder="Masukkan judul artikel"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Ringkasan Artikel *</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Masukkan ringkasan singkat artikel (akan ditampilkan di preview)"
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Nama penulis"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gambar_url">URL Gambar (Opsional)</Label>
                  <Input
                    id="gambar_url"
                    value={formData.gambar_url}
                    onChange={(e) => handleInputChange('gambar_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status Publikasi *</Label>
                <RadioGroup 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="draft" id="draft" />
                    <Label htmlFor="draft">Draft (Belum Dipublikasi)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="published" id="published" />
                    <Label htmlFor="published">Published (Langsung Tampil)</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Konten Artikel */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Konten Artikel</CardTitle>
              <CardDescription>
                Isi lengkap artikel yang akan ditampilkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="konten">Konten Artikel *</Label>
                <Textarea
                  id="konten"
                  value={formData.konten}
                  onChange={(e) => handleInputChange('konten', e.target.value)}
                  placeholder="Tulis konten artikel lengkap di sini..."
                  rows={15}
                  required
                />
                <p className="text-sm text-gray-500">
                  Tip: Gunakan paragraf yang jelas dan struktur yang mudah dibaca
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/artikel')}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Menyimpan...' : 'Simpan Artikel'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default TambahArtikel;