import { useEffect, useState } from "react";
import { usePostStore } from "@/stores/postStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { Link } from "react-router-dom";
import { Search, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

const Home = () => {
  const { posts, fetchPosts, isFetching } = usePostStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
//   State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, []);

  // Reset ke halaman 1 setiap kali filter berubah
 const handleFilterChange = (type: "search" | "category", value: string) => {
  if (type === "search") setSearchQuery(value);
  if (type === "category") setSelectedCategory(value);
  setCurrentPage(1); 
};

  const getCategoryData = (id: string) => {
    return categories.find((c) => c.id === id);
  };

  // Filtering
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

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

          {/* Search & Filter Bar */}
          <div className="max-w-4xl mx-auto space-y-6 mt-10">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 z-10 group-focus-within:text-orange-500 transition-colors" size={22} />
              <Input
                placeholder="Cari judul artikel..."
                className="pl-12 h-15 py-7 w-full bg-white border-zinc-200 shadow-sm rounded-2xl focus-visible:ring-orange-500 text-lg transition-all"
                value={searchQuery}
                onChange={(e) => handleFilterChange("search", e.target.value)} 
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleFilterChange("category", "all")}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                  selectedCategory === "all"
                    ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-orange-300 hover:text-orange-500"
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange("category", cat.id)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all border capitalize ${
                    selectedCategory === cat.id
                      ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200"
                      : "bg-white border-zinc-200 text-zinc-600 hover:border-orange-300 hover:text-orange-500"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {isFetching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-zinc-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : currentPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-zinc-200">
            <p className="text-zinc-400 text-lg">Tidak ada artikel yang ditemukan.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => {
                const category = getCategoryData(post.categoryId);
                return (
                  <div key={post.id} className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative">
                    <Link to={`/post/${post.slug}`} className="absolute inset-0 z-0" />
                    <div className="aspect-video bg-zinc-100 overflow-hidden relative">
                      <img
                        src={post.thumbnail || post.image || `https://picsum.photos/seed/${post.id}/600/400`}
                        alt={post.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 z-10">
                        <Link
                          to={`/category/${category?.slug}`}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-orange-500 hover:bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors"
                        >
                          {category?.name || "Uncategorized"}
                        </Link>
                      </div>
                    </div>
                    <div className="p-5 space-y-3 relative pointer-events-none">
                      <div className="flex items-center text-xs text-zinc-400 gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(post.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-zinc-900 leading-tight group-hover:text-orange-500 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-zinc-500 text-sm line-clamp-2">
                        {post.shortDescription || post.content.substring(0, 100) + "..."}
                      </p>
                      <div className="pt-2 flex items-center text-sm font-semibold text-orange-600">
                        Baca Selengkapnya <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-zinc-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors text-zinc-600"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg border text-sm font-semibold transition-all ${
                        currentPage === i + 1
                          ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                          : "bg-white border-zinc-200 text-zinc-600 hover:border-orange-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-zinc-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors text-zinc-600"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;