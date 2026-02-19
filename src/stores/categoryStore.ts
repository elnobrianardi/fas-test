import { create } from 'zustand';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  isFetching: boolean;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const API_URL = "http://localhost:5000/categories";

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,
  isFetching: false,

  fetchCategories: async () => {
    set({ isFetching: true }); // PAKAI INI UNTUK TABEL
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      set({ categories: data });
    } finally {
      set({ isFetching: false });
    }
  },

  addCategory: async (name) => {
    set({ isLoading: true }); // PAKAI INI UNTUK TOMBOL
    await sleep(1000); // Jeda biar spinner kelihatan pro
    
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          slug: name.toLowerCase().replace(/\s+/g, '-') 
        }),
      });

      if (response.ok) {
        const newData = await response.json();
        // JANGAN panggil fetchCategories() lagi. 
        // Langsung selipkan data baru ke array biar tabel gak kedip.
        set((state) => ({ 
          categories: [...state.categories, newData] 
        }));
      }
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCategory: async (id) => {
    set({ isLoading: true });
    await sleep(800);
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));