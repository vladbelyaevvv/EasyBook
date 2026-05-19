import type { IUnitOfWork } from '../interfaces/IUnitOfWork.js';
import type { CreateReviewDto } from '../dto/review.dto.js';

export class ReviewService {
  constructor(private uow: IUnitOfWork) {}

  async getBySpecialistId(specialistId: number) {
    return this.uow.reviews.findBySpecialistId(specialistId);
  }

  async create(clientId: number, dto: CreateReviewDto) {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const appointment = await this.uow.appointments.findById(dto.appointmentId);
    if (!appointment) throw new Error('Appointment not found');
    if (appointment.clientId !== clientId) throw new Error('Forbidden');
    if (appointment.status !== 'COMPLETED') {
      throw new Error('Can only review completed appointments');
    }

    const existing = await this.uow.reviews.findByAppointmentId(dto.appointmentId);
    if (existing) throw new Error('Review already exists for this appointment');

    return this.uow.reviews.create(clientId, dto);
  }

  async delete(id: number, isAdmin: boolean) {
    const review = await this.uow.reviews.findById(id);
    if (!review) throw new Error('Review not found');
    if (!isAdmin) throw new Error('Forbidden');
    return this.uow.reviews.delete(id);
  }
}
