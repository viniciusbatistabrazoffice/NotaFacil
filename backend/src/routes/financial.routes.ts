import { Router } from 'express';
import { FinancialController } from '../controllers/financial.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const financialController = new FinancialController();

export const financialRoutes = Router();

financialRoutes.use(authMiddleware);
financialRoutes.get('/cash-summary', asyncHandler((req, res) => financialController.cashSummary(req, res)));
financialRoutes.get('/overview', asyncHandler((req, res) => financialController.overview(req, res)));
financialRoutes.get('/report', asyncHandler((req, res) => financialController.report(req, res)));
financialRoutes.get('/transactions', asyncHandler((req, res) => financialController.findAll(req, res)));
financialRoutes.post('/transactions', asyncHandler((req, res) => financialController.create(req, res)));
financialRoutes.patch('/transactions/:id', asyncHandler((req, res) => financialController.update(req, res)));
financialRoutes.delete('/transactions/:id', asyncHandler((req, res) => financialController.delete(req, res)));