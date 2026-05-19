import { AppointmentStatus } from '@prisma/client';

export interface CreateAppointmentDto {
  specialistId: number;
  serviceId: number;
  date: string;
  timeSlot: string;
}

export interface UpdateAppointmentStatusDto {
  status: AppointmentStatus;
}
