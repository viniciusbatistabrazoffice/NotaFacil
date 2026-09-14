import { Router } from 'express';
import { CashController } from '../controllers/cash.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const cashController = new CashController();

export const cashRoutes = Router();

cashRoutes.use(authMiddleware);

// Subrotas de caixa
cashRoutes.get('/balance', cashController.getBalance);
cashRoutes.get('/movements', cashController.getMovements);
cashRoutes.post('/deposit', cashController.deposit);
cashRoutes.post('/withdrawal', cashController.withdrawal);
cashRoutes.get('/reconciliation', cashController.getReconciliation);
cashRoutes.post('/reconciliation', cashController.createReconciliation);
cashRoutes.get('/daily-report', cashController.getDailyReport);
