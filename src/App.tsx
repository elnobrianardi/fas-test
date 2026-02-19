import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";

// Mock Pages (Nanti kamu buat file aslinya)
const Home = () => (
  <div className="p-8 text-black">
    <h1>Halaman Blog - List Posts</h1>
  </div>
);
const PostDetail = () => (
  <div className="p-8">
    <h1>Detail Post</h1>
  </div>
);
const CategoryPosts = () => (
  <div className="p-8">
    <h1>Posts by Category</h1>
  </div>
);
const Dashboard = () => (
  <div className="p-8">
    <h1>CMS Dashboard</h1>
  </div>
);
const PostsManager = () => (
  <div className="p-8">
    <h1>Management Posts (CRUD)</h1>
  </div>
);
const CategoriesManager = () => (
  <div className="p-8">
    <h1>Management Categories</h1>
  </div>
);
const ChangePassword = () => (
  <div className="p-8">
    <h1>Ganti Password</h1>
  </div>
);

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES (User-facing) */}
      <Route path="/" element={<Home />} />
      <Route path="/post/:slug" element={<PostDetail />} />
      <Route path="/category/:slug" element={<CategoryPosts />} />

      {/* AUTH */}
      <Route path="/login" element={<Login />} />

      {/* PRIVATE ROUTES (Admin/CMS) */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="posts" element={<PostsManager />} />
          <Route path="categories" element={<CategoriesManager />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      </Route>

      {/* 404 - Not Found */}
      <Route
        path="*"
        element={
          <div className="flex h-screen items-center justify-center">
            404 - Page Not Found
          </div>
        }
      />
    </Routes>
  );
}

export default App;
