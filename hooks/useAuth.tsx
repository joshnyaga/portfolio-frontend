"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import {
  User,
  AuthResponse,
  ApiResponse,
  AuthApiResponse,
  UserValidationResponse,
  UserValidationApiResponse,
} from "@/lib/types";
import { api } from "@/lib/types/api/client";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Helper function to extract error message from various error formats
function extractErrorMessage(error: any): string {
  // Try different error formats
  
  // 1. API response with errors array
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    return error.response.data.errors[0] || 'Unknown error';
  }
  
  // 2. API response with single error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  // 3. API response with error field
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  // 4. Wrapped API response
  if (error.response?.data?.success === false && error.response?.data?.errors) {
    if (Array.isArray(error.response.data.errors)) {
      return error.response.data.errors[0] || 'Unknown error';
    }
    return error.response.data.errors;
  }
  
  // 5. Direct error object
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors[0] || 'Unknown error';
  }
  
  // 6. Error message
  if (error.message) {
    return error.message;
  }
  
  // 7. Fallback
  return 'Login failed';
}

// Type guard to check if response is wrapped
function isWrappedApiResponse<T>(response: any): response is ApiResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    'data' in response &&
    'errors' in response
  );
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        console.log("🔐 AuthProvider login called");
        setError(null);

        const response = await api.post<AuthApiResponse>("/auth/login", {
          email,
          password,
        });

        console.log("📥 Login response:", response);

        let authData: AuthResponse;

        // Check if response is wrapped API response
        if (isWrappedApiResponse<AuthResponse>(response)) {
          if (!response.success) {
            const errorMsg =
              response.errors?.length > 0 ? response.errors[0] : "Login failed";
            throw new Error(errorMsg);
          }
          if (!response.data) {
            throw new Error("No data in response");
          }
          authData = response.data;
        } else {
          // Direct AuthResponse
          authData = response as AuthResponse;

          // Check if direct response has success field
          if ("success" in authData && !authData.success) {
            
            const errorMsg =
              authData.errors?.length  ? authData.errors[0] : "Login failed";
            throw new Error(errorMsg);
          }
        }

        // Validate auth data
        if (authData && authData.user && authData.token) {
          setUser(authData.user);
          setToken(authData.token);
          localStorage.setItem("token", authData.token);
          console.log("✅ AuthProvider login successful");
        } else {
          console.error("❌ Invalid response format:", authData);
          throw new Error("Invalid response format - missing user or token");
        }
      } catch (error: any) {
        console.error("❌ AuthProvider login error:", error);

        // Extract proper error message
        const errorMessage = extractErrorMessage(error);
        setError(errorMessage);

        // Create a new error with the extracted message for the component
        throw new Error(errorMessage);
      }
    },
    []
  );

  const logout = useCallback((): void => {
    console.log("🚪 AuthProvider logout called");
    setUser(null);
    setToken(null);
    setError(null);
    localStorage.removeItem("token");
  }, []);

  // Initialize auth
  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      try {
        console.log("🔄 AuthProvider initializing...");
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
          console.log("🎫 Found stored token, validating...");
          try {
            const response = await api.get<UserValidationApiResponse>(
              "/auth/me"
            );

            let userData: UserValidationResponse;

            // Check if response is wrapped API response
            if (isWrappedApiResponse<UserValidationResponse>(response)) {
              if (!response.success) {
                throw new Error(
                  response.errors.join(", ") || "Token validation failed"
                );
              }
              if (!response.data) {
                throw new Error("No data in validation response");
              }
              userData = response.data;
            } else {
              // Direct UserValidationResponse
              userData = response as UserValidationResponse;
            }

            if (userData && userData.user) {
              setUser(userData.user);
              setToken(storedToken);
              console.log("✅ Token validated, user restored");
            } else {
              throw new Error("Invalid user data");
            }
          } catch (error) {
            console.log("❌ Token validation failed, removing token");
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
          }
        } else {
          console.log("ℹ️ No stored token found");
        }
      } catch (error) {
        console.error("❌ Auth initialization error:", error);
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
        console.log("🏁 Auth initialization complete");
      }
    };

    initAuth();
  }, []);

  const isAuthenticated = useMemo(() => !!user && !!token, [user, token]);
  const isAdmin = useMemo(() => user?.role === "admin", [user?.role]);

  const value = useMemo(
    (): AuthContextType => ({
      user,
      token,
      loading,
      login,
      logout,
      isAuthenticated,
      isAdmin,
    }),
    [user, token, loading, login, logout, isAuthenticated, isAdmin]
  );

  if (hasError) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700">
        <h2>AuthProvider Error</h2>
        <p>{error}</p>
        <button
          onClick={() => {
            setHasError(false);
            setError(null);
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
          }}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
        >
          Reset Auth
        </button>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
