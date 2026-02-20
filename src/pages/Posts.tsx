import { useEffect, useState } from "react";
import { usePostStore } from "@/stores/postStore";
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
import { Plus, Trash2, FileText, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Posts = () => {
  const { posts, fetchPosts, deletePost, isFetching } = usePostStore();
  const { categories, fetchCategories } = useCategoryStore();
  const navigate = useNavigate();
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const {updatePost} = usePostStore();

  useEffect(() => {
    console.log("Fetching posts...");
    fetchPosts();
    fetchCategories();
  }, [fetchPosts, fetchCategories]);

  const getCategoryName = (id: string) => {
    return categories.find((c) => c.id === id)?.name || "Uncategorized";
  };

  const handleDelete = async (id: string, title: string) => {
    const toastId = toast.loading(`Deleting "${title}"...`);
    try {
      await deletePost(id);
      await new Promise((r) => setTimeout(r, 1000));
      toast.warning("Post Deleted", { id: toastId });
    } catch (error) {
      toast.error("Failed to delete", { id: toastId });
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

      <div className="bg-white border rounded-xl shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <Loader2 className="animate-spin mx-auto text-orange-500" />
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                >
                  No posts found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-zinc-400" />
                      {post.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded-md text-xs font-medium border">
                      {getCategoryName(post.categoryId)}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-500 text-sm">
                    {new Date(post.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      onClick={() => setEditingPost(post)} 
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(post.id, post.title)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {/* DIALOG EDIT POST */}
<Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
  <DialogContent className="max-w-2xl"> {/* Dibuat lebih lebar karena ada textarea */}
    <DialogHeader>
      <DialogTitle>Edit Post</DialogTitle>
    </DialogHeader>
    
    <div className="py-4 space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input 
          value={editingPost?.title || ""}
          onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <select 
          className="w-full p-2 border rounded-md text-sm"
          value={editingPost?.categoryId || ""}
          onChange={(e) => setEditingPost({...editingPost, categoryId: e.target.value})}
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Content</label>
        <textarea 
          className="w-full p-2 border rounded-md min-h-[200px] text-sm"
          value={editingPost?.content || ""}
          onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
        />
      </div>
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
      <Button 
        className="bg-orange-500 hover:bg-orange-600"
        onClick={async () => {
          const toastId = toast.loading("Updating post...");
          try {
            const slug = editingPost.title.toLowerCase().replace(/\s+/g, '-');
            await updatePost(editingPost.id, { ...editingPost, slug });
            setEditingPost(null);
            toast.success("Post updated!", { id: toastId });
          } catch (error) {
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
