import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, User, UserPlus, Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";

// Import komponen shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        toast.success("Registrasi Berhasil!");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mendaftar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="max-w-md w-full shadow-xl border-t-4 border-t-orange-500">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-500 p-3 rounded-xl shadow-orange-200 shadow-lg">
              <UserPlus className="text-white h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Buat Akun Baru
          </CardTitle>
          <CardDescription>
            Daftar sekarang untuk mulai mengelola konten blog Anda
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Nama Lengkap */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  required
                  placeholder="Nama Anda"
                  className="pl-10"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  required
                  placeholder="admin@fas.id"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-zinc-700 transition-colors"
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeClosed className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold bg-orange-500 hover:bg-orange-600 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Daftar Akun"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-center text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-orange-500 font-semibold hover:underline"
            >
              Login di sini
            </Link>
          </p>
          <p className="text-xs text-center text-muted-foreground w-full">
            &copy; 2026 Famous Allstars. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
