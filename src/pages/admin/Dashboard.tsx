import { usePostStore } from "@/stores/postStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { 
  FileText, 
  Tag, 
  TrendingUp, 
  Clock, 
  ArrowUpRight 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const { posts, fetchPosts } = usePostStore();
  const { categories } = useCategoryStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts])

  const totalPosts = posts.length;
  const totalCategories = categories.length;
  const latestPosts = [...posts].reverse().slice(0, 5); 

  const stats = [
    {
      title: "Total Posts",
      value: totalPosts,
      icon: <FileText className="text-blue-500" size={24} />,
      color: "bg-blue-50",
    },
    {
      title: "Total Categories",
      value: totalCategories,
      icon: <Tag className="text-orange-500" size={24} />,
      color: "bg-orange-50",
    },
    {
      title: "Growth",
      value: "+12%", 
      icon: <TrendingUp className="text-green-500" size={24} />,
      color: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome Back, Admin!</h1>
        <p className="text-muted-foreground text-sm">
          Berikut adalah ringkasan performa blog kamu hari ini.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 border rounded-xl shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts List */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock size={18} className="text-zinc-400" /> Recent Posts
            </h3>
            <Link to="/admin/posts" className="text-xs text-orange-500 font-medium flex items-center hover:underline">
              View All <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="divide-y">
            {latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <div key={post.id} className="p-4 flex items-center gap-4 hover:bg-zinc-50 transition-colors">
                  <img 
                    src={post.thumbnail || post.image} 
                    className="w-12 h-12 rounded-lg object-cover bg-zinc-100" 
                    alt="" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-900 truncate">{post.title}</p>
                    <p className="text-xs text-zinc-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-sm text-zinc-500 italic">
                Belum ada artikel yang dipublikasikan.
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips / Info */}
        <div className="bg-orange-500 rounded-xl p-8 text-white relative overflow-hidden flex flex-col justify-center">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Tips Hari Ini!</h3>
            <p className="text-orange-100 text-sm leading-relaxed">
              Gunakan kategori yang relevan untuk setiap artikel agar pembaca lebih mudah menemukan konten yang mereka cari. Jangan lupa tambahkan deskripsi pendek yang menarik!
            </p>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-400 rounded-full opacity-50"></div>
          <div className="absolute top-10 right-10 w-10 h-10 bg-orange-600 rounded-full opacity-30"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;