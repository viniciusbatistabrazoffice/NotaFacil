import { Router } from 'express';
import { userRoutes } from './user.routes';
import { authRoutes } from './auth.routes';
import { orderRoutes } from './order.routes';
import { financialRoutes } from './financial.routes';
import { supplierRoutes } from './supplier.routes';
import { supplyRoutes } from './supply.routes';
import { productRoutes } from './product.routes';
import { clientRoutes } from './client.routes';
import { productionRoutes } from './production.routes';
import { invoiceRoutes } from './invoice.routes';
import { cashRoutes } from './cash.routes';
import { saleRoutes } from './sale.routes';

export const routes = Router();

routes.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/orders', orderRoutes);
routes.use('/financial', financialRoutes);
routes.use('/suppliers', supplierRoutes);
routes.use('/supplies', supplyRoutes);
routes.use('/products', productRoutes);
routes.use('/clients', clientRoutes);
routes.use('/productions', productionRoutes);
routes.use('/invoices', invoiceRoutes);
routes.use('/caixa', cashRoutes);
routes.use('/sales', saleRoutes);
