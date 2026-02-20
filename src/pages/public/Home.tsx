import { useEffect, useState } from 'react';
import { usePostStore } from '@/stores/postStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { Link } from 'react-router-dom';
import { Search, Calendar, Tag, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Home = () => {
  const { posts, fetchPosts, isFetching } = usePostStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.name || "Uncategorized";
  };

  // Filter posts berdasarkan pencarian
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Hero Section */}
      <section className="bg-white border-b py-16 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-900 tracking-tight">
            FAS <span className="text-orange-500">Blog</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
            Temukan artikel menarik seputar Teknologi, Fashion, dan Gaya Hidup terbaru di sini.
          </p>
          
          <div className="max-w-md mx-auto relative mt-8">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <Input 
              placeholder="Cari artikel..." 
              className="pl-10 h-12 bg-zinc-50 border-zinc-200 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1,2,3].map(i => (
               <div key={i} className="h-80 bg-zinc-200 animate-pulse rounded-2xl" />
             ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
             <p className="text-zinc-400 text-lg">Belum ada artikel yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/post/${post.slug}`}
                className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                {/* Thumbnail Mockup */}
                <div className="aspect-video bg-zinc-100 overflow-hidden relative">
                   <img 
                    src={post.image || `https://picsum.photos/seed/${post.id}/600/400`}
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                   />
                   <div className="absolute top-3 left-3">
                      <span className="bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                        {getCategoryName(post.categoryId)}
                      </span>
                   </div>
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
                    {post.content.substring(0, 100)}...
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

export default Home;