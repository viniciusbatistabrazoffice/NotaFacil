import { Router } from 'express';
import { InvoiceController } from '../controllers/invoice.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const invoiceController = new InvoiceController();

export const invoiceRoutes = Router();

invoiceRoutes.use(authMiddleware);
invoiceRoutes.get('/', invoiceController.findAll);
invoiceRoutes.post('/', invoiceController.create);
invoiceRoutes.get('/:id', invoiceController.findById);
invoiceRoutes.put('/:id', invoiceController.update);
invoiceRoutes.delete('/:id', invoiceController.delete);
