import type { IUnitOfWork } from '../interfaces/IUnitOfWork.js';
import type { CreateServiceDto, UpdateServiceDto } from '../dto/service.dto.js';

export class ServiceService {
  constructor(private uow: IUnitOfWork) {}

  async getBySpecialistId(specialistId: number) {
    return this.uow.services.findBySpecialistId(specialistId);
  }

  async create(userId: number, dto: CreateServiceDto) {
    const specialist = await this.uow.specialists.findByUserId(userId);
    if (!specialist) throw new Error('Specialist profile not found');
    return this.uow.services.create(specialist.id, dto);
  }

  async update(id: number, userId: number, dto: UpdateServiceDto) {
    const service = await this.uow.services.findById(id);
    if (!service) throw new Error('Service not found');

    const specialist = await this.uow.specialists.findByUserId(userId);
    if (!specialist || service.specialistId !== specialist.id) {
      throw new Error('Forbidden');
    }

    return this.uow.services.update(id, dto);
  }

  async delete(id: number, userId: number) {
    const service = await this.uow.services.findById(id);
    if (!service) throw new Error('Service not found');

    const specialist = await this.uow.specialists.findByUserId(userId);
    if (!specialist || service.specialistId !== specialist.id) {
      throw new Error('Forbidden');
    }

    return this.uow.services.delete(id);
  }
}
