import { useEffect, useState } from "react";
import { useCategoryStore } from "@/stores/categoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Trash2, Tag, Loader2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const Categories = () => {
  const {
    categories,
    fetchCategories,
    addCategory,
    deleteCategory,
    updateCategory,
    isFetching,
  } = useCategoryStore();

  const [newCatName, setNewCatName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCat, setEditingCat] = useState<{ id: string; name: string } | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Pagination Logic
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

  // UX Fix: Jika halaman jadi kosong karena penghapusan, mundur 1 halaman
  useEffect(() => {
    if (currentPage > 1 && currentItems.length === 0 && !isFetching) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentItems.length, currentPage, isFetching]);

 const handleAdd = async () => {
    if (!newCatName.trim()) return toast.error("Name is required");
    setIsSubmitting(true);
    try {
      await addCategory(newCatName);
      setIsOpen(false);
      setNewCatName("");
      toast.success(`Kategori "${newCatName}" berhasil ditambahkan!`);
    } catch (err) {
      console.error(err); 
      toast.error("Gagal menambahkan kategori");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const toastId = toast.loading(`Menghapus ${name}...`);
    try {
      await deleteCategory(id);
      
      // UX Fix: Jika ini item terakhir di halaman saat ini (dan bukan halaman 1), mundur 1 halaman
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
      
      toast.warning(`Kategori ${name} telah dihapus.`, { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus kategori", { id: toastId });
    }
  };

  const handleUpdate = async () => {
    if (!editingCat?.name.trim()) return toast.error("Name is required");
    const toastId = toast.loading("Updating category...");
    try {
      await updateCategory(editingCat.id, editingCat.name);
      setEditingCat(null);
      toast.success("Category updated!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground text-sm">Kelola kategori untuk artikel blog kamu.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white border-none">
              <Plus size={18} /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium text-zinc-700">Category Name</label>
              <Input
                className="mt-2"
                placeholder="e.g. Technology..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                disabled={isSubmitting}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-zinc-50">
            <TableRow>
              <TableHead className="w-16 text-center text-xs uppercase font-bold text-zinc-500">#</TableHead>
              <TableHead className="text-xs uppercase font-bold text-zinc-500">Category Name</TableHead>
              <TableHead className="text-xs uppercase font-bold text-zinc-500">Slug</TableHead>
              <TableHead className="text-right text-xs uppercase font-bold text-zinc-500">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-orange-500 mx-auto" />
                </TableCell>
              </TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((cat: { id: string; name: string; slug: string }, index: number) => (
                <TableRow key={cat.id} className="hover:bg-zinc-50/50 transition-colors">
                  <TableCell className="text-center text-zinc-400 font-medium">
                    {indexOfFirstItem + index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-zinc-900">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-orange-50 rounded-lg">
                        <Tag size={14} className="text-orange-500" />
                      </div>
                      {cat.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-zinc-500 font-mono text-[11px] bg-zinc-100 px-2 py-0.5 rounded">
                      /{cat.slug}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost" size="icon"
                        className="text-blue-500 h-8 w-8"
                        onClick={() => setEditingCat({ id: cat.id, name: cat.name })}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        className="text-red-500 h-8 w-8"
                        onClick={() => handleDelete(cat.id, cat.name)}
                      >
                        <Trash2 size={16} />
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
            Showing <span className="font-medium text-zinc-900">{categories.length > 0 ? indexOfFirstItem + 1 : 0}</span> to{" "}
            <span className="font-medium text-zinc-900">{Math.min(indexOfLastItem, categories.length)}</span> of{" "}
            <span className="font-medium text-zinc-900">{categories.length}</span> categories
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline" size="sm"
              disabled={currentPage === 1 || isFetching}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            <Button
              variant="outline" size="sm"
              disabled={currentPage === totalPages || totalPages === 0 || isFetching}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* DIALOG EDIT CATEGORY */}
      <Dialog open={!!editingCat} onOpenChange={(open) => !open && setEditingCat(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-zinc-700">Category Name</label>
            <Input
              className="mt-2"
              value={editingCat?.name || ""}
              onChange={(e) => setEditingCat(prev => prev ? { ...prev, name: e.target.value } : null)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCat(null)}>Cancel</Button>
            <Button onClick={handleUpdate} className="bg-orange-500 hover:bg-orange-600">
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;