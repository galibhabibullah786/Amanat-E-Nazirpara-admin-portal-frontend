import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'amanat_access_token';
const REFRESH_TOKEN_KEY = 'amanat_refresh_token';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookies
});

// Token management
export const tokenManager = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenManager.getRefreshToken();

      if (!refreshToken) {
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        tokenManager.setAccessToken(accessToken);
        if (newRefreshToken) {
          tokenManager.setRefreshToken(newRefreshToken);
        }

        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as Error, null);
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const message = (error.response?.data as { message?: string })?.message || error.message;
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default apiClient;

// ============================================
// API Types
// ============================================

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// ============================================
// AUTH API
// ============================================

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  logout: () => apiClient.post('/auth/logout'),

  refresh: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),

  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) =>
    apiClient.post('/auth/change-password', { currentPassword, newPassword, confirmPassword }),

  getProfile: () => apiClient.get('/auth/me'),
};

// ============================================
// USERS API
// ============================================

export const usersApi = {
  getAll: (params?: PaginationParams) =>
    apiClient.get('/users', { params }),

  getById: (id: number) => apiClient.get(`/users/${id}`),

  create: (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
    phone?: string;
  }) => apiClient.post('/users', data),

  update: (id: number, data: {
    email?: string;
    name?: string;
    role?: string;
    phone?: string;
    isActive?: boolean;
  }) => apiClient.put(`/users/${id}`, data),

  delete: (id: number) => apiClient.delete(`/users/${id}`),

  toggleStatus: (id: number, isActive: boolean) =>
    apiClient.patch(`/users/${id}/status`, { isActive }),
};

// ============================================
// COMMITTEES API
// ============================================

export const committeesApi = {
  getAll: (params?: PaginationParams) =>
    apiClient.get('/committees', { params }),

  getCurrent: () => apiClient.get('/committees/current'),

  getById: (id: number) => apiClient.get(`/committees/${id}`),

  create: (data: {
    name: string;
    term: string;
    description?: string;
    type?: 'past' | 'current';
  }) => apiClient.post('/committees', data),

  update: (id: number, data: {
    name?: string;
    term?: string;
    description?: string;
    type?: 'past' | 'current';
    isActive?: boolean;
  }) => apiClient.put(`/committees/${id}`, data),

  delete: (id: number) => apiClient.delete(`/committees/${id}`),

  // Members
  getMember: (id: number) => apiClient.get(`/committees/members/${id}`),

  createMember: (data: {
    name: string;
    designation: string;
    designationLabel: string;
    committeeId: number;
    phone?: string;
    email?: string;
    bio?: string;
    order?: number;
  }) => apiClient.post('/committees/members', data),

  updateMember: (id: number, data: {
    name?: string;
    designation?: string;
    designationLabel?: string;
    phone?: string;
    email?: string;
    bio?: string;
    order?: number;
  }) => apiClient.put(`/committees/members/${id}`, data),

  deleteMember: (id: number) => apiClient.delete(`/committees/members/${id}`),

  reorderMembers: (committeeId: number, memberOrders: { id: number; order: number }[]) =>
    apiClient.patch(`/committees/${committeeId}/members/reorder`, { memberOrders }),
};

// ============================================
// CONTRIBUTIONS API
// ============================================

export const contributionsApi = {
  getAll: (params?: PaginationParams & { type?: string; status?: string; anonymous?: string }) =>
    apiClient.get('/contributions', { params }),

  getById: (id: number) => apiClient.get(`/contributions/${id}`),

  create: (data: {
    contributorName: string;
    type: 'Cash' | 'Land' | 'Material';
    amount: number;
    date: string;
    anonymous?: boolean;
    purpose?: string;
    notes?: string;
    receiptNumber?: string;
  }) => apiClient.post('/contributions', data),

  update: (id: number, data: Partial<{
    contributorName: string;
    type: 'Cash' | 'Land' | 'Material';
    amount: number;
    date: string;
    anonymous: boolean;
    purpose: string;
    notes: string;
    receiptNumber: string;
  }>) => apiClient.put(`/contributions/${id}`, data),

  updateStatus: (id: number, status: 'pending' | 'verified' | 'rejected', notes?: string) =>
    apiClient.patch(`/contributions/${id}/status`, { status, notes }),

  delete: (id: number) => apiClient.delete(`/contributions/${id}`),

  getStatistics: () => apiClient.get('/contributions/statistics'),

  getMonthlyData: (year?: number) =>
    apiClient.get('/contributions/chart/monthly', { params: { year } }),
};

// ============================================
// LAND DONORS API
// ============================================

export const landDonorsApi = {
  getAll: (params?: PaginationParams & { verified?: string; landType?: string }) =>
    apiClient.get('/land-donors', { params }),

  getById: (id: number) => apiClient.get(`/land-donors/${id}`),

  create: (data: {
    name: string;
    landAmount: number;
    landType: 'Agricultural' | 'Residential';
    location: string;
    date: string;
    quote?: string;
    documentNumber?: string;
    notes?: string;
  }) => apiClient.post('/land-donors', data),

  update: (id: number, data: Partial<{
    name: string;
    landAmount: number;
    landType: 'Agricultural' | 'Residential';
    location: string;
    date: string;
    quote: string;
    documentNumber: string;
    notes: string;
    verified: boolean;
  }>) => apiClient.put(`/land-donors/${id}`, data),

  toggleVerified: (id: number, verified: boolean) =>
    apiClient.patch(`/land-donors/${id}/verify`, { verified }),

  delete: (id: number) => apiClient.delete(`/land-donors/${id}`),

  getStatistics: () => apiClient.get('/land-donors/statistics'),
};

// ============================================
// GALLERY API
// ============================================

export const galleryApi = {
  getAll: (params?: PaginationParams & { category?: string; featured?: string }) =>
    apiClient.get('/gallery', { params }),

  getById: (id: number) => apiClient.get(`/gallery/${id}`),

  getCategories: () => apiClient.get('/gallery/categories'),

  create: (data: {
    url: string;
    category: 'Foundation' | 'Construction' | 'Events' | 'FinalLook' | 'Ceremony';
    alt: string;
    description?: string;
    date?: string;
    featured?: boolean;
    order?: number;
  }) => apiClient.post('/gallery', data),

  update: (id: number, data: Partial<{
    url: string;
    category: 'Foundation' | 'Construction' | 'Events' | 'FinalLook' | 'Ceremony';
    alt: string;
    description: string;
    date: string;
    featured: boolean;
    order: number;
  }>) => apiClient.put(`/gallery/${id}`, data),

  toggleFeatured: (id: number, featured: boolean) =>
    apiClient.patch(`/gallery/${id}/featured`, { featured }),

  delete: (id: number) => apiClient.delete(`/gallery/${id}`),

  reorder: (imageOrders: { id: number; order: number }[]) =>
    apiClient.patch('/gallery/reorder', { imageOrders }),
};

// ============================================
// SETTINGS API
// ============================================

export const settingsApi = {
  get: () => apiClient.get('/settings'),

  update: (data: {
    siteName?: string;
    tagline?: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    facebookUrl?: string;
    youtubeUrl?: string;
    twitterUrl?: string;
    showAnonymousDonors?: boolean;
    enableGallery?: boolean;
  }) => apiClient.put('/settings', data),

  toggleMaintenance: (enabled: boolean) =>
    apiClient.patch('/settings/maintenance', { enabled }),

  updatePrayerTimes: (times: {
    fajr?: string;
    dhuhr?: string;
    asr?: string;
    maghrib?: string;
    isha?: string;
  }) => apiClient.patch('/settings/prayer-times', times),
};

// ============================================
// ACTIVITY API
// ============================================

export const activityApi = {
  getAll: (params?: PaginationParams & { type?: string }) =>
    apiClient.get('/activity', { params }),

  getRecent: (limit?: number) =>
    apiClient.get('/activity/recent', { params: { limit } }),

  cleanup: (days?: number) =>
    apiClient.delete('/activity/cleanup', { params: { days } }),
};

// ============================================
// STATISTICS API
// ============================================

export const statisticsApi = {
  getDashboard: () => apiClient.get('/statistics/dashboard'),

  refresh: () => apiClient.post('/statistics/refresh'),
};

// ============================================
// UPLOAD API
// ============================================

export const uploadApi = {
  uploadGalleryImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/upload/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadMultipleGalleryImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    return apiClient.post('/upload/gallery/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/upload/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadMemberPhoto: (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return apiClient.post('/upload/member', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteFile: (type: string, filename: string) =>
    apiClient.delete(`/upload/${type}/${filename}`),
};
