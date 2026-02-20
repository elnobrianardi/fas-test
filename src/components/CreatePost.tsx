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
    content: "",
    image: "",
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const toastId = toast.loading("Uploading image to cloud...");
  const body = new FormData();
  body.append('image', file);

  try {
    // Ganti YOUR_API_KEY dengan key dari ImgBB
    const res = await fetch(`https://api.imgbb.com/1/upload?key=128aa19f55b4860ce9814f749f910113`, {
      method: "POST",
      body: body
    });
    const data = await res.json();
    
    // Simpan URL aslinya ke state, bukan Base64 lagi!
    setFormData({ ...formData, image: data.data.url });
    toast.success("Image uploaded successfully!", { id: toastId });
  } catch (error) {
    toast.error("Upload failed", { id: toastId });
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.categoryId || !formData.content) {
      return toast.error("Please fill all fields");
    }

    setIsLoading(true);
    const toastId = toast.loading("Publishing post...");

    try {
      const slug = formData.title.toLowerCase().replace(/\s+/g, "-");

      await addPost({ ...formData, slug });

      await new Promise((r) => setTimeout(r, 1000));

      toast.success("Post published!", { id: toastId });
      navigate("/admin/posts");
    } catch (error) {
      toast.error("Failed to publish", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/posts")}
        >
          <ChevronLeft size={20} />
        </Button>
        <h1 className="text-2xl font-bold">Create New Post</h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Main Content */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
            <div className="space-y-2">
              <Label>Post Title</Label>
              <Input
                placeholder="Enter title..."
                value={formData.title}
                onChange={(e) => {
                  const newTitle = e.target.value;
                  // Auto generate slug from title
                  const newSlug = newTitle
                    .toLowerCase()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-");
                  setFormData({
                    ...formData,
                    title: newTitle,
                  });
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image</label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />

              {/* PREVIEW */}
              {formData.image && (
                <div className="mt-4 relative aspect-video rounded-xl overflow-hidden border-2 border-dashed">
                  <img
                    src={formData.image}
                    className="w-full h-full object-cover"
                    alt="Preview"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, image: "" })}
                  >
                    Hapus
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Write your story..."
                className="min-h-[400px] resize-none"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-4">
          <div className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                onValueChange={(val) =>
                  setFormData({ ...formData, categoryId: val })
                }
              >
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

            <hr />

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Publish Post
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/admin/posts")}
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
