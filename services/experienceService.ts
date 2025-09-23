import { api } from '@/lib/types/api/client';
import { Experience } from '@/lib/types';

export const experienceService = {
  getAll: () => api.get<Experience[]>('/experience'),
  
  create: (data: Omit<Experience, '_id'>) => api.post<Experience>('/experience', data),
  
  update: (id: string, data: Partial<Experience>) => api.put<Experience>(`/experience/${id}`, data),
  
  delete: (id: string) => api.delete(`/experience/${id}`),
};