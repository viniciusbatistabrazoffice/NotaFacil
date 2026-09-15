import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const saleController = new SaleController();

export const saleRoutes = Router();

saleRoutes.use(authMiddleware);

// List sales and create new sale
saleRoutes.get('/', asyncHandler((req, res) => saleController.listSales.call(saleController, req, res)));
saleRoutes.post('/', asyncHandler((req, res) => saleController.createSale.call(saleController, req, res)));

// Get specific sale
saleRoutes.get('/:id', asyncHandler((req, res) => saleController.getSale.call(saleController, req, res)));

// Complete and cancel sale
saleRoutes.post('/:id/complete', asyncHandler((req, res) => saleController.completeSale.call(saleController, req, res)));
saleRoutes.post('/:id/cancel', asyncHandler((req, res) => saleController.cancelSale.call(saleController, req, res)));

// Manage sale items
saleRoutes.put('/:id/items/:itemId', asyncHandler((req, res) => saleController.updateSaleItem.call(saleController, req, res)));
saleRoutes.delete('/:id/items/:itemId', asyncHandler((req, res) => saleController.removeSaleItem.call(saleController, req, res)));

// Reports
saleRoutes.get('/reports/daily', asyncHandler((req, res) => saleController.getDailySalesReport.call(saleController, req, res)));
saleRoutes.get('/reports/metrics', asyncHandler((req, res) => saleController.getSalesMetrics.call(saleController, req, res)));
