import { api } from '@/lib/types/api/client';
import { Project } from '@/lib/types';

export const projectService = {
  getAll: () => api.get<Project[]>('/projects'),
  
  getById: (id: string) => api.get<Project>(`/projects/${id}`),
  
  create: (formData: FormData) => api.postFormData<Project>('/projects', formData),
  
  update: (id: string, formData: FormData) => api.putFormData<Project>(`/projects/${id}`, formData),
  
  delete: (id: string) => api.delete(`/projects/${id}`),
};