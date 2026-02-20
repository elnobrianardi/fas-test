import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePostStore } from '@/stores/postStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { Calendar, ChevronRight, LayoutGrid, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CategoryPosts = () => {
  const { slug } = useParams();
  const { posts, fetchPosts, isFetching } = usePostStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  const currentCategory = categories.find(c => c.slug === slug);
  const filteredPosts = posts.filter(post => post.categoryId === currentCategory?.id);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header Kategori */}
      <section className="bg-white border-b py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          
          <Link to="/">
            <Button variant="ghost" className="pl-0 text-zinc-500 hover:text-orange-600 hover:bg-transparent -ml-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <LayoutGrid size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Category</span>
            </div>
            <h1 className="text-4xl font-extrabold text-zinc-900">
              Articles in <span className="text-orange-500 capitalize">{currentCategory?.name || slug}</span>
            </h1>
            <p className="text-zinc-500 mt-2">
              Menampilkan {filteredPosts.length} artikel yang relevan.
            </p>
          </div>
        </div>
      </section>

      {/* Grid Post */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-zinc-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-zinc-300">
            <p className="text-zinc-400 text-lg mb-4">Belum ada artikel untuk kategori ini.</p>
            <Link to="/">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Jelajahi Artikel Lain
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/post/${post.slug}`}
                className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="aspect-video bg-zinc-100 overflow-hidden relative">
                  <img 
                    src={post.image || `https://picsum.photos/seed/${post.id}/600/400`}
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center text-xs text-zinc-400 gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(post.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-zinc-900 leading-tight group-hover:text-orange-500 transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-zinc-500 text-sm line-clamp-2">
                    {post.shortDescription || (post.content.substring(0, 100) + '...')}
                  </p>

                  <div className="pt-2 flex items-center text-sm font-semibold text-orange-600">
                    Baca Selengkapnya <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CategoryPosts;