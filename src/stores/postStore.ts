import { create } from 'zustand';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId: string;
  createdAt: string;
}

interface PostState {
  posts: Post[];
  isFetching: boolean;
  fetchPosts: () => Promise<void>;
  addPost: (data: Omit<Post, 'id' | 'createdAt'>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
    updatePost: (id: string, data: Partial<Post>) => Promise<void>;
}

const API_URL = "http://localhost:5000/posts"; 

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  isFetching: false,

  fetchPosts: async () => {
    set({ isFetching: true });
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      console.log("Data Fetch Posts:", data);

      set({ posts: Array.isArray(data) ? data : [] });
    } catch (error) {
      console.error("Gagal fetch posts:", error);
      set({ posts: [] });
    } finally {
      set({ isFetching: false });
    }
  },

  addPost: async (newPost) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newPost,
        createdAt: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) throw new Error("Gagal simpan post");
    
    const savedPost = await response.json();
    
    set((state) => ({ posts: [savedPost, ...state.posts] }));
  },

  deletePost: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Gagal hapus post");
    set((state) => ({ posts: state.posts.filter((p) => p.id !== id) }));
  },

updatePost: async (id, data) => {
  await fetch(`http://localhost:5000/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  set((state) => ({
    posts: state.posts.map((p) => (p.id === id ? { ...p, ...data } : p))
  }));
},
}));