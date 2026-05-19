import api from './client.js';

export interface Specialist {
  id: number;
  userId: number;
  bio: string | null;
  specialization: string;
  avatarUrl: string | null;
  isVerified: boolean;
}

export const specialistsApi = {
  getAll: (specialization?: string) =>
    api.get<Specialist[]>('/specialists', { params: { specialization } }),

  getById: (id: number) =>
    api.get<Specialist>(`/specialists/${id}`),

  create: (data: { bio?: string; specialization: string; avatarUrl?: string }) =>
    api.post<Specialist>('/specialists', data),

  getMe: () =>
    api.get<Specialist>('/specialists/me'),

  update: (id: number, data: Partial<{ bio: string; specialization: string; avatarUrl: string }>) =>
    api.put<Specialist>(`/specialists/${id}`, data),
};
