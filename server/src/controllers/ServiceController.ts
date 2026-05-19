import type { Request, Response } from 'express';
import { ServiceService } from '../services/ServiceService.js';
import { UnitOfWork } from '../repositories/UnitOfWork.js';

const serviceService = new ServiceService(new UnitOfWork());

export const getBySpecialist = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await serviceService.getBySpecialistId(Number(req.params.id));
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await serviceService.create(req.user!.userId, req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await serviceService.update(
      Number(req.params.id),
      req.user!.userId,
      req.body
    );
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    await serviceService.delete(Number(req.params.id), req.user!.userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
