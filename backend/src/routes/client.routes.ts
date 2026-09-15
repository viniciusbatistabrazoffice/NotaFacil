import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const clientController = new ClientController();

export const clientRoutes = Router();

clientRoutes.use(authMiddleware);
clientRoutes.get('/', asyncHandler((req, res) => clientController.findAll(req, res)));
clientRoutes.post('/', asyncHandler((req, res) => clientController.create(req, res)));
clientRoutes.put('/:id', asyncHandler((req, res) => clientController.update(req, res)));
clientRoutes.delete('/:id', asyncHandler((req, res) => clientController.delete(req, res)));
