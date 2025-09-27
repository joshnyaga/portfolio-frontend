import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse, ApiError } from "../api";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// FIXED: Response interceptor with better auth handling
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Handle the API wrapper format
    const apiResponse = response.data;

    // Check if response has the wrapper format
    if (
      typeof apiResponse === "object" &&
      apiResponse !== null &&
      "success" in apiResponse &&
      "data" in apiResponse &&
      "errors" in apiResponse
    ) {
      // If API returned success: false, throw an error
      if (!apiResponse.success) {
        const errors =
          apiResponse.errors.length > 0
            ? apiResponse.errors
            : ["Unknown error occurred"];
        throw new ApiError(errors, response.status);
      }

      // Return the unwrapped data
      return {
        ...response,
        data: apiResponse.data,
      };
    }

    // For non-wrapped responses (like file downloads), return as-is
    return response;
  },
  (error) => {
    // Handle HTTP errors
    if (error.response?.status === 401) {
      // ONLY redirect if we're not already on the login page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Try to extract API wrapper errors from error response
    if (error.response?.data?.errors) {
      const apiError = new ApiError(
        error.response.data.errors,
        error.response.status
      );
      return Promise.reject(apiError);
    }

    // For other errors, create a generic API error
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    const apiError = new ApiError([message], error.response?.status);
    return Promise.reject(apiError);
  }
);

// API client methods
export const api = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.get(url, config);
    return response.data;
  },

  post: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, data, config);
    return response.data;
  },

  put: async <T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.delete(url, config);
    return response.data;
  },

  postFormData: async <T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    });
    return response.data;
  },

  putFormData: async <T>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<T> => {
    const response: AxiosResponse<T> = await apiClient.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      ...config,
    });
    return response.data;
  },

  downloadFile: async (
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> => {
    return await apiClient.get(url, {
      responseType: "blob",
      ...config,
    });
  },

  getImageUrl: (imageId: string): string => {
    return `${API_BASE_URL}/images/image/${imageId}`;
  },
};

export default apiClient;
