import api from './client.js';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  phone: string | null;
  createdAt: string;
}

export interface AdminSpecialist {
  id: number;
  userId: number;
  bio: string | null;
  specialization: string;
  avatarUrl: string | null;
  isVerified: boolean;
}

export interface AdminService {
  id: number;
  specialistId: number;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
}

export interface AdminAppointment {
  id: number;
  clientId: number;
  specialistId: number;
  serviceId: number;
  date: string;
  timeSlot: string;
  status: string;
  createdAt: string;
}

export interface AdminReview {
  id: number;
  clientId: number;
  specialistId: number;
  appointmentId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export const adminsApi = {
  users: {
    getAll: () => api.get<AdminUser[]>('/admin/users'),
    getById: (id: number) => api.get<AdminUser>(`/admin/users/${id}`),
    update: (id: number, data: Partial<{ name: string; email: string; role: string; phone: string }>) =>
      api.put<AdminUser>(`/admin/users/${id}`, data),
    delete: (id: number) => api.delete(`/admin/users/${id}`),
  },
  specialists: {
    getAll: () => api.get<AdminSpecialist[]>('/admin/specialists'),
    getById: (id: number) => api.get<AdminSpecialist>(`/admin/specialists/${id}`),
    update: (id: number, data: Partial<{ bio: string; specialization: string; avatarUrl: string; isVerified: boolean }>) =>
      api.put<AdminSpecialist>(`/admin/specialists/${id}`, data),
    delete: (id: number) => api.delete(`/admin/specialists/${id}`),
  },
  services: {
    getAll: () => api.get<AdminService[]>('/admin/services'),
    getById: (id: number) => api.get<AdminService>(`/admin/services/${id}`),
    update: (id: number, data: Partial<{ name: string; description: string; price: number; durationMinutes: number }>) =>
      api.put<AdminService>(`/admin/services/${id}`, data),
    delete: (id: number) => api.delete(`/admin/services/${id}`),
  },
  appointments: {
    getAll: () => api.get<AdminAppointment[]>('/admin/appointments'),
    getById: (id: number) => api.get<AdminAppointment>(`/admin/appointments/${id}`),
    update: (id: number, data: { status: string }) =>
      api.put<AdminAppointment>(`/admin/appointments/${id}`, data),
    delete: (id: number) => api.delete(`/admin/appointments/${id}`),
  },
  reviews: {
    getAll: () => api.get<AdminReview[]>('/admin/reviews'),
    delete: (id: number) => api.delete(`/admin/reviews/${id}`),
  },
};
