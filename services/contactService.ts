import { api } from '@/lib/types/api/client';
import { ContactMessage } from '@/lib/types';

export const contactService = {
  getAll: () => api.get<ContactMessage[]>("/contact"),

  create: (data: { name: string; email: string; message: string }) =>
    api.post("/contact", data),

  async markAsRead(id: string, read: boolean): Promise<ContactMessage> {
    return await api.put<ContactMessage>(`/contact/${id}`, { read });
  },

  delete: (id: string) => api.delete(`/contact/${id}`),
};