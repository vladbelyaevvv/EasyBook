import type { Review } from '@prisma/client';
import type { CreateReviewDto } from '../dto/review.dto.js';

export interface IReviewRepository {
  findById(id: number): Promise<Review | null>;
  findBySpecialistId(specialistId: number): Promise<Review[]>;
  findByAppointmentId(appointmentId: number): Promise<Review | null>;
  findAll(): Promise<Review[]>;
  create(clientId: number, data: CreateReviewDto): Promise<Review>;
  delete(id: number): Promise<void>;
}
