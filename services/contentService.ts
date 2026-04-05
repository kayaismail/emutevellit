import { Post, Category } from '../types';

const API_URL = '/api';

export const postService = {
  getAll: async (): Promise<Post[]> => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch posts');
      }
      return response.json();
    } catch (error: any) {
      console.error(error);
      return [];
    }
  },
  getBySlug: async (slug: string): Promise<Post | undefined> => {
    try {
      const response = await fetch(`${API_URL}/posts/${slug}`);
      if (response.status === 404) return undefined;
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to fetch post');
      }
      return response.json();
    } catch (error: any) {
      console.error(error);
      return undefined;
    }
  },
  getByCategory: async (category: Category): Promise<Post[]> => {
    const posts = await postService.getAll();
    return posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
  },
  
  // Admin Methods
  login: async (username: string, password: string): Promise<{ token: string; user: any }> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Invalid credentials');
    localStorage.setItem('admin_token', data.token);
    return data;
  },
  
  create: async (postData: Partial<Post>): Promise<Post> => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to create post');
    return data;
  },
  
  uploadImage: async (file: File): Promise<string> => {
    const token = localStorage.getItem('admin_token');
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to upload image');
    return data.url;
  },
  
  update: async (id: string, postData: Partial<Post>): Promise<Post> => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to update post');
    return data;
  },
  
  delete: async (id: string): Promise<void> => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { 
        'Authorization': `Bearer ${token}`
      },
    });
    if (!response.ok) {
       const data = await response.json();
       throw new Error(data.error || 'Failed to delete post');
    }
  },
  
  logout: () => {
    localStorage.removeItem('admin_token');
  },
  
  isLoggedIn: () => {
    return !!localStorage.getItem('admin_token');
  }
};
