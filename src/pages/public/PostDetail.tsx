import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePostStore } from '@/stores/postStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { Calendar, Tag, ArrowLeft, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { posts, fetchPosts } = usePostStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (posts.length === 0) await fetchPosts();
      if (categories.length === 0) await fetchCategories();
      setLoading(false);
    };
    loadData();
  }, [fetchPosts, fetchCategories, posts.length, categories.length]);

  // Cari post berdasarkan slug
  const post = posts.find((p) => p.slug === slug);

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || "Uncategorized";
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-200 w-3/4 mx-auto rounded"></div>
          <div className="h-4 bg-zinc-200 w-1/2 mx-auto rounded"></div>
          <div className="h-64 bg-zinc-200 w-full rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Artikel tidak ditemukan</h1>
        <Button onClick={() => navigate('/')} variant="outline">
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Navigation & Header */}
      <div className="max-w-3xl mx-auto px-4 pt-10">
        <Button 
          variant="ghost" 
          className="mb-8 -ml-4 text-zinc-500 hover:text-orange-500"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} className="mr-2" /> Kembali
        </Button>

        <div className="space-y-4">
          <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {getCategoryName(post.categoryId)}
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-zinc-500 pt-2 border-b pb-8">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              5 Menit Baca
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-5xl mx-auto px-4 my-10">
        <div className="aspect-video rounded-3xl overflow-hidden bg-zinc-100 border shadow-lg">
          <img 
            src={post.image || `https://picsum.photos/seed/${post.id}/1200/800`}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="prose prose-zinc prose-lg lg:prose-xl max-w-none">
          {/* Render content dengan line break manual */}
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-zinc-700 leading-relaxed text-lg">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Footer Article */}
        <div className="mt-16 pt-8 border-t flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Tag size={18} className="text-orange-500" />
            <span className="font-medium">{getCategoryName(post.categoryId)}</span>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 size={16} /> Bagikan
          </Button>
        </div>
      </div>
    </article>
  );
};

export default PostDetail;