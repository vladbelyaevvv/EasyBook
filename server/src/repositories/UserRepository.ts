import type { User, Role } from '@prisma/client';
import type { IUserRepository } from '../interfaces/IUserRepository.js';
import type { RegisterDto } from '../dto/auth.dto.js';
import prisma from '../prisma/client.js';

export class UserRepository implements IUserRepository {
  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: RegisterDto & { passwordHash: string; role?: Role }): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        phone: data.phone,
        role: data.role ?? 'CLIENT',
      },
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
