import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, type Artikel } from "../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Users,
  Image as ImageIcon,
  Home,
  Scale,
  Clock,
  Share2,
  BookOpen,
  ChevronUp,
  Facebook,
  Twitter,
  Link2,
  Check,
} from "lucide-react";

const SingleArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Artikel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setShowScrollTop(currentScrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setError("ID artikel tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("artikel")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;

        setArticle(data);

        if (data?.konten) {
          const wordCount = data.konten
            .replace(/<[^>]*>/g, "")
            .split(/\s+/).length;
          setReadingTime(Math.ceil(wordCount / 200));
        }
      } catch (err: any) {
        console.error("Gagal memuat artikel:", err.message);
        setError(`Gagal memuat artikel: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = article?.judul || "Artikel Kemetrologian";

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
          console.error("Failed to copy URL");
        }
        break;
    }
    setShareMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400">Memuat artikel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 bg-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <Home className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Artikel Tidak Ditemukan
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {error || "Artikel yang Anda cari tidak tersedia."}
            </p>
          </div>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3"
          >
            <Home className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-900">
      {/* Enhanced Header with Navigation - Sama seperti LandingPage */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
            : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Kemetrologian
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Disperindag ESDM
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Share Button */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="rounded-full px-6 py-2 text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105"
                  onClick={() => setShareMenuOpen(!shareMenuOpen)}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Bagikan
                </Button>

                {/* Share Menu */}
                {shareMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-2 min-w-48 z-50">
                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare("twitter")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Twitter className="w-4 h-4 text-blue-400" />
                      <span className="text-sm font-medium">Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare("copy")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copySuccess ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <Link2 className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-sm font-medium">
                        {copySuccess ? "Tersalin!" : "Salin Link"}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="rounded-full px-6 py-2 text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900/20 transition-all duration-300 hover:scale-105"
                onClick={() => navigate("/")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-40">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-green-600 transition-all duration-300"
          style={{
            width: `${Math.min(
              (scrollY /
                (document.documentElement.scrollHeight - window.innerHeight)) *
                100,
              100
            )}%`,
          }}
        />
      </div>

      {/* Main Content - Centered */}
      <main className="pt-24 md:pt-32 pb-20 flex-grow flex items-start justify-center">
        <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Article Content - Centered Layout */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
            {/* Article Image - Full Width */}
            {article.gambar_url ? (
              <div className="relative overflow-hidden w-full">
                <img
                  src={article.gambar_url}
                  alt={article.judul}
                  className="w-full h-72 md:h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://images.pexels.com/photos/5668859/pexels-photo-5668859.jpeg?auto=compress&cs=tinysrgb&w=800`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ) : (
              <div className="w-full h-72 md:h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <div className="text-center space-y-4">
                  <ImageIcon className="w-16 h-16 text-gray-400 mx-auto" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Gambar tidak tersedia
                  </p>
                </div>
              </div>
            )}

            <div className="p-6 md:p-8 text-center">
              {/* Article Meta */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  <BookOpen className="w-4 h-4 mr-1" />
                  Artikel
                </Badge>
                {readingTime > 0 && (
                  <Badge variant="outline">
                    <Clock className="w-4 h-4 mr-1" />
                    {readingTime} menit baca
                  </Badge>
                )}
              </div>

              {/* Article Title */}
              <h1 className="text-2xl md:text-4xl font-bold mb-6 leading-tight text-gray-900 dark:text-gray-100">
                {article.judul}
              </h1>

              {/* Article Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-600 dark:text-gray-400 mb-8">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm">
                    <span className="text-gray-500">Oleh </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {article.author}
                    </span>
                  </span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(article.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Excerpt */}
              {article.excerpt && (
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 max-w-5xl mx-auto">
                  <p className="text-base text-blue-900 dark:text-blue-200 leading-relaxed font-medium italic text-center">
                    "{article.excerpt}"
                  </p>
                </div>
              )}

              {/* Main Content - Better Reading Experience */}
              <div className="mx-auto text-left">
                <div
                  className="prose prose-lg dark:prose-invert mx-auto prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:w-full"
                  dangerouslySetInnerHTML={{ __html: article.konten }}
                />
              </div>
            </div>
          </div>

          {/* Back to Articles Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => navigate("/#artikel")}
              variant="outline"
              size="lg"
              className="rounded-full px-6 py-3 text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Lihat Artikel Lainnya
            </Button>
          </div>
        </div>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
        >
          <ChevronUp className="w-6 h-6 mx-auto" />
        </button>
      )}

      {/* Click outside to close share menu */}
      {shareMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShareMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default SingleArticlePage;
