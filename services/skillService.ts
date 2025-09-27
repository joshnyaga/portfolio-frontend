import { api } from '@/lib/types/api/client';
import { Skill } from '@/lib/types';


export interface CreateSkillData {
  name: string;
  category: "frontend" | "backend" | "tools" | "languages";
  level: 1 | 2 | 3 | 4 | 5;
  order: number;
  icon?: File;
}

export const skillService = {
  async getAll(): Promise<Skill[]> {
    return await api.get<Skill[]>("/skills");
  },

  async getById(id: string): Promise<Skill> {
    return await api.get<Skill>(`/skills/${id}`);
  },

  async create(data: CreateSkillData): Promise<Skill> {
    if (data.icon) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      formData.append("level", data.level.toString());
      formData.append("order", data.order.toString());
      formData.append("icon", data.icon);

      return await api.postFormData<Skill>("/skills", formData);
    } else {
      const { icon, ...submitData } = data;
      return await api.post<Skill>("/skills", submitData);
    }
  },

  async update(id: string, data: Partial<CreateSkillData>): Promise<Skill> {
    if (data.icon) {
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.category) formData.append("category", data.category);
      if (data.level) formData.append("level", data.level.toString());
      if (data.order !== undefined)
        formData.append("order", data.order.toString());
      formData.append("icon", data.icon);

      return await api.putFormData<Skill>(`/skills/${id}`, formData);
    } else {
      const { icon, ...submitData } = data;
      return await api.put<Skill>(`/skills/${id}`, submitData);
    }
  },

  async delete(id: string): Promise<void> {
    await api.delete<void>(`/skills/${id}`);
  },
};