import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const orderController = new OrderController();

export const orderRoutes = Router();

orderRoutes.use(authMiddleware);

orderRoutes.get('/', orderController.findAll);
orderRoutes.post('/', orderController.create);
orderRoutes.get('/:id', orderController.findById);
orderRoutes.put('/:id', orderController.update);
orderRoutes.delete('/:id', orderController.delete);
