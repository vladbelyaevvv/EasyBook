import type { User, Role } from '@prisma/client';
import type { RegisterDto } from '../dto/auth.dto.js';

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: RegisterDto & { passwordHash: string; role?: Role }): Promise<User>;
  update(id: number, data: Partial<User>): Promise<User>;
  findAll(): Promise<User[]>;
  delete(id: number): Promise<void>;
}
