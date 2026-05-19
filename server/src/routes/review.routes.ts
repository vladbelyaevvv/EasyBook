import { Router } from 'express';
import { create, remove } from '../controllers/ReviewController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, create);
router.delete('/:id', authenticate, remove);

export default router;
