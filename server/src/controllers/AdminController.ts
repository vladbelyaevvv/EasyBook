import type { Request, Response } from 'express';
import { UnitOfWork } from '../repositories/UnitOfWork.js';

const uow = new UnitOfWork();

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await uow.users.findAll();
    res.json(users.map(u => {
      const { passwordHash, ...user } = u;
      return user;
    }));
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await uow.users.findById(Number(req.params.id));
    if (!user) { res.status(404).json({ message: 'User not found' }); return; }
    const { passwordHash, ...safe } = user;
    res.json(safe);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await uow.users.update(Number(req.params.id), req.body);
    const { passwordHash, ...safe } = user;
    res.json(safe);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    await uow.users.delete(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAllSpecialists = async (_req: Request, res: Response): Promise<void> => {
  try {
    const specialists = await uow.specialists.findAll();
    res.json(specialists);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getSpecialistById = async (req: Request, res: Response): Promise<void> => {
  try {
    const specialist = await uow.specialists.findById(Number(req.params.id));
    if (!specialist) { res.status(404).json({ message: 'Specialist not found' }); return; }
    res.json(specialist);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateSpecialist = async (req: Request, res: Response): Promise<void> => {
  try {
    const specialist = await uow.specialists.update(Number(req.params.id), req.body);
    res.json(specialist);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteSpecialist = async (req: Request, res: Response): Promise<void> => {
  try {
    await uow.specialists.delete(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAllServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await uow.services.findAll();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getServiceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await uow.services.findById(Number(req.params.id));
    if (!service) { res.status(404).json({ message: 'Service not found' }); return; }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await uow.services.update(Number(req.params.id), req.body);
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    await uow.services.delete(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAllAppointments = async (_req: Request, res: Response): Promise<void> => {
  try {
    const appointments = await uow.appointments.findAll();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const appointment = await uow.appointments.findById(Number(req.params.id));
    if (!appointment) { res.status(404).json({ message: 'Appointment not found' }); return; }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, ...rest } = req.body;
    if (status) {
      const appointment = await uow.appointments.updateStatus(Number(req.params.id), status);
      res.json(appointment);
      return;
    }
    res.status(400).json({ message: 'Nothing to update' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    await uow.appointments.delete(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getAllReviews = async (_req: Request, res: Response): Promise<void> => {
  try {
    const reviews = await uow.reviews.findAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteReview = async (req: Request, res: Response): Promise<void> => {
  try {
    await uow.reviews.delete(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
