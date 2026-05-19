import type { IUnitOfWork } from '../interfaces/IUnitOfWork.js';
import { UserRepository } from './UserRepository.js';
import { SpecialistRepository } from './SpecialistRepository.js';
import { ServiceRepository } from './ServiceRepository.js';
import { AppointmentRepository } from './AppointmentRepository.js';
import { ReviewRepository } from './ReviewRepository.js';

export class UnitOfWork implements IUnitOfWork {
  users = new UserRepository();
  specialists = new SpecialistRepository();
  services = new ServiceRepository();
  appointments = new AppointmentRepository();
  reviews = new ReviewRepository();
}
