import { useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from 'sonner';
import { Lock, Save, ShieldCheck } from 'lucide-react';

const ChangePassword = () => {
  const { user } = useAuthStore();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // VALIDASI STANDAR
    if (newPassword.length < 6) {
      return toast.error("Password baru minimal 6 karakter!");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("Konfirmasi password baru tidak cocok!");
    }
    if (oldPassword === newPassword) {
      return toast.error("Password baru tidak boleh sama dengan password lama!");
    }

    setIsLoading(true);
    const toastId = toast.loading("Memverifikasi data...");

    try {
      // Ambil data user terbaru dari DB untuk cek password lama
      const checkRes = await fetch(`http://localhost:5000/users/${user?.id}`);
      const userData = await checkRes.json();

      // Validasi password lama
      if (userData.password !== oldPassword) {
        toast.error("Password lama salah!", { id: toastId });
        setIsLoading(false);
        return;
      }

      // Jika oke, update ke assword Baru
      const updateRes = await fetch(`http://localhost:5000/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (updateRes.ok) {
        toast.success("Password berhasil diperbarui!", { id: toastId });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast.error("Gagal menghubungi server", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <Card className="shadow-xl border-t-4 border-t-orange-500">
        <CardHeader>
          <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
            <ShieldCheck className="text-orange-600" size={24} />
          </div>
          <CardTitle className="text-xl">Ubah Password</CardTitle>
          <CardDescription>Keamanan akun adalah prioritas. Gunakan password yang kuat.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {/* Old password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password Lama</label>
              <Input 
                type="password" 
                placeholder="Masukkan password saat ini" 
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>

            <hr className="my-2" />

            {/* New password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Password Baru</label>
              <Input 
                type="password" 
                placeholder="Minimal 6 karakter" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Konfirmasi Password Baru</label>
              <Input 
                type="password" 
                placeholder="Ulangi password baru" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 mt-2 gap-2" 
              disabled={isLoading}
            >
              <Save size={18} />
              {isLoading ? "Memproses..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChangePassword;