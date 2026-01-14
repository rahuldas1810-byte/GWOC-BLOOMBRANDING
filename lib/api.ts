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

  async forgotPassword(email: string) {
    return this.request('/admin/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOtp(email: string, otp: string) {
    return this.request<{ resetToken: string }>('/admin/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async validateResetToken(token: string) {
    return this.request('/admin/auth/validate-reset-token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request('/admin/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async getMe() {
    return this.request<any>('/admin/auth/me');
  }

  async logout() {
    this.setToken(null);
    return this.request('/admin/auth/logout', { method: 'POST' });
  }

  // Brands (Admin)
  async getBrands(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<any[]>('/admin/brands' + query);
  }

  async getBrand(id: string) {
    return this.request<any>(`/admin/brands/${id}`);
  }

  async createBrand(data: any) {
    return this.request<any>('/admin/brands', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBrand(id: string, data: any) {
    return this.request<any>(`/admin/brands/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBrand(id: string) {
    return this.request(`/admin/brands/${id}`, { method: 'DELETE' });
  }

  // Testimonials (Admin)
  async getTestimonials() {
    return this.request<any[]>('/admin/testimonials');
  }

  async createTestimonial(data: any) {
    return this.request<any>('/admin/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTestimonial(id: string, data: any) {
    return this.request<any>(`/admin/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTestimonial(id: string) {
    return this.request(`/admin/testimonials/${id}`, { method: 'DELETE' });
  }

  // Banners (Admin)
  async getBanners(type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.request<any[]>('/admin/banners' + query);
  }

  async createBanner(data: any) {
    return this.request<any>('/admin/banners', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBanner(id: string, data: any) {
    return this.request<any>(`/admin/banners/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBanner(id: string) {
    return this.request(`/admin/banners/${id}`, { method: 'DELETE' });
  }

  // Clients (Admin)
  async getClients() {
    return this.request<any[]>('/admin/clients');
  }

  async createClient(data: any) {
    return this.request<any>('/admin/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClient(id: string, data: any) {
    return this.request<any>(`/admin/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClient(id: string) {
    return this.request(`/admin/clients/${id}`, { method: 'DELETE' });
  }

  // Sectors (Admin)
  async getSectors() {
    return this.request<any[]>('/admin/sectors');
  }

  async getSector(id: string) {
    return this.request<any>(`/admin/sectors/${id}`);
  }

  async createSector(data: any) {
    return this.request<any>('/admin/sectors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSector(id: string, data: any) {
    return this.request<any>(`/admin/sectors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSector(id: string) {
    return this.request(`/admin/sectors/${id}`, { method: 'DELETE' });
  }

  // Media (Admin)
  async uploadMedia(file: File, folder?: string, tags?: string, altText?: string, usedIn?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    if (tags) formData.append('tags', tags);
    if (altText) formData.append('altText', altText);
    if (usedIn) formData.append('usedIn', usedIn);

    const url = `${this.baseUrl}/admin/media/upload`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      // Check content type before parsing JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Non-JSON response from upload API:', text.substring(0, 200));
        throw new Error('Server returned invalid response. Please check your authentication.');
      }

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

  async getMedia(params?: { type?: string; usedIn?: string; page?: number; limit?: number }) {
    const query = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request<any[]>('/admin/media' + query);
  }

  async deleteMedia(id: string) {
    return this.request(`/admin/media/${id}`, { method: 'DELETE' });
  }

  // Enquiries
  async submitEnquiry(data: { name: string; email: string; company?: string; message: string; phone?: string }) {
    return this.request<any>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Enquiries (Admin)
  async getEnquiries(params?: { status?: string; page?: number; limit?: number }) {
    const query = params
      ? '?' + new URLSearchParams(params as any).toString()
      : '';
    return this.request<any[]>('/admin/enquiries' + query);
  }

  async updateEnquiry(id: string, data: { status?: string; notes?: string }) {
    return this.request<any>(`/admin/enquiries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEnquiry(id: string) {
    return this.request(`/admin/enquiries/${id}`, { method: 'DELETE' });
  }

  // Homepage (Admin)
  async getHomepage() {
    return this.request<any>('/admin/homepage');
  }

  async updateHomepage(data: any) {
    return this.request<any>('/admin/homepage', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Admin
  async getStats() {
    return this.request<any>('/admin/stats');
  }

  // Services (Admin)
  async getServices() {
    return this.request<any[]>('/admin/services');
  }

  async getService(id: string) {
    return this.request<any>(`/admin/services/${id}`);
  }

  async createService(data: any) {
    return this.request<any>('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateService(id: string, data: any) {
    return this.request<any>(`/admin/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteService(id: string) {
    return this.request(`/admin/services/${id}`, { method: 'DELETE' });
  }

  // Services Page Content (Admin)
  async getServicesPage() {
    return this.request<any>('/admin/services-page');
  }

  async updateServicesPage(data: any) {
    return this.request<any>('/admin/services-page', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Our Story (Admin)
  async getOurStory() {
    return this.request<any>('/admin/our-story');
  }

  async updateOurStory(data: any) {
    return this.request<any>('/admin/our-story', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Contact (Admin)
  async getContact() {
    return this.request<any>('/admin/contact');
  }

  async updateContact(data: any) {
    return this.request<any>('/admin/contact', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Site Settings (Admin)
  async getSiteSettings() {
    return this.request<any>('/admin/site-settings');
  }

  async updateSiteSettings(data: any) {
    return this.request<any>('/admin/site-settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  // Newsletter (Admin)
  async getNewsletterSubscribers() {
    return this.request<any[]>('/newsletter/subscribe');
  }

  async sendNewsletterUpdate(data: { subject: string; message: string }) {
    return this.request<any>('/newsletter/send', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async manageSubscriber(email: string, action: 'deactivate' | 'reactivate') {
    return this.request<any>('/newsletter/manage', {
      method: 'PATCH',
      body: JSON.stringify({ email, action }),
    });
  }
}

export const api = new ApiClient(API_BASE_URL);

