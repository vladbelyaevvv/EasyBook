import { Router } from 'express';
import { create, update, remove } from '../controllers/ServiceController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);

export default router;
