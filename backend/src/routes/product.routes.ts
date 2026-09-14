import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const productController = new ProductController();

export const productRoutes = Router();

productRoutes.use(authMiddleware);
productRoutes.get('/', productController.findAll);
productRoutes.post('/', productController.create);
productRoutes.put('/:id', productController.update);
productRoutes.delete('/:id', productController.delete);
