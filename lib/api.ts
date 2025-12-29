const API_BASE_URL = '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Include cookies in requests
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        // If response is not JSON, return error
        return {
          success: false,
          message: `Server error: ${response.status} ${response.statusText}`,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Request failed',
        };
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Network error. Please check your connection.',
      };
    }
  }

  setToken(token: string | null) {
    // Token is now stored in HTTP-only cookie, no client-side storage needed
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ user: any }>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
  

  async getMe() {
    return this.request<any>('/auth/me');
  }

  async logout() {
    this.setToken(null);
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Brands
  async getBrands(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<any[]>('/brands' + query);
  }

  async getBrand(id: string) {
    return this.request<any>(`/brands/${id}`);
  }

  async createBrand(data: any) {
    return this.request<any>('/brands', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBrand(id: string, data: any) {
    return this.request<any>(`/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBrand(id: string) {
    return this.request(`/brands/${id}`, { method: 'DELETE' });
  }

  // Testimonials
  async getTestimonials() {
    return this.request<any[]>('/testimonials');
  }

  async createTestimonial(data: any) {
    return this.request<any>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTestimonial(id: string, data: any) {
    return this.request<any>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTestimonial(id: string) {
    return this.request(`/testimonials/${id}`, { method: 'DELETE' });
  }

  // Banners
  async getBanners(type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.request<any[]>('/banners' + query);
  }

  async createBanner(data: any) {
    return this.request<any>('/banners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBanner(id: string, data: any) {
    return this.request<any>(`/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBanner(id: string) {
    return this.request(`/banners/${id}`, { method: 'DELETE' });
  }

  // Clients
  async getClients() {
    return this.request<any[]>('/clients');
  }

  async createClient(data: any) {
    return this.request<any>('/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClient(id: string, data: any) {
    return this.request<any>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClient(id: string) {
    return this.request(`/clients/${id}`, { method: 'DELETE' });
  }

  // Media
  async uploadMedia(file: File, folder?: string, tags?: string, description?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    if (tags) formData.append('tags', tags);
    if (description) formData.append('description', description);

    const url = `${this.baseUrl}/media/upload`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }

  async getMedia(params?: { type?: string; folder?: string; tag?: string; page?: number; limit?: number }) {
    const query = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request<any[]>('/media' + query);
  }

  async deleteMedia(id: string) {
    return this.request(`/media/${id}`, { method: 'DELETE' });
  }

  // Enquiries
  async submitEnquiry(data: { name: string; email: string; company?: string; message: string; phone?: string }) {
    return this.request<any>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEnquiries(params?: { status?: string; page?: number; limit?: number }) {
    const query = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request<any[]>('/enquiries' + query);
  }

  async updateEnquiry(id: string, data: { status?: string; notes?: string }) {
    return this.request<any>(`/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEnquiry(id: string) {
    return this.request(`/enquiries/${id}`, { method: 'DELETE' });
  }

  // Homepage
  async getHomepage() {
    return this.request<any>('/homepage');
  }

  async updateHomepage(data: any) {
    return this.request<any>('/homepage', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Admin
  async getStats() {
    return this.request<any>('/admin/stats');
  }
}

export const api = new ApiClient(API_BASE_URL);

