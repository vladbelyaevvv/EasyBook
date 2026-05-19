import type { IUnitOfWork } from '../interfaces/IUnitOfWork.js';
import type { CreateSpecialistDto, UpdateSpecialistDto } from '../dto/specialist.dto.js';

export class SpecialistService {
  constructor(private uow: IUnitOfWork) {}

  async getAll(specialization?: string) {
    return this.uow.specialists.findAll(specialization);
  }

  async getById(id: number) {
    const specialist = await this.uow.specialists.findById(id);
    if (!specialist) throw new Error('Specialist not found');
    return specialist;
  }

  async getByUserId(userId: number) {
    const specialist = await this.uow.specialists.findByUserId(userId);
    if (!specialist) throw new Error('Specialist profile not found');
    return specialist;
  }

  async create(userId: number, dto: CreateSpecialistDto) {
    const existing = await this.uow.specialists.findByUserId(userId);
    if (existing) throw new Error('Specialist profile already exists');
    
    const specialist = await this.uow.specialists.create(userId, dto);
    await this.uow.users.update(userId, { role: 'SPECIALIST' });
    return specialist;
    }


  async update(id: number, userId: number, dto: UpdateSpecialistDto) {
    const specialist = await this.uow.specialists.findById(id);
    if (!specialist) throw new Error('Specialist not found');
    if (specialist.userId !== userId) throw new Error('Forbidden');
    return this.uow.specialists.update(id, dto);
  }

  async delete(id: number, userId: number, isAdmin: boolean) {
    const specialist = await this.uow.specialists.findById(id);
    if (!specialist) throw new Error('Specialist not found');
    if (!isAdmin && specialist.userId !== userId) throw new Error('Forbidden');
    return this.uow.specialists.delete(id);
  }
}
