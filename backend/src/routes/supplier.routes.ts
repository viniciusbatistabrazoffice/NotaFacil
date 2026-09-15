import { Router } from 'express';
import { SupplierController } from '../controllers/supplier.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const supplierController = new SupplierController();

export const supplierRoutes = Router();

supplierRoutes.use(authMiddleware);
supplierRoutes.get('/', asyncHandler((req, res) => supplierController.findAll(req, res)));
supplierRoutes.post('/', asyncHandler((req, res) => supplierController.create(req, res)));
supplierRoutes.put('/:id', asyncHandler((req, res) => supplierController.update(req, res)));
supplierRoutes.delete('/:id', asyncHandler((req, res) => supplierController.delete(req, res)));