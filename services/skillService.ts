import { api } from '@/lib/types/api/client';
import { Skill } from '@/lib/types';

export const skillService = {
  getAll: () => api.get<Skill[]>('/skills'),
  
  create: (formData: FormData) => api.postFormData<Skill>('/skills', formData),
  
  update: (id: string, formData: FormData) => api.putFormData<Skill>(`/skills/${id}`, formData),
  
  delete: (id: string) => api.delete(`/skills/${id}`),
};