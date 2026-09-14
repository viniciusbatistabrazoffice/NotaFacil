import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const saleController = new SaleController();

export const saleRoutes = Router();

saleRoutes.use(authMiddleware);

// List sales and create new sale
saleRoutes.get('/', saleController.listSales.bind(saleController));
saleRoutes.post('/', saleController.createSale.bind(saleController));

// Get specific sale
saleRoutes.get('/:id', saleController.getSale.bind(saleController));

// Complete and cancel sale
saleRoutes.post('/:id/complete', saleController.completeSale.bind(saleController));
saleRoutes.post('/:id/cancel', saleController.cancelSale.bind(saleController));

// Manage sale items
saleRoutes.put('/:id/items/:itemId', saleController.updateSaleItem.bind(saleController));
saleRoutes.delete('/:id/items/:itemId', saleController.removeSaleItem.bind(saleController));

// Reports
saleRoutes.get('/reports/daily', saleController.getDailySalesReport.bind(saleController));
saleRoutes.get('/reports/metrics', saleController.getSalesMetrics.bind(saleController));
