import type { Appointment, AppointmentStatus } from '@prisma/client';
import type { CreateAppointmentDto } from '../dto/appointment.dto.js';

export interface IAppointmentRepository {
  findById(id: number): Promise<Appointment | null>;
  findByClientId(clientId: number): Promise<Appointment[]>;
  findBySpecialistId(specialistId: number): Promise<Appointment[]>;
  findAll(): Promise<Appointment[]>;
  findConflict(specialistId: number, date: string, timeSlot: string): Promise<Appointment | null>;
  create(clientId: number, data: CreateAppointmentDto): Promise<Appointment>;
  updateStatus(id: number, status: AppointmentStatus): Promise<Appointment>;
  delete(id: number): Promise<void>;
}
