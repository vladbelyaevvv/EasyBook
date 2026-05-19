import type { Service } from '@prisma/client';
import type { CreateServiceDto, UpdateServiceDto } from '../dto/service.dto.js';

export interface IServiceRepository {
  findById(id: number): Promise<Service | null>;
  findBySpecialistId(specialistId: number): Promise<Service[]>;
  create(specialistId: number, data: CreateServiceDto): Promise<Service>;
  update(id: number, data: UpdateServiceDto): Promise<Service>;
  delete(id: number): Promise<void>;
}
