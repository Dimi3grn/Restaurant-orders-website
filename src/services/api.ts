import type { User, Recipe, OrderType as Order, OrderStatus } from '../types';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001') + '/api';
const UPLOADS_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Simple cache with TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL = 30 * 1000; // 30 seconds

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

function invalidateCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
  } else {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  }
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Load token from localStorage on init
    this.token = localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    useCache = false
  ): Promise<T> {
    // Check cache for GET requests
    const cacheKey = `${endpoint}`;
    if (useCache && (!options.method || options.method === 'GET')) {
      const cached = getCached<T>(cacheKey);
      if (cached) return cached;
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    const data = await response.json();

    // Cache GET responses
    if (useCache && (!options.method || options.method === 'GET')) {
      setCache(cacheKey, data);
    }

    return data;
  }

  // Helper to get full image URL
  getImageUrl(imageUrl: string): string {
    if (!imageUrl) return '';
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    // If it's a local upload path, prepend the server URL
    return `${UPLOADS_BASE_URL}${imageUrl}`;
  }

  // --- Auth ---

  async login(email: string, password: string): Promise<User> {
    const data = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('app_current_user', JSON.stringify(data.user));
    
    return data.user;
  }

  async register(user: Omit<User, 'id'>): Promise<User> {
    const data = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(user),
    });
    
    this.token = data.token;
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('app_current_user', JSON.stringify(data.user));
    
    return data.user;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore errors on logout
    }
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('app_current_user');
    invalidateCache(); // Clear all cache on logout
  }

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem('app_current_user');
      return data ? JSON.parse(data) : null;
    } catch {
      localStorage.removeItem('app_current_user');
      return null;
    }
  }

  // --- Recipes ---

  async getAllRecipes(query?: string, cuisine?: string): Promise<Recipe[]> {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (cuisine) params.append('cuisine', cuisine);
    
    const queryString = params.toString();
    const endpoint = `/recipes${queryString ? `?${queryString}` : ''}`;
    
    // Use cache for the main recipes list (no search query)
    return this.request<Recipe[]>(endpoint, {}, !query && !cuisine);
  }

  async getRecipeById(id: string): Promise<Recipe | undefined> {
    try {
      return await this.request<Recipe>(`/recipes/${id}`, {}, true);
    } catch {
      return undefined;
    }
  }

  async createRecipe(recipe: Omit<Recipe, 'id'>): Promise<Recipe> {
    const result = await this.request<Recipe>('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipe),
    });
    invalidateCache('/recipes'); // Invalidate recipes cache
    return result;
  }

  async updateRecipe(id: string, updates: Partial<Recipe>): Promise<Recipe> {
    const result = await this.request<Recipe>(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    invalidateCache('/recipes'); // Invalidate recipes cache
    return result;
  }

  async deleteRecipe(id: string): Promise<void> {
    await this.request(`/recipes/${id}`, { method: 'DELETE' });
    invalidateCache('/recipes'); // Invalidate recipes cache
  }

  // --- Orders ---

  async createOrder(_userId: string, items: { recipeId: string; quantity: number }[]): Promise<Order> {
    const result = await this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
    invalidateCache('/orders'); // Invalidate orders cache
    return result;
  }

  async getOrdersByUser(_userId: string): Promise<Order[]> {
    return this.request<Order[]>('/orders', {}, true);
  }

  async getAllOrders(): Promise<Order[]> {
    return this.request<Order[]>('/orders/all', {}, true);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const result = await this.request<Order>(`/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    invalidateCache('/orders'); // Invalidate orders cache
    return result;
  }

  // --- Upload ---

  async uploadImage(file: File): Promise<{ imageUrl: string; filename: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }
}

export const api = new ApiService();
