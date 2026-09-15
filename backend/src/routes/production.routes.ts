import { Router } from 'express';
import { ProductionController } from '../controllers/production.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const productionController = new ProductionController();

export const productionRoutes = Router();

productionRoutes.use(authMiddleware);
productionRoutes.get('/', asyncHandler((req, res) => productionController.findAll(req, res)));
productionRoutes.post('/', asyncHandler((req, res) => productionController.create(req, res)));
productionRoutes.put('/:id', asyncHandler((req, res) => productionController.update(req, res)));
productionRoutes.delete('/:id', asyncHandler((req, res) => productionController.delete(req, res)));
