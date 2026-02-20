import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Github, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

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

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Cari user berdasarkan email
    const response = await fetch(`http://localhost:5000/users?email=${email}`);
    const users = await response.json();

    if (users.length > 0 && users[0].password === password) {
      // Login Sukses
      login({
        id: users[0].id,
        email: users[0].email,
        name: users[0].name,
      });
      toast.success(`Selamat datang, ${users[0].name}!`);
      navigate('/admin/dashboard');
    } else {
      toast.error("Email atau Password salah!");
    }
  } catch (error) {
    toast.error("Terjadi kesalahan sistem");
  } finally {
    setIsLoading(false);
  }
};

  const handleSocialLogin = (platform: string) => {
    toast.info(`Login dengan ${platform}...`);
    login({
      id: "2",
      email: "elno@example.com",
      name: `User ${platform}`,
    });
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="max-w-md w-full shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-xl shadow-orange-200 shadow-lg">
              <Lock className="text-white h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Famous Allstars CMS
          </CardTitle>
          <CardDescription>
            Masukkan email dan password untuk masuk ke panel admin
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Email
              </label>
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

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01]"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => handleSocialLogin("Github")}
            className="w-full h-11 gap-2 hover:bg-zinc-50"
          >
            <Github className="h-5 w-5" />
            <span>Github</span>
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-center text-muted-foreground">
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-orange-500 font-semibold hover:underline"
            >
              Daftar sekarang
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

export default Login;
