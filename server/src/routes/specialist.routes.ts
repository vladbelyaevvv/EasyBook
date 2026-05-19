import { Router } from 'express';
import { getAll, getById, getMe, create, update } from '../controllers/SpecialistController.js';
import { getBySpecialist as getServices } from '../controllers/ServiceController.js';
import { getBySpecialist as getReviews } from '../controllers/ReviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', getAll);
router.get('/me', authenticate, getMe);
router.get('/:id', getById);
router.get('/:id/services', getServices);
router.get('/:id/reviews', getReviews);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);

export default router;
