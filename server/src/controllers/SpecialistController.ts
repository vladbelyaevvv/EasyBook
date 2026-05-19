import type { Request, Response } from 'express';
import { SpecialistService } from '../services/SpecialistService.js';
import { UnitOfWork } from '../repositories/UnitOfWork.js';

const specialistService = new SpecialistService(new UnitOfWork());

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { specialization } = req.query as { specialization?: string };
    const specialists = await specialistService.getAll(specialization);
    res.json(specialists);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const specialist = await specialistService.getById(Number(req.params.id));
    res.json(specialist);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const specialist = await specialistService.create(req.user!.userId, req.body);
    res.status(201).json(specialist);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const specialist = await specialistService.getByUserId(req.user!.userId);
    res.json(specialist);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const specialist = await specialistService.update(
      Number(req.params.id),
      req.user!.userId,
      req.body
    );
    res.json(specialist);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
