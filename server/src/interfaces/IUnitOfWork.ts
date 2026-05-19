import type { IUserRepository } from './IUserRepository.js';
import type { ISpecialistRepository } from './ISpecialistRepository.js';
import type { IServiceRepository } from './IServiceRepository.js';
import type { IAppointmentRepository } from './IAppointmentRepository.js';
import type { IReviewRepository } from './IReviewRepository.js';

export interface IUnitOfWork {
  users: IUserRepository;
  specialists: ISpecialistRepository;
  services: IServiceRepository;
  appointments: IAppointmentRepository;
  reviews: IReviewRepository;
}
