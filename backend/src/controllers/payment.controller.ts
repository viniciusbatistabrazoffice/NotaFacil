import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { PaymentMethod, PaymentProvider } from '../entities/tenant/Payment';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  /**
   * Processa um pagamento
   * POST /payments
   */
  async processPayment(req: Request, res: Response) {
    try {
      const { saleId, orderId, amount, method, provider, cardToken, metadata } = req.body;

      if (!amount || !method || !provider) {
        return res.status(400).json({
          error: 'Missing required fields: amount, method, provider',
        });
      }

      if (!saleId && !orderId) {
        return res.status(400).json({
          error: 'Either saleId or orderId is required',
        });
      }

      const payment = await this.paymentService.processPayment(
        saleId || null,
        orderId || null,
        amount,
        method as PaymentMethod,
        provider as PaymentProvider,
        cardToken,
        metadata
      );

      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Autoriza um pagamento
   * POST /payments/authorize
   */
  async authorizePayment(req: Request, res: Response) {
    try {
      const { saleId, orderId, amount, method, provider, cardToken } = req.body;

      if (!amount || !method || !provider) {
        return res.status(400).json({
          error: 'Missing required fields: amount, method, provider',
        });
      }

      const payment = await this.paymentService.authorizePayment(
        saleId || null,
        orderId || null,
        amount,
        method as PaymentMethod,
        provider as PaymentProvider,
        cardToken
      );

      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Captura um pagamento autorizado
   * POST /payments/:id/capture
   */
  async capturePayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      const payment = await this.paymentService.capturePayment(id, amount);

      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Reembolsa um pagamento
   * POST /payments/:id/refund
   */
  async refundPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { amount, reason } = req.body;

      const payment = await this.paymentService.refundPayment(id, amount, reason);

      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Obtém detalhes de um pagamento
   * GET /payments/:id
   */
  async getPayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await this.paymentService['repository'].findPaymentById(id);

      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtém pagamentos de uma venda
   * GET /payments/sale/:saleId
   */
  async getPaymentsBySale(req: Request, res: Response) {
    try {
      const { saleId } = req.params;
      const payments = await this.paymentService.getPaymentsBySaleId(saleId);

      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtém pagamentos de um pedido
   * GET /payments/order/:orderId
   */
  async getPaymentsByOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const payments = await this.paymentService.getPaymentsByOrderId(Number(orderId));

      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtém status de um pagamento
   * GET /payments/:id/status
   */
  async getPaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const status = await this.paymentService.getPaymentStatus(id);

      res.json({ id, status });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Obtém estatísticas de pagamentos
   * GET /payments/stats
   */
  async getPaymentStats(req: Request, res: Response) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: 'startDate and endDate are required',
        });
      }

      const stats = await this.paymentService.getPaymentStats(
        new Date(startDate as string),
        new Date(endDate as string)
      );

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Obtém provedores disponíveis
   * GET /payments/providers
   */
  async getAvailableProviders(req: Request, res: Response) {
    try {
      const providers = this.paymentService.getAvailableProviders();

      res.json({ providers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Processa webhook de pagamento
   * POST /payments/webhook/:provider
   */
  async handleWebhook(req: Request, res: Response) {
    try {
      const { provider } = req.params;
      const { type, data } = req.body;

      if (!type || !data) {
        return res.status(400).json({
          error: 'Missing required fields: type, data',
        });
      }

      const result = await this.paymentService.processWebhook(
        provider as PaymentProvider,
        type,
        data
      );

      res.json({ success: true, result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
