import { Router, Request, Response } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { PaymentService } from '../services/payment.service';
import { authMiddleware } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';
import { DataSource } from 'typeorm';

export function createPaymentRoutes(dataSource: DataSource): Router {
  const router = Router();
  const paymentService = new PaymentService(dataSource);
  const controller = new PaymentController(paymentService);

  // Rotas públicas (webhooks)
  router.post('/webhook/:provider', asyncHandler((req: Request, res: Response) => controller.handleWebhook(req, res)));

  // Rotas privadas (requerem autenticação)
  router.use(authMiddleware);

  // Processar pagamento
  router.post('/', asyncHandler((req: Request, res: Response) => controller.processPayment(req, res)));

  // Autorizar pagamento
  router.post('/authorize', asyncHandler((req: Request, res: Response) => controller.authorizePayment(req, res)));

  // Capturar pagamento autorizado
  router.post('/:id/capture', asyncHandler((req: Request, res: Response) => controller.capturePayment(req, res)));

  // Reembolsar pagamento
  router.post('/:id/refund', asyncHandler((req: Request, res: Response) => controller.refundPayment(req, res)));

  // Obter detalhes do pagamento
  router.get('/:id', asyncHandler((req: Request, res: Response) => controller.getPayment(req, res)));

  // Obter status do pagamento
  router.get('/:id/status', asyncHandler((req: Request, res: Response) => controller.getPaymentStatus(req, res)));

  // Obter pagamentos de uma venda
  router.get('/sale/:saleId', asyncHandler((req: Request, res: Response) => controller.getPaymentsBySale(req, res)));

  // Obter pagamentos de um pedido
  router.get('/order/:orderId', asyncHandler((req: Request, res: Response) => controller.getPaymentsByOrder(req, res)));

  // Obter estatísticas
  router.get('/stats', asyncHandler((req: Request, res: Response) => controller.getPaymentStats(req, res)));

  // Obter provedores disponíveis
  router.get('/providers', asyncHandler((req: Request, res: Response) => controller.getAvailableProviders(req, res)));

  return router;
}

export const paymentRoutes = Router();
