import { useEffect, useState } from "react";
import { useCategoryStore } from "@/stores/categoryStore";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Trash2,
  FileText,
  Loader2,
  Pencil,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePostStore, type Post } from "@/stores/postStore";

const Posts = () => {
  const { posts, fetchPosts, deletePost, isFetching, updatePost } =
    usePostStore();
  const { categories, fetchCategories } = useCategoryStore();
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  const totalPages = Math.ceil(posts.length / itemsPerPage);

  const validPage = posts.length > 0 ? Math.min(currentPage, totalPages) : 1;

  if (currentPage !== validPage && validPage > 0) {
    setCurrentPage(validPage);
  }
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Ambil data dari state utama untuk di-render sesuai page
  const currentItems = posts.slice(indexOfFirstItem, indexOfLastItem);

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || "Uncategorized";
  };

  const handleDelete = async (id: string, title: string) => {
    const toastId = toast.loading(`Deleting "${title}"...`);
    try {
      await deletePost(id);
      toast.warning("Post Deleted", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete", { id: toastId });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading new image...");
    const formData = new FormData();
    formData.append("image", file);
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        { method: "POST", body: formData },
      );
      const result = await response.json();

      if (result.success) {
        setEditingPost((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            image: result.data.url,
            thumbnail: result.data.thumb.url,
          };
        });
        toast.success("Image updated!", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">All Posts</h1>
          <p className="text-muted-foreground text-sm">
            Manage your blog articles.
          </p>
        </div>
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => navigate("/admin/posts/create")}
        >
          <Plus className="mr-2 h-4 w-4" /> Create Post
        </Button>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead className="min-w-[200px]">
                Title & Description
              </TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <Loader2 className="animate-spin mx-auto text-orange-500" />
                </TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground"
                >
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((post: Post) => (
                <TableRow key={post.id} className="hover:bg-zinc-50/50">
                  <TableCell>
                    <div className="w-12 h-12 rounded-lg border bg-zinc-100 overflow-hidden">
                      {post.thumbnail ? (
                        <img
                          src={post.thumbnail}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText size={16} className="text-zinc-400" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-zinc-900 line-clamp-1">
                        {post.title}
                      </span>
                      <span className="text-xs text-zinc-500 line-clamp-1 italic">
                        {post.shortDescription || "No description provided."}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs font-mono bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-600">
                      {post.slug}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-[11px] font-bold border border-orange-100 uppercase tracking-wider">
                      {getCategoryName(post.categoryId)}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-500 text-xs">
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 h-8 w-8"
                        onClick={() => setEditingPost(post)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                        onClick={() => handleDelete(post.id, post.title)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* --- Pagination Footer --- */}
        <div className="px-6 py-4 border-t flex items-center justify-between bg-zinc-50/50">
          <p className="text-sm text-zinc-500">
            Showing{" "}
            <span className="font-medium text-zinc-900">
              {posts.length > 0 ? indexOfFirstItem + 1 : 0}
            </span>{" "}
            to{" "}
            <span className="font-medium text-zinc-900">
              {Math.min(indexOfLastItem, posts.length)}
            </span>{" "}
            of <span className="font-medium text-zinc-900">{posts.length}</span>{" "}
            posts
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || isFetching}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={
                currentPage === totalPages || totalPages === 0 || isFetching
              }
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {" "}
          {/* Dibuat lebih lebar karena ada textarea */}
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Title */}

            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>

              <Input
                value={editingPost?.title || ""}
                onChange={(e) =>
                  setEditingPost((prev) =>
                    prev ? { ...prev, title: e.target.value } : null,
                  )
                }
              />
            </div>

            {/* Short Description */}

            <div className="space-y-2">
              <label className="text-sm font-medium">Short Description</label>

              <textarea
                className="w-full p-2 border rounded-md min-h-20 text-sm"
                placeholder="Ringkasan singkat post..."
                value={editingPost?.shortDescription || ""}
                onChange={(e) =>
                  setEditingPost((prev) =>
                    prev ? { ...prev, shortDescription: e.target.value } : null,
                  )
                }
              />

              <p className="text-[10px] text-muted-foreground italic">
                *Muncul di halaman depan (Home)
              </p>
            </div>

            {/* Category */}

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>

              <select
                className="w-full p-2 border rounded-md text-sm"
                value={editingPost?.categoryId || ""}
                onChange={(e) =>
                  setEditingPost((prev) =>
                    prev ? { ...prev, categoryId: e.target.value } : null,
                  )
                }
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload Field */}

            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image</label>

              <div className="flex flex-col gap-3">
                {/* Preview Gambar */}

                {editingPost?.image && (
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                    <img
                      src={editingPost.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs">
                        Ganti gambar dengan memilih file baru
                      </p>
                    </div>
                  </div>
                )}

                {/* Input File */}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                <p className="text-[10px] text-muted-foreground italic">
                  *Gambar akan otomatis ter-upload ke cloud
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <textarea
                className="w-full p-2 border rounded-md min-h-[200px] text-sm"
                value={editingPost?.content || ""}
                onChange={(e) =>
                  setEditingPost((prev) =>
                    prev ? { ...prev, content: e.target.value } : null,
                  )
                }
              />
            </div>
          </div>
          <DialogFooter className="sticky bottom-0 bg-white pt-2 border-t">
            <Button variant="outline" onClick={() => setEditingPost(null)}>
              Cancel
            </Button>

            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={async () => {
                if (!editingPost) return;

                const toastId = toast.loading("Updating post...");

                try {
                  const title = editingPost.title || "";
                  const slug = title
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, "")
                    .replace(/[\s_-]+/g, "-")
                    .replace(/^-+|-+$/g, "");

                  // 3. Kirim ke API
                  await updatePost(editingPost.id, { ...editingPost, slug });

                  setEditingPost(null);
                  toast.success("Post updated!", { id: toastId });
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to update post", { id: toastId });
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Posts;
