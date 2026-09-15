import { Router } from 'express';
import { CashController } from '../controllers/cash.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';

const cashController = new CashController();

export const cashRoutes = Router();

cashRoutes.use(authMiddleware);

// Subrotas de caixa
cashRoutes.get('/balance', asyncHandler((req, res) => cashController.getBalance(req, res)));
cashRoutes.get('/movements', asyncHandler((req, res) => cashController.getMovements(req, res)));
cashRoutes.post('/deposit', asyncHandler((req, res) => cashController.deposit(req, res)));
cashRoutes.post('/withdrawal', asyncHandler((req, res) => cashController.withdrawal(req, res)));
cashRoutes.get('/reconciliation', asyncHandler((req, res) => cashController.getReconciliation(req, res)));
cashRoutes.post('/reconciliation', asyncHandler((req, res) => cashController.createReconciliation(req, res)));
cashRoutes.get('/daily-report', asyncHandler((req, res) => cashController.getDailyReport(req, res)));
