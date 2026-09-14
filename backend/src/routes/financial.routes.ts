import { Router } from 'express';
import { FinancialController } from '../controllers/financial.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const financialController = new FinancialController();

export const financialRoutes = Router();

financialRoutes.use(authMiddleware);
financialRoutes.get('/cash-summary', financialController.cashSummary);
financialRoutes.get('/overview', financialController.overview);
financialRoutes.get('/report', financialController.report);
financialRoutes.get('/transactions', financialController.findAll);
financialRoutes.post('/transactions', financialController.create);
financialRoutes.patch('/transactions/:id', financialController.update);
financialRoutes.delete('/transactions/:id', financialController.delete);