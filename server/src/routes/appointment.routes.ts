import { Router } from 'express';
import { getMyAppointments, create, updateStatus, cancel } from '../controllers/AppointmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getMyAppointments);
router.post('/', authenticate, create);
router.put('/:id/status', authenticate, updateStatus);
router.delete('/:id', authenticate, cancel);

export default router;
