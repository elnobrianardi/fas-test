import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Auth/Login";
import HomePage from "./pages/public/Home";
import AdminLayout from "./layouts/AdminLayout";
import Categories from "./pages/admin/Categories";
import { Toaster } from "sonner";
import Posts from "./pages/admin/Posts";
import CreatePost from "./components/CreatePost";
import PostDetail from "./pages/public/PostDetail";
import Register from "./pages/Auth/Register";
import ChangePassword from "./pages/admin/settings/ChangePassword";
import CategoryPosts from "./pages/public/CategoryPosts";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <>
      <Routes>
        {/* PUBLIC ROUTES (User-facing) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:slug" element={<PostDetail />} />
        <Route path="/category/:slug" element={<CategoryPosts />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVATE ROUTES (Admin/CMS) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="posts">
              <Route index element={<Posts />} />
              <Route path="create" element={<CreatePost />} />
            </Route>
            <Route path="categories" element={<Categories />} />
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
      <Toaster richColors closeButton position="top-right" expand={true} />
    </>
  );
}

export default App;
