import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import specialistRoutes from './routes/specialist.routes.js';
import serviceRoutes from './routes/service.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import reviewRoutes from './routes/review.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/specialists', specialistRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
