import { Router } from 'express';
import { ProductionController } from '../controllers/production.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const productionController = new ProductionController();

export const productionRoutes = Router();

productionRoutes.use(authMiddleware);
productionRoutes.get('/', productionController.findAll);
productionRoutes.post('/', productionController.create);
productionRoutes.put('/:id', productionController.update);
productionRoutes.delete('/:id', productionController.delete);
