import type { Request, Response } from 'express';
import { ReviewService } from '../services/ReviewService.js';
import { UnitOfWork } from '../repositories/UnitOfWork.js';

const reviewService = new ReviewService(new UnitOfWork());

export const getBySpecialist = async (req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await reviewService.getBySpecialistId(Number(req.params.id));
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const review = await reviewService.create(req.user!.userId, req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    await reviewService.delete(
      Number(req.params.id),
      req.user!.role === 'ADMIN'
    );
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
