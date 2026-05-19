import type { IUnitOfWork } from '../interfaces/IUnitOfWork.js';
import type { CreateAppointmentDto, UpdateAppointmentStatusDto } from '../dto/appointment.dto.js';

export class AppointmentService {
  constructor(private uow: IUnitOfWork) {}

  async getMyAppointments(userId: number, role: string) {
    if (role === 'SPECIALIST') {
      const specialist = await this.uow.specialists.findByUserId(userId);
      if (!specialist) throw new Error('Specialist profile not found');
      return this.uow.appointments.findBySpecialistId(specialist.id);
    }
    return this.uow.appointments.findByClientId(userId);
  }

  async create(clientId: number, dto: CreateAppointmentDto) {
    const specialist = await this.uow.specialists.findById(dto.specialistId);
    if (!specialist) throw new Error('Specialist not found');
    if (specialist.userId === clientId) {
      throw new Error('Specialist cannot book themselves');
    }

    const conflict = await this.uow.appointments.findConflict(
      dto.specialistId,
      dto.date,
      dto.timeSlot
    );
    if (conflict) throw new Error('This time slot is already booked');

    return this.uow.appointments.create(clientId, dto);
  }

  async updateStatus(id: number, userId: number, role: string, dto: UpdateAppointmentStatusDto) {
    const appointment = await this.uow.appointments.findById(id);
    if (!appointment) throw new Error('Appointment not found');

    if (role === 'SPECIALIST') {
      const specialist = await this.uow.specialists.findByUserId(userId);
      if (!specialist || appointment.specialistId !== specialist.id) {
        throw new Error('Forbidden');
      }
    } else if (role === 'CLIENT' && appointment.clientId !== userId) {
      throw new Error('Forbidden');
    }

    return this.uow.appointments.updateStatus(id, dto.status);
  }

  async cancel(id: number, userId: number) {
    const appointment = await this.uow.appointments.findById(id);
    if (!appointment) throw new Error('Appointment not found');
    if (appointment.clientId !== userId) throw new Error('Forbidden');

    const appointmentTime = new Date(appointment.date);
    const [hours, minutes] = appointment.timeSlot.split(':').map(Number);
    appointmentTime.setHours(hours, minutes);

    const twoHoursBefore = new Date(appointmentTime.getTime() - 2 * 60 * 60 * 1000);
    if (new Date() > twoHoursBefore) {
      throw new Error('Cannot cancel less than 2 hours before appointment');
    }

    return this.uow.appointments.updateStatus(id, 'CANCELLED');
  }
}
