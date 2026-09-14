import { Router } from 'express';
import { SupplierController } from '../controllers/supplier.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const supplierController = new SupplierController();

export const supplierRoutes = Router();

supplierRoutes.use(authMiddleware);
supplierRoutes.get('/', supplierController.findAll);
supplierRoutes.post('/', supplierController.create);
supplierRoutes.put('/:id', supplierController.update);
supplierRoutes.delete('/:id', supplierController.delete);