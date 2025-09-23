import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API client methods
export const api = {
  get: async <T>(url: string): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.get(url);
    return response.data;
  },

  post: async <T>(url: string, data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, data);
    return response.data;
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, data);
    return response.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.delete(url);
    return response.data;
  },

  postFormData: async <T>(url: string, formData: FormData): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  putFormData: async <T>(url: string, formData: FormData): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default apiClient;
