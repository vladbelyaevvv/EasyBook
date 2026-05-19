import api from './client.js';

export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: number;
  clientId: number;
  specialistId: number;
  serviceId: number;
  date: string;
  timeSlot: string;
  status: AppointmentStatus;
  createdAt: string;
}

export const appointmentsApi = {
  getMy: () =>
    api.get<Appointment[]>('/appointments'),

  create: (data: { specialistId: number; serviceId: number; date: string; timeSlot: string }) =>
    api.post<Appointment>('/appointments', data),

  updateStatus: (id: number, status: AppointmentStatus) =>
    api.put(`/appointments/${id}/status`, { status }),

  cancel: (id: number) =>
    api.delete(`/appointments/${id}`),
};
