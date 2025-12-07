import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';

interface Article {
  id: string;
  judul: string;
  excerpt: string;
  konten: string;
  gambar_url: string;
  author: string;
  category: string;
  read_time: number;
  created_at: string;
}

export default function SingleArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('artikel')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setArticle(data);
    } catch (error) {
      console.error('Error fetching article:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel tidak ditemukan</h2>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-y-auto bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8 w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Kembali
        </button>

        {article.gambar_url && (
          <div className="w-full h-96 overflow-hidden rounded-lg mb-6">
            <img
              src={article.gambar_url}
              alt={article.judul}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <article className="bg-white">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              <Tag size={16} />
              {article.category || 'Artikel'}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {article.read_time || 5} menit baca
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(article.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.judul}
          </h1>

          <div className="flex items-center gap-2 text-gray-700 mb-6 pb-6 border-b border-gray-200">
            <User size={20} />
            <span className="font-medium">{article.author}</span>
          </div>

          <div className="prose prose-lg max-w-none">
            {article.excerpt && (
              <p className="text-xl text-gray-700 font-medium mb-6 leading-relaxed">
                {article.excerpt}
              </p>
            )}
            <div 
              className="text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.konten }}
            />
          </div>
        </article>
      </div>
    </div>
  );
}
