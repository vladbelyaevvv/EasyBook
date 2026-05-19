import type { Review } from '@prisma/client';
import type { IReviewRepository } from '../interfaces/IReviewRepository.js';
import type { CreateReviewDto } from '../dto/review.dto.js';
import prisma from '../prisma/client.js';

export class ReviewRepository implements IReviewRepository {
  async findById(id: number): Promise<Review | null> {
    return prisma.review.findUnique({ where: { id } });
  }

  async findBySpecialistId(specialistId: number) {
    return prisma.review.findMany({
      where: { specialistId },
      include: { client: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByAppointmentId(appointmentId: number): Promise<Review | null> {
    return prisma.review.findUnique({ where: { appointmentId } });
  }

  async create(clientId: number, data: CreateReviewDto): Promise<Review> {
    return prisma.review.create({
      data: {
        clientId,
        specialistId: data.specialistId,
        appointmentId: data.appointmentId,
        rating: data.rating,
        comment: data.comment,
      },
    });
  }

  async delete(id: number): Promise<void> {
    await prisma.review.delete({ where: { id } });
  }
}
