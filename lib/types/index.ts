export interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageId?: string;
  imageUrl?: string;
  projectUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  _id: string;
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'languages';
  level: 1 | 2 | 3 | 4 | 5;
  iconId?: string;
  iconUrl?: string;
  order: number;
}

export interface Experience {
  _id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
  companyUrl?: string;
  order: number;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}




export interface User {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  errors?: string[];
}

// Generic API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  errors: string[];
}

// Type for user validation response
export interface UserValidationResponse {
  success: boolean;
  user: User;
  errors?: string[];
}

// Union types instead of extending interfaces
export type AuthApiResponse = AuthResponse | ApiResponse<AuthResponse>;
export type UserValidationApiResponse =
  | UserValidationResponse
  | ApiResponse<UserValidationResponse>;
