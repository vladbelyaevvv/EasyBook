import type { Appointment, AppointmentStatus } from '@prisma/client';
import type { IAppointmentRepository } from '../interfaces/IAppointmentRepository.js';
import type { CreateAppointmentDto } from '../dto/appointment.dto.js';
import prisma from '../prisma/client.js';

export class AppointmentRepository implements IAppointmentRepository {
  async findById(id: number): Promise<Appointment | null> {
    return prisma.appointment.findUnique({ where: { id } });
  }

  async findByClientId(clientId: number): Promise<Appointment[]> {
    return prisma.appointment.findMany({ where: { clientId } });
  }

  async findBySpecialistId(specialistId: number): Promise<Appointment[]> {
    return prisma.appointment.findMany({ where: { specialistId } });
  }

  async findAll(): Promise<Appointment[]> {
    return prisma.appointment.findMany();
  }

  async findConflict(
    specialistId: number,
    date: string,
    timeSlot: string
  ): Promise<Appointment | null> {
    return prisma.appointment.findFirst({
      where: {
        specialistId,
        date: new Date(date),
        timeSlot,
        status: { notIn: ['CANCELLED'] },
      },
    });
  }

  async create(clientId: number, data: CreateAppointmentDto): Promise<Appointment> {
    return prisma.appointment.create({
      data: {
        clientId,
        specialistId: data.specialistId,
        serviceId: data.serviceId,
        date: new Date(data.date),
        timeSlot: data.timeSlot,
      },
    });
  }

  async updateStatus(id: number, status: AppointmentStatus): Promise<Appointment> {
    return prisma.appointment.update({ where: { id }, data: { status } });
  }

  async delete(id: number): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  }
}
