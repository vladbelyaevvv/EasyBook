import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import {
  getAllUsers, getUserById, updateUser, deleteUser,
  getAllSpecialists, getSpecialistById, updateSpecialist, deleteSpecialist,
  getAllServices, getServiceById, updateService, deleteService,
  getAllAppointments, getAppointmentById, updateAppointment, deleteAppointment,
  getAllReviews, deleteReview,
} from '../controllers/AdminController.js';

const router = Router();

router.use(authenticate, requireRole('ADMIN'));

router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

router.get('/specialists', getAllSpecialists);
router.get('/specialists/:id', getSpecialistById);
router.put('/specialists/:id', updateSpecialist);
router.delete('/specialists/:id', deleteSpecialist);

router.get('/services', getAllServices);
router.get('/services/:id', getServiceById);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

router.get('/appointments', getAllAppointments);
router.get('/appointments/:id', getAppointmentById);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);

router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);

export default router;
