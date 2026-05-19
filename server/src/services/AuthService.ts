import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { IUnitOfWork } from '../interfaces/IUnitOfWork.js';
import type { RegisterDto, LoginDto } from '../dto/auth.dto.js';

export class AuthService {
  constructor(private uow: IUnitOfWork) {}

  async register(dto: RegisterDto) {
    const existing = await this.uow.users.findByEmail(dto.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.uow.users.create({ ...dto, passwordHash });

    const token = this.generateToken(user.id, user.role);
    return { token, user: this.sanitizeUser(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.uow.users.findByEmail(dto.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user.id, user.role);
    return { token, user: this.sanitizeUser(user) };
  }

  private generateToken(userId: number, role: string) {
    return jwt.sign(
      { userId, role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN ?? '7d' } as jwt.SignOptions
    );
  }

  private sanitizeUser(user: { id: number; email: string; name: string; role: string; phone: string | null }) {
    const { id, email, name, role, phone } = user;
    return { id, email, name, role, phone };
  }
}
