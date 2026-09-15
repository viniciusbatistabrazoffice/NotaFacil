import { Router } from 'express';
import { SupplyController } from '../controllers/supply.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const supplyController = new SupplyController();

export const supplyRoutes = Router();

supplyRoutes.use(authMiddleware);
supplyRoutes.get('/', asyncHandler((req, res) => supplyController.findAll(req, res)));
supplyRoutes.post('/', asyncHandler((req, res) => supplyController.create(req, res)));
supplyRoutes.put('/:id', asyncHandler((req, res) => supplyController.update(req, res)));
supplyRoutes.delete('/:id', asyncHandler((req, res) => supplyController.delete(req, res)));
