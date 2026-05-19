import type { Specialist } from '@prisma/client';
import type { CreateSpecialistDto, UpdateSpecialistDto } from '../dto/specialist.dto.js';

export interface ISpecialistRepository {
  findById(id: number): Promise<Specialist | null>;
  findByUserId(userId: number): Promise<Specialist | null>;
  findAll(specialization?: string): Promise<Specialist[]>;
  create(userId: number, data: CreateSpecialistDto): Promise<Specialist>;
  update(id: number, data: UpdateSpecialistDto): Promise<Specialist>;
  delete(id: number): Promise<void>;
}
