import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService.js';
import { UnitOfWork } from '../repositories/UnitOfWork.js';

const authService = new AuthService(new UnitOfWork());

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};