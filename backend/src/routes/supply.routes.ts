import { Router } from 'express';
import { SupplyController } from '../controllers/supply.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const supplyController = new SupplyController();

export const supplyRoutes = Router();

supplyRoutes.use(authMiddleware);
supplyRoutes.get('/', supplyController.findAll);
supplyRoutes.post('/', supplyController.create);
supplyRoutes.put('/:id', supplyController.update);
supplyRoutes.delete('/:id', supplyController.delete);
