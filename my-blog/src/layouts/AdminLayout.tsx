import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  LayoutDashboard, 
  FileText, 
  Tag, 
  KeyRound, 
  LogOut, 
  Menu,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const AdminLayout = () => {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/posts', name: 'Posts', icon: FileText },
    { path: '/admin/categories', name: 'Categories', icon: Tag },
    { path: '/admin/change-password', name: 'Change Password', icon: KeyRound },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-2xl">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <span className="text-white font-black text-xl italic">F</span>
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-tight">FAMOUS</h1>
              <p className="text-[10px] tracking-[0.2em] text-primary font-bold uppercase opacity-80">Allstars CMS</p>
            </div>
          </div>
        </div>

        <Separator className="bg-sidebar-border opacity-50 mb-6 mx-8 w-auto" />

        <nav className="flex-1 px-4 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-zinc-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={isActive ? 'text-white' : 'group-hover:text-primary transition-colors'} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="opacity-50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-sidebar-accent/50 rounded-2xl p-4 mb-4 border border-sidebar-border">
            <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-1">Administrator</p>
            <p className="text-sm font-semibold truncate text-white">{user?.name || 'Admin FAS'}</p>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 h-12 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-semibold text-sm">Sign Out</span>
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header Desktop / Mobile */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between bg-white/80 backdrop-blur-md px-8 border-b border-zinc-200">
          <div className="flex items-center gap-4">
             {/* Hamburger Mobile */}
             <button 
               className="md:hidden p-2 text-zinc-600" 
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
             >
               <Menu />
             </button>
             <h2 className="font-bold text-zinc-800 text-lg capitalize">
               {location.pathname.split('/').pop()?.replace('-', ' ')}
             </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="h-9 w-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                <span className="text-xs font-bold text-zinc-600">EB</span>
             </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Drawer Overlay (Opsional) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;