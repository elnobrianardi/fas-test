import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostStore } from "@/stores/postStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CreatePost = () => {
  const navigate = useNavigate();
  const { addPost } = usePostStore();
  const { categories } = useCategoryStore();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    categoryId: "",
    shortDescription: "",
    content: "",
    image: "",
    thumbnail: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image to cloud...");
    const body = new FormData();
    body.append("image", file);
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: body,
      });
      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        image: data.data.url,
        thumbnail: data.data.thumb.url,
      }));
      toast.success("Image & Thumbnail uploaded!", { id: toastId });
    } catch (err) {
      console.error(err); 
      toast.error("Upload failed", { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.categoryId || !formData.content || !formData.shortDescription) {
      return toast.error("Semua field wajib diisi!");
    }

    setIsLoading(true);
    const toastId = toast.loading("Publishing post...");

    try {
      const slug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      await addPost({
        ...formData,
        slug,
      });

      toast.success("Post published!", { id: toastId });
      navigate("/admin/posts");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/posts")}>
          <ChevronLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Create New Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
            <div className="space-y-2">
              <Label>Post Title</Label>
              <Input
                placeholder="Judul artikel menarik..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Short Description</Label>
              <Textarea
                placeholder="Ringkasan singkat..."
                className="min-h-[80px] resize-none"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange} />
              {formData.image && (
                <div className="mt-4 relative aspect-video rounded-xl overflow-hidden border">
                  <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Full Content</Label>
              <Textarea
                placeholder="Tulis isi blog di sini..."
                className="min-h-[300px] resize-none"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Publish Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;