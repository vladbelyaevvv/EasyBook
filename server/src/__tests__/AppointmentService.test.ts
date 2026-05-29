import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppointmentService } from '../services/AppointmentService.js';
import type { IUnitOfWork } from '../interfaces/IUnitOfWork.js';
import type { IAppointmentRepository } from '../interfaces/IAppointmentRepository.js';
import type { ISpecialistRepository } from '../interfaces/ISpecialistRepository.js';

const mockAppointmentRepo: IAppointmentRepository = {
  findById: vi.fn(),
  findByClientId: vi.fn(),
  findBySpecialistId: vi.fn(),
  findAll: vi.fn(),
  findConflict: vi.fn(),
  create: vi.fn(),
  updateStatus: vi.fn(),
  delete: vi.fn(),
};

const mockSpecialistRepo: ISpecialistRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
};

const mockUow: IUnitOfWork = {
  users: {} as any,
  specialists: mockSpecialistRepo,
  services: {} as any,
  appointments: mockAppointmentRepo,
  reviews: {} as any,
};

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AppointmentService(mockUow);
  });

  describe('create', () => {
    it('should throw if specialist not found', async () => {
      vi.mocked(mockSpecialistRepo.findById).mockResolvedValue(null);

      await expect(
        service.create(1, { specialistId: 99, serviceId: 1, date: '2026-06-01', timeSlot: '10:00' })
      ).rejects.toThrow('Specialist not found');
    });

    it('should throw if specialist tries to book themselves', async () => {
      vi.mocked(mockSpecialistRepo.findById).mockResolvedValue({
        id: 1, userId: 5, bio: null, specialization: 'barber',
        avatarUrl: null, isVerified: true,
      });

      await expect(
        service.create(5, { specialistId: 1, serviceId: 1, date: '2026-06-01', timeSlot: '10:00' })
      ).rejects.toThrow('Specialist cannot book themselves');
    });

    it('should throw if time slot is already taken', async () => {
      vi.mocked(mockSpecialistRepo.findById).mockResolvedValue({
        id: 1, userId: 2, bio: null, specialization: 'barber',
        avatarUrl: null, isVerified: true,
      });
      vi.mocked(mockAppointmentRepo.findConflict).mockResolvedValue({
        id: 10, clientId: 3, specialistId: 1, serviceId: 1,
        date: new Date('2026-06-01'), timeSlot: '10:00',
        status: 'CONFIRMED', createdAt: new Date(),
      });

      await expect(
        service.create(1, { specialistId: 1, serviceId: 1, date: '2026-06-01', timeSlot: '10:00' })
      ).rejects.toThrow('This time slot is already booked');
    });

    it('should create appointment successfully', async () => {
      vi.mocked(mockSpecialistRepo.findById).mockResolvedValue({
        id: 1, userId: 2, bio: null, specialization: 'barber',
        avatarUrl: null, isVerified: true,
      });
      vi.mocked(mockAppointmentRepo.findConflict).mockResolvedValue(null);
      vi.mocked(mockAppointmentRepo.create).mockResolvedValue({
        id: 1, clientId: 1, specialistId: 1, serviceId: 1,
        date: new Date('2026-06-01'), timeSlot: '10:00',
        status: 'PENDING', createdAt: new Date(),
      });

      const result = await service.create(1, {
        specialistId: 1, serviceId: 1, date: '2026-06-01', timeSlot: '10:00',
      });

      expect(result.status).toBe('PENDING');
      expect(mockAppointmentRepo.create).toHaveBeenCalledOnce();
    });
  });

  describe('cancel', () => {
    it('should throw if client tries to cancel someone else appointment', async () => {
      vi.mocked(mockAppointmentRepo.findById).mockResolvedValue({
        id: 1, clientId: 99, specialistId: 1, serviceId: 1,
        date: new Date('2026-06-01'), timeSlot: '10:00',
        status: 'CONFIRMED', createdAt: new Date(),
      });

      await expect(service.cancel(1, 1)).rejects.toThrow('Forbidden');
    });
  });
});
