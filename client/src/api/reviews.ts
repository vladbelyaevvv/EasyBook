import api from './client.js';

export interface Review {
  id: number;
  clientId: number;
  specialistId: number;
  appointmentId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  client: { name: string };
}

export const reviewsApi = {
  getBySpecialist: (specialistId: number) =>
    api.get<Review[]>(`/specialists/${specialistId}/reviews`),

  create: (data: { specialistId: number; appointmentId: number; rating: number; comment?: string }) =>
    api.post<Review>('/reviews', data),

  delete: (id: number) =>
    api.delete(`/reviews/${id}`),
};
