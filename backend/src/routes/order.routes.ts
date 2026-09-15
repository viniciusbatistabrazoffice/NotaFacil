import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const orderController = new OrderController();

export const orderRoutes = Router();

orderRoutes.use(authMiddleware);

orderRoutes.get('/', asyncHandler((req, res) => orderController.findAll(req, res)));
orderRoutes.post('/', asyncHandler((req, res) => orderController.create(req, res)));
orderRoutes.get('/:id', asyncHandler((req, res) => orderController.findById(req, res)));
orderRoutes.put('/:id', asyncHandler((req, res) => orderController.update(req, res)));
orderRoutes.delete('/:id', asyncHandler((req, res) => orderController.delete(req, res)));
