import type { Specialist } from '@prisma/client';
import type { ISpecialistRepository } from '../interfaces/ISpecialistRepository.js';
import type { CreateSpecialistDto, UpdateSpecialistDto } from '../dto/specialist.dto.js';
import prisma from '../prisma/client.js';

export class SpecialistRepository implements ISpecialistRepository {
  async findById(id: number): Promise<Specialist | null> {
    return prisma.specialist.findUnique({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Specialist | null> {
    return prisma.specialist.findUnique({ where: { userId } });
  }

  async findAll(specialization?: string): Promise<Specialist[]> {
    return prisma.specialist.findMany({
      where: specialization ? { specialization } : undefined,
    });
  }

  async create(userId: number, data: CreateSpecialistDto): Promise<Specialist> {
    return prisma.specialist.create({
      data: { userId, ...data },
    });
  }

  async update(id: number, data: UpdateSpecialistDto): Promise<Specialist> {
    return prisma.specialist.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prisma.specialist.delete({ where: { id } });
  }
}
