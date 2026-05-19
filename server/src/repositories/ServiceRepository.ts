import type { Service } from '@prisma/client';
import type { IServiceRepository } from '../interfaces/IServiceRepository.js';
import type { CreateServiceDto, UpdateServiceDto } from '../dto/service.dto.js';
import prisma from '../prisma/client.js';

export class ServiceRepository implements IServiceRepository {
  async findById(id: number): Promise<Service | null> {
    return prisma.service.findUnique({ where: { id } });
  }

  async findBySpecialistId(specialistId: number): Promise<Service[]> {
    return prisma.service.findMany({ where: { specialistId } });
  }

  async create(specialistId: number, data: CreateServiceDto): Promise<Service> {
    return prisma.service.create({
      data: { specialistId, ...data },
    });
  }

  async update(id: number, data: UpdateServiceDto): Promise<Service> {
    return prisma.service.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await prisma.service.delete({ where: { id } });
  }
}
