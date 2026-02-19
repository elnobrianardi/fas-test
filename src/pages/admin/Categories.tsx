import { useState, useEffect } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Tag, Loader2 } from "lucide-react"; 
import { toast } from 'sonner';

const Categories = () => {
  const { categories, fetchCategories, addCategory, deleteCategory, isFetching } = useCategoryStore();
  
  const [newCatName, setNewCatName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
  if (!newCatName.trim()) return toast.error("Name is required");

  const categoryName = newCatName;
  setIsOpen(false);
  setNewCatName("");

  toast.promise(
    (async () => {
      const result = await addCategory(categoryName);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return result;
    })(),
    {
      loading: 'Menyimpan kategori...',
      success: () => `Kategori "${categoryName}" berhasil ditambahkan!`,
      error: 'Gagal menambahkan kategori',
    }
  );
};

  const handleDelete = async (id: string, name: string) => {
  const toastId = toast.loading(`Menghapus ${name}...`);

  try {
    await deleteCategory(id);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.warning(`Kategori ${name} telah dihapus.`, {
        id: toastId,
      description: "Data telah dihapus dari database.",
    });
  } catch (error) {
    toast.error("Gagal menghapus kategori", { id: toastId });
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
            <div className="py-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">Category Name</label>
                <Input 
                  placeholder="e.g. Technology, Fashion..." 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleAdd} disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
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
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* 2. Tampilkan Loading State jika sedang fetch */}
            {isFetching ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading categories...
                  </div>
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat: any, index: number) => (
                <TableRow key={cat.id}>
                  <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-orange-500" />
                      {cat.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-500 font-mono text-xs italic">/{cat.slug}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(cat.id, cat.name)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Categories;