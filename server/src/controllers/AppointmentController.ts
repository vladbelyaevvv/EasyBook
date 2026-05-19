import type { Request, Response } from 'express';
import { AppointmentService } from '../services/AppointmentService.js';
import { UnitOfWork } from '../repositories/UnitOfWork.js';

const appointmentService = new AppointmentService(new UnitOfWork());

export const getMyAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await appointmentService.getMyAppointments(
      req.user!.userId,
      req.user!.role
    );
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await appointmentService.create(req.user!.userId, req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await appointmentService.updateStatus(
      Number(req.params.id),
      req.user!.userId,
      req.user!.role,
      req.body
    );
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const cancel = async (req: Request, res: Response): Promise<void> => {
  try {
    await appointmentService.cancel(Number(req.params.id), req.user!.userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
