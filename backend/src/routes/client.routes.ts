import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const clientController = new ClientController();

export const clientRoutes = Router();

clientRoutes.use(authMiddleware);
clientRoutes.get('/', clientController.findAll);
clientRoutes.post('/', clientController.create);
clientRoutes.put('/:id', clientController.update);
clientRoutes.delete('/:id', clientController.delete);
