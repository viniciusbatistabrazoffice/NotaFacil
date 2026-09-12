import { Router } from 'express';
import { userRoutes } from './user.routes';
import { authRoutes } from './auth.routes';

export const routes = Router();

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
