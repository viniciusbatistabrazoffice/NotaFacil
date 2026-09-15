import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const productController = new ProductController();

export const productRoutes = Router();

productRoutes.use(authMiddleware);
productRoutes.get('/', asyncHandler((req, res) => productController.findAll(req, res)));
productRoutes.post('/', asyncHandler((req, res) => productController.create(req, res)));
productRoutes.put('/:id', asyncHandler((req, res) => productController.update(req, res)));
productRoutes.delete('/:id', asyncHandler((req, res) => productController.delete(req, res)));
