import api from './client.js';

export interface Service {
  id: number;
  specialistId: number;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
}

export const servicesApi = {
  getBySpecialist: (specialistId: number) =>
    api.get<Service[]>(`/specialists/${specialistId}/services`),

  create: (data: { name: string; description?: string; price: number; durationMinutes: number }) =>
    api.post<Service>('/services', data),

  update: (id: number, data: Partial<{ name: string; description: string; price: number; durationMinutes: number }>) =>
    api.put<Service>(`/services/${id}`, data),

  delete: (id: number) =>
    api.delete(`/services/${id}`),
};
