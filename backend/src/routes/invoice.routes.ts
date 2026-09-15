import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const invoiceController = new InvoiceController();

export const invoiceRoutes = Router();

invoiceRoutes.use(authMiddleware);
invoiceRoutes.get('/', asyncHandler((req, res) => invoiceController.findAll(req, res)));
invoiceRoutes.post('/', asyncHandler((req, res) => invoiceController.create(req, res)));
invoiceRoutes.get('/:id', asyncHandler((req, res) => invoiceController.findById(req, res)));
invoiceRoutes.put('/:id', asyncHandler((req, res) => invoiceController.update(req, res)));
invoiceRoutes.delete('/:id', asyncHandler((req, res) => invoiceController.delete(req, res)));
