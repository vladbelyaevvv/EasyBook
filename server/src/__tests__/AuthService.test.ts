import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../services/AuthService.js';
import type { IUnitOfWork } from '../interfaces/IUnitOfWork.js';
import type { IUserRepository } from '../interfaces/IUserRepository.js';

const mockUserRepo: IUserRepository = {
  findById: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findAll: vi.fn(),
  delete: vi.fn(),
};

const mockUow: IUnitOfWork = {
  users: mockUserRepo,
  specialists: {} as any,
  services: {} as any,
  appointments: {} as any,
  reviews: {} as any,
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    vi.clearAllMocks();
    authService = new AuthService(mockUow);
  });

  describe('register', () => {
    it('should register a new user and return token', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);
      vi.mocked(mockUserRepo.create).mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        name: 'Влад',
        role: 'CLIENT',
        phone: null,
        passwordHash: 'hash',
        createdAt: new Date(),
      });

      const result = await authService.register({
        email: 'test@mail.com',
        password: '123456',
        name: 'Влад',
      });

      expect(result.token).toBeDefined();
      expect(result.user.email).toBe('test@mail.com');
      expect(mockUserRepo.create).toHaveBeenCalledOnce();
    });

    it('should throw if email already exists', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue({
        id: 1,
        email: 'test@mail.com',
        name: 'Влад',
        role: 'CLIENT',
        phone: null,
        passwordHash: 'hash',
        createdAt: new Date(),
      });

      await expect(
        authService.register({ email: 'test@mail.com', password: '123456', name: 'Влад' })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    it('should throw if user not found', async () => {
      vi.mocked(mockUserRepo.findByEmail).mockResolvedValue(null);

      await expect(
        authService.login({ email: 'wrong@mail.com', password: '123456' })
      ).rejects.toThrow('Invalid email or password');
    });
  });
});
